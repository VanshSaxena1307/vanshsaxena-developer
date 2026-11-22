/* Sounds: soft "tock" on click, tiny tick on hover, gentle chime on CV download, whoosh for the menu,
   plus a quiet cyberpunk background (slow pad + soft arpeggio + rare data blips).
   Synthesized with the Web Audio API (no files). Browsers only allow audio after the first tap/click/key press.
   Press M to mute/unmute. Own music instead: set sound.bg in js/data.js. */
(function () {
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    var ctx, master, echo, on = true, started = false, timer = null, au = null, lastEl = null, lastHover = 0, nextT = 0, step = 0;
    var CH = [[220, 261.63, 329.63], [174.61, 220, 261.63], [261.63, 329.63, 392], [196, 246.94, 293.66]], ROOT = [110, 87.31, 130.81, 98], PAT = [0, 1, 2, 1, 2, 1, 0, 1], SP = .55;
    function init() {
        if (ctx) return; ctx = new AC(); master = ctx.createGain(); master.gain.value = .5; master.connect(ctx.destination);
        echo = ctx.createDelay(1); echo.delayTime.value = .41; var fb = ctx.createGain(), lp = ctx.createBiquadFilter(); fb.gain.value = .4; lp.type = 'lowpass'; lp.frequency.value = 1400;
        echo.connect(lp); lp.connect(fb); fb.connect(echo); lp.connect(master)
    }
    function tone(f, d, type, v, to) {
        if (!on || !ctx) return; var t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
        o.type = type; o.frequency.setValueAtTime(f, t); if (to) o.frequency.exponentialRampToValueAtTime(to, t + d);
        g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g); g.connect(master); o.start(t); o.stop(t + d + .02)
    }
    function pluck(f, v) {
        if (!on || !ctx) return; var t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
        o.type = 'triangle'; o.frequency.value = f; lp.type = 'lowpass'; lp.frequency.value = 2200;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + 1.4);
        o.connect(lp); lp.connect(g); g.connect(master); g.connect(echo); o.start(t); o.stop(t + 1.5)
    }
    var SND = window.SND = {
        done: false,
        active: function () { return on && started },
        click: function () { tone(440, .08, 'sine', .2, 260) },
        hover: function () { var n = Date.now(); if (n - lastHover < 150) return; lastHover = n; tone(1320, .05, 'sine', .05) },
        type: function () { },
        chime: function () { [523.25, 659.25, 783.99].forEach(function (f, i) { setTimeout(function () { pluck(f, .09) }, i * 90) }) },
        whoosh: function (up) { tone(up ? 260 : 520, .2, 'sine', .06, up ? 600 : 240) }
    };
    /* cyberpunk background, scheduled ahead on the audio clock */
    function arp(f, v, t) {
        var o = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
        o.type = 'sawtooth'; o.frequency.value = f; lp.type = 'lowpass'; lp.frequency.value = 1100; lp.Q.value = 2;
        g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + .5);
        o.connect(lp); lp.connect(g); g.connect(master); g.connect(echo); o.start(t); o.stop(t + .55)
    }
    function pad(f, v, t, d) {
        [['sine', 1], ['triangle', 1.004]].forEach(function (x) {
            var o = ctx.createOscillator(), lp = ctx.createBiquadFilter(), g = ctx.createGain();
            o.type = x[0]; o.frequency.value = f * x[1]; lp.type = 'lowpass'; lp.frequency.value = 500;
            g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 1.2); g.gain.setValueAtTime(v, t + d - 1.4); g.gain.linearRampToValueAtTime(0, t + d);
            o.connect(lp); lp.connect(g); g.connect(master); o.start(t); o.stop(t + d + .05)
        })
    }
    function blip(t) {
        var o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(2400, t); o.frequency.exponentialRampToValueAtTime(3200, t + .04);
        g.gain.setValueAtTime(.008, t); g.gain.exponentialRampToValueAtTime(.0001, t + .06); o.connect(g); g.connect(master); o.start(t); o.stop(t + .08)
    }
    function sched() {
        if (!on || !ctx || document.hidden) return; if (nextT < ctx.currentTime) nextT = ctx.currentTime + .1;
        while (nextT < ctx.currentTime + .35) {
            var c = Math.floor(step / 8) % 4, k = step % 8;
            if (k == 0) pad(ROOT[c], .05, nextT, SP * 8 + 1);
            arp(CH[c][PAT[k]] * (k == 3 ? 2 : 1), .02, nextT);
            if (step % 19 == 11) blip(nextT + .27);
            nextT += SP; step++
        }
    }
    function loop() { clearInterval(timer); timer = setInterval(sched, 120) }
    function startBg() {
        var p = window.SITE && SITE.sound && SITE.sound.bg;
        if (p) { au = new Audio(p); au.loop = true; au.volume = .2; au.onerror = function () { au = null; loop() }; var pr = au.play(); if (pr && pr.catch) pr.catch(function () { au = null; loop() }) } else loop()
    }
    function start() { if (started) return; started = true; init(); if (ctx.state == 'suspended') ctx.resume(); startBg() }
    function setOn(v) { on = v; if (!started) return; if (v) { if (ctx.state == 'suspended') ctx.resume(); if (au) au.play().catch(function () { }); else loop() } else { clearInterval(timer); if (au) au.pause() } }
    function arm() { document.removeEventListener('pointerdown', arm); document.removeEventListener('keydown', arm); start() }
    document.addEventListener('pointerdown', arm); document.addEventListener('keydown', arm);
    document.addEventListener('keydown', function (e) { if ((e.key == 'm' || e.key == 'M') && !e.ctrlKey && !e.metaKey && !e.altKey && !/INPUT|TEXTAREA/.test((e.target || {}).tagName || '')) { if (!started) start(); setOn(!on) } });
    document.addEventListener('visibilitychange', function () { if (!ctx || !started) return; if (document.hidden) { ctx.suspend(); if (au) au.pause() } else if (on) { ctx.resume(); if (au) au.play().catch(function () { }) } });
    document.addEventListener('click', function (e) {
        if (!on || !started) return; var t = e.target; if (!t.closest || t.closest('#burger')) return;
        if (t.closest('#cv')) SND.chime(); else if (t.closest('a,button,.btn')) SND.click()
    });
    var bu = document.getElementById('burger'); if (bu) bu.addEventListener('click', function () { if (on && started) SND.whoosh(bu.getAttribute('aria-expanded') == 'true') });
    document.addEventListener('pointerover', function (e) {
        if (!on || !started || e.pointerType != 'mouse') return;
        var el = e.target.closest && e.target.closest('.box,.tech,.btn,.links a,.logo'); if (el !== lastEl) { lastEl = el; if (el) SND.hover() }
    });
})();
