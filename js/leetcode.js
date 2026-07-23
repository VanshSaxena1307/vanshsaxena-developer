/* ============================================
   VANSH SAXENA PORTFOLIO — LEETCODE.JS
   Fetches LeetCode solved-problem stats from
   public third-party APIs (LeetCode's own
   GraphQL endpoint blocks cross-origin browser
   requests via CORS, so it can't be called
   directly from a deployed site).
   ============================================ */

(function () {
  'use strict';

  const USERNAME = 'Vansh_Saxena_2007';

  /* DOM refs */
  const loadingEl = document.getElementById('lc-loading');
  const statsEl   = document.getElementById('lc-stats');
  const totalBox  = document.getElementById('lc-total-box');
  const errorEl   = document.getElementById('lc-error');
  const easyEl    = document.getElementById('lc-easy');
  const medEl     = document.getElementById('lc-med');
  const hardEl    = document.getElementById('lc-hard');
  const totalEl   = document.getElementById('lc-total');

  if (!loadingEl) return;

  /* ---- Count-up animation ---- */
  function animateCount(el, target, duration = 1000) {
    if (!target || target === 0) { el.textContent = '0'; return; }
    const start = performance.now();
    function step(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---- Render stats ---- */
  function renderStats({ easy, medium, hard, total }) {
    loadingEl.style.display  = 'none';
    statsEl.style.display    = 'grid';
    totalBox.style.display   = 'block';
    errorEl.style.display    = 'none';
    if (refreshBtn) refreshBtn.style.display = 'none';

    easyEl.textContent  = '0';
    medEl.textContent   = '0';
    hardEl.textContent  = '0';
    totalEl.textContent = '0';

    animateCount(easyEl,  easy,   900);
    animateCount(medEl,   medium, 900);
    animateCount(hardEl,  hard,   900);
    animateCount(totalEl, total,  1100);
  }

  /* ---- Show error (never crashes the page — stats section just
          falls back to a friendly message + link to the live profile) ---- */
  const refreshBtn = document.getElementById('lc-refresh');

  function showError(msg) {
    loadingEl.style.display  = 'none';
    statsEl.style.display    = 'none';
    totalBox.style.display   = 'none';
    errorEl.style.display    = 'block';
    if (refreshBtn) refreshBtn.style.display = 'block';
    errorEl.innerHTML = `
      <p style="margin-bottom:6px">⚠️ ${msg || 'Could not load stats.'}</p>
      <a href="https://leetcode.com/u/Vansh_Saxena_2007/" target="_blank"
         style="color:var(--accent2);font-size:0.78rem;text-decoration:underline;">
         View live profile →
      </a>`;
  }

  /* Small helper: fetch with a timeout that works even if AbortSignal.timeout
     isn't supported (older Safari) */
  function fetchWithTimeout(url, opts = {}, timeoutMs = 10000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { ...opts, signal: controller.signal }).finally(() => clearTimeout(id));
  }

  /* ============================================================
     METHOD 1 — alfa-leetcode-api (actively maintained, CORS-friendly,
     hosted on Render's free tier — the free instance can take up to
     ~30-50s to "wake up" from a cold start, hence the longer timeout).
     Correct endpoint is /:username/solved (not /userProfile/:username).
  ============================================================ */
  async function fetchAlfa() {
    const res = await fetchWithTimeout(
      `https://alfa-leetcode-api.onrender.com/${USERNAME}/solved`,
      {}, 20000
    );
    if (!res.ok) throw new Error(`Alfa HTTP ${res.status}`);
    const d = await res.json();

    const easy  = d.easySolved  ?? d.easySolvedCount  ?? d?.byDifficulty?.easy   ?? 0;
    const med   = d.mediumSolved ?? d.mediumSolvedCount ?? d?.byDifficulty?.medium ?? 0;
    const hard  = d.hardSolved  ?? d.hardSolvedCount  ?? d?.byDifficulty?.hard   ?? 0;
    const total = d.solvedProblem ?? d.totalSolved ?? (easy + med + hard);

    if (!total && !easy && !med && !hard) throw new Error('Alfa: empty/unexpected shape');
    return { easy, medium: med, hard, total };
  }

  /* ============================================================
     METHOD 2 — leetcode-stats.tashif.codes (actively maintained
     alternative stats API, CORS-friendly)
  ============================================================ */
  async function fetchTashif() {
    const res = await fetchWithTimeout(
      `https://leetcode-stats.tashif.codes/${USERNAME}/stats`,
      {}, 12000
    );
    if (!res.ok) throw new Error(`Tashif HTTP ${res.status}`);
    const json = await res.json();
    const d = json?.data;
    if (!d) throw new Error('Tashif: unexpected shape');

    const easy  = d?.byDifficulty?.easy   ?? 0;
    const med   = d?.byDifficulty?.medium ?? 0;
    const hard  = d?.byDifficulty?.hard   ?? 0;
    const total = d.totalSolved ?? (easy + med + hard);

    return { easy, medium: med, hard, total };
  }

  /* ============================================================
     METHOD 3 — LeetCode's own GraphQL endpoint, called directly.
     Kept as a long-shot fallback: LeetCode does not send
     Access-Control-Allow-Origin for third-party sites, so most
     browsers will block this with a CORS error — but it's free
     to try, and costs nothing if it fails fast.
  ============================================================ */
  async function fetchGraphQL() {
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats: submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }`;

    const res = await fetchWithTimeout('https://leetcode.com/graphql/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { username: USERNAME } }),
    }, 8000);

    if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}`);
    const json = await res.json();

    const nums = json?.data?.matchedUser?.submitStats?.acSubmissionNum;
    if (!nums) throw new Error('GraphQL: unexpected shape');

    const get = (d) => nums.find(x => x.difficulty === d)?.count ?? 0;
    return {
      easy:   get('Easy'),
      medium: get('Medium'),
      hard:   get('Hard'),
      total:  get('All'),
    };
  }

  /* ============================================================
     RUNNER — try each method in order, cache result in
     sessionStorage so repeat visits don't re-fetch
  ============================================================ */
  const CACHE_KEY = 'lc_stats_vansh';
  const CACHE_TTL = 15 * 60 * 1000; /* 15 minutes */

  function loadFromCache() {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const { ts, data } = JSON.parse(raw);
      if (Date.now() - ts < CACHE_TTL) return data;
    } catch (_) { /* sessionStorage unavailable (private mode etc) — just refetch */ }
    return null;
  }

  function saveToCache(data) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
    } catch (_) { /* storage full/unavailable — non-fatal */ }
  }

  async function loadStats() {
    const cached = loadFromCache();
    if (cached) {
      renderStats(cached);
      return;
    }

    const methods = [
      { name: 'Alfa API',  fn: fetchAlfa    },
      { name: 'Tashif API',fn: fetchTashif  },
      { name: 'GraphQL',   fn: fetchGraphQL },
    ];

    for (const { name, fn } of methods) {
      try {
        const stats = await fn();
        saveToCache(stats);
        renderStats(stats);
        return;
      } catch (e) {
        console.warn(`[LeetCode] ${name} failed:`, e.message);
      }
    }

    /* All methods failed — never crash, just show the graceful fallback */
    showError('Live stats temporarily unavailable.');
  }

  /* Small delay so page paint isn't blocked */
  setTimeout(loadStats, 600);

  /* ---- Refresh button (id="lc-refresh") ---- */
  document.addEventListener('click', (e) => {
    if (e.target.id === 'lc-refresh') {
      sessionStorage.removeItem(CACHE_KEY);
      loadingEl.style.display  = 'flex';
      statsEl.style.display    = 'none';
      totalBox.style.display   = 'none';
      errorEl.style.display    = 'none';
      setTimeout(loadStats, 300);
    }
  });

})();
