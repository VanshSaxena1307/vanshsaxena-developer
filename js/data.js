/* LeetCode badges load live. To add them by hand instead, save the images in assets/images/badges/ and use
   badges:[{name:"50 Days Badge",img:"assets/images/badges/50days.png"}] inside leetcode below. */
/* Edit your content here. No need to touch the other files. */
var SITE={
  roles:["React • Node.js • Python • PostgreSQL","I build apps people actually use.","Open for SDE internships."],
  ticker:"/// OPEN FOR SDE INTERNSHIPS /// WEB DEVELOPMENT /// REACT /// NODE.JS /// PYTHON /// FAST /// ACCESSIBLE /// ",
  cv:"assets/Vansh_Saxena_CV.pdf",
  /* [skill, category] */
  stack:[["HTML5","MARKUP"],["CSS3","STYLING"],["JavaScript","LANGUAGE"],["React.js","LIBRARY"],["Tailwind CSS","STYLING"],["Vite","BUILD"],["Responsive Design","FRONTEND"],["Node.js","BACKEND"],["Express.js","FRAMEWORK"],["REST APIs","BACKEND"],["PostgreSQL","DATABASE"],["MySQL","DATABASE"],["Python","LANGUAGE"],["C++","LANGUAGE"],["Python Automation","SCRIPTING"],["Data Analysis","DATA"],["Git","VERSION"],["GitHub","OPS"],["VS Code","EDITOR"],["Vercel","DEPLOY"],["Render", "Deploy"],["Figma","DESIGN"],["Cyber Analysis","SECURITY"],["Debugging","CORE"]],
  /* [name, description, tags, link ("#" = coming soon), button label, image] */
  projects:[
    ["Hajiri","Role-based attendance and exemption platform for students, teachers, mentors and HODs. Used by about 200 users and still being upgraded.",["React","Node.js","PostgreSQL"],"https://attendance-companion-attendance-com.vercel.app/","LIVE DEMO","assets/images/hajiri.jpg"],
    ["Climora","Weather app with location search that shows live temperature, humidity and wind speed.",["React","JavaScript","Weather API"],"https://climora-living-weather.vercel.app","LIVE DEMO","assets/images/climora.jpg"],
    ["Expense Tracker","Track categorized expenses with a real-time balance.",["HTML","CSS","JavaScript"],"https://expense-tracker-psi-brown-79.vercel.app","LIVE DEMO","assets/images/expense-tracker.jpg"],
    ["Mulyankan","Academic dashboard that helps college professors grade student projects. In progress.",["In progress","Education"],"#","LIVE","assets/images/mulyankan.jpg"]
  ],
  github:{user:"VanshSaxena1307",badges:['2× Hackathon Semi-finalist','Hajiri: 200 users','13 Repos','9 Stars','Deloitte Virtual Intern','DSA Certified'],heat:["#9be9a8","#40c463","#216e39"],seed:11},
  leetcode:{user:"Vansh_Saxena_2007",badges:[],
    /* shown only if the live LeetCode request fails. Type your own numbers, e.g. solved:"192",easy:"72",medium:"86",hard:"34",rank:"921094" */
    fallback:{solved:"",easy:"",medium:"",hard:"",rank:""},heat:["#fcd9a0","#f5a742","#c2670a"],seed:29},
  /* CodeChef: numbers below are from your profile and refresh live when the API answers */
  codechef:{user:"lush_gaze_93",heat:["#bfd0ff","#7a9bff","#2f55d4"],badges:[
    {name:"Contest Contender Bronze",img:"https://cdn.codechef.com/images/badges/contest/bronze.svg"},
    {name:"Problem Solver Bronze",img:"https://cdn.codechef.com/images/badges/problem/bronze.svg"},
    "C++ Skill Test 93%","237 Problems Solved","11 Contests"]},
  /* Codeforces: rating, rank, contests, solved count and heatmap load live from the official API */
  codeforces:{user:"Vansh_Saxena_1307",heat:["#f9c0c2","#f0787d","#c9262c"],badges:[]}
};
