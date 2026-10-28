(function(){
'use strict';
var C=window.SITE_CONFIG||{};
var $=function(s,c){return(c||document).querySelector(s)},$$=function(s,c){return[].slice.call((c||document).querySelectorAll(s))};
var calm=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(pointer:fine)').matches;
var mouse={x:innerWidth/2,y:innerHeight/2};
var resume=C.RESUME_URL||(C.WORKER_URL?C.WORKER_URL+'/resume':'#contact');
$$('[data-resume]').forEach(function(a){a.href=resume;if(resume[0]!=='#'){a.target='_blank';a.rel='noopener'}});

/* cursor glow */
addEventListener('pointermove',function(e){mouse.x=e.clientX;mouse.y=e.clientY;$('#glow').style.transform='translate('+e.clientX+'px,'+e.clientY+'px)'});
if(!fine)$('#glow').style.display='none';

/* data-point network that reacts to the cursor */
(function(){var c=$('#net'),x=c.getContext('2d'),P=[],W,H,N;if(calm){c.remove();return}
  function size(){W=c.width=innerWidth;H=c.height=innerHeight;N=Math.min(80,Math.floor(W*H/18000));P=[];for(var i=0;i<N;i++)P.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35})}
  function draw(){x.clearRect(0,0,W,H);
    for(var i=0;i<N;i++){var p=P[i];p.x+=p.vx;p.y+=p.vy;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;
      var dx=mouse.x-p.x,dy=mouse.y-p.y,d=Math.hypot(dx,dy);if(d<170){p.x+=dx*.012;p.y+=dy*.012}
      x.fillStyle=d<170?'rgba(220,20,60,.95)':'rgba(220,20,60,.45)';x.beginPath();x.arc(p.x,p.y,d<170?2.8:1.8,0,6.3);x.fill();
      for(var j=i+1;j<N;j++){var q=P[j],l=Math.hypot(p.x-q.x,p.y-q.y);if(l<130){x.strokeStyle='rgba(220,20,60,'+(.3*(1-l/130))+')';x.beginPath();x.moveTo(p.x,p.y);x.lineTo(q.x,q.y);x.stroke()}}}
    requestAnimationFrame(draw)}
  addEventListener('resize',size);size();draw()})();

/* background orbs (parallax) */
var secs=['.about','.experience','.services','.skills','.certifications','.education','.contact'];
var orbs=[];
secs.forEach(function(s){var el=$(s);if(!el)return;['a','b'].forEach(function(k,i){var o=document.createElement('i');o.className='orb '+k;el.insertBefore(o,el.firstChild);orbs.push({o:o,s:el,v:i?.12:-.1})})});

/* glare + tilt on cards */
var cards='.services .serv-content .card,.cert-card,.experience-item,.edu-row,.course-panel,.about .about-content .left img,.contact .right form';
$$(cards).forEach(function(el){
  if(el.tagName==='IMG')return;
  el.classList.add('fx');var g=document.createElement('span');g.className='glare';el.appendChild(g);
  el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px');
    if(fine&&!calm&&!el.matches('form,.edu-row')){var px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;el.classList.add('tilting');el.style.transform='perspective(900px) rotateY('+px*8+'deg) rotateX('+(-py*8)+'deg) scale(1.02)'}});
  el.addEventListener('pointerleave',function(){el.style.transform='';});
});

/* magnetic buttons */
if(fine&&!calm)$$('.home-content a,.about-btns a,.button-area button,#ai-fab').forEach(function(b){
  b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.25)+'px '+((e.clientY-r.top-r.height/2)*.3)+'px'});
  b.addEventListener('pointerleave',function(){b.style.translate=''})});

/* scroll reveals */
if(!calm&&'IntersectionObserver'in window){
  var map=[['section .title','rv'],['.about .left','rv rv-l'],['.about .right','rv rv-r'],['.experience-item:nth-child(odd)','rv rv-l'],['.experience-item:nth-child(even)','rv rv-r'],
   ['.services .card','rv'],['.skills .column .text,.skills .column>p','rv'],['.group-label','rv rv-l'],['.tools','rv'],['.cert-card','rv'],['.edu-row:nth-child(odd)','rv rv-l'],['.edu-row:nth-child(even)','rv rv-r'],
   ['.course-head,.course-sub','rv'],['.course-panel','rv'],['.contact .column.left','rv rv-l'],['.contact .column.right','rv rv-r']];
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var el=e.target;el.classList.add('in');io.unobserve(el);
    setTimeout(function(){el.classList.remove('rv','rv-l','rv-r','in');el.style.removeProperty('--d')},1700)}})},{threshold:.15,rootMargin:'0px 0px -6% 0px'});
  map.forEach(function(m){$$(m[0]).forEach(function(el,i){var kids=el.parentNode.children,idx=[].indexOf.call(kids,el);el.className+=' '+m[1];el.style.setProperty('--d',Math.min(idx,5)*.12+'s');io.observe(el)})})}

/* experience: tags stagger index */
$$('.experience-item .tech-tags').forEach(function(t){$$('span',t).forEach(function(s,i){s.style.setProperty('--i',i)})});
var exp=$('.exp-content'),dot;if(exp){dot=document.createElement('div');dot.className='exp-dot';exp.appendChild(dot)}

/* one rAF-throttled scroll loop */
var tick=false;
function frame(){tick=false;
  var h=document.documentElement;$('#bar').style.transform='scaleX('+(scrollY/(h.scrollHeight-innerHeight||1))+')';
  if(!calm){orbs.forEach(function(r){var b=r.s.getBoundingClientRect();if(b.bottom<-200||b.top>innerHeight+200)return;r.o.style.transform='translate3d(0,'+((b.top+b.height/2-innerHeight/2)*r.v)+'px,0)'});
    var hc=$('.home-content');if(hc&&scrollY<innerHeight){hc.style.transform='translateY('+scrollY*.35+'px)';hc.style.opacity=Math.max(0,1-scrollY/(innerHeight*.7))}}
  if(exp){var r=exp.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight*.6-r.top)/r.height));exp.style.setProperty('--p',p);
    $$('.experience-item',exp).forEach(function(it){it.classList.toggle('lit',it.getBoundingClientRect().top<innerHeight*.62)})}}
addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(frame)}},{passive:true});addEventListener('resize',frame);frame();

/* ---------- AI assistant (answers come from your own portfolio content) ---------- */
var A=function(h,t){return'<a href="'+h+'"'+(h[0]==='#'?'':' target="_blank" rel="noopener"')+'>'+t+'</a>'};
var GH='https://github.com/Chauhansahiil',LI='https://www.linkedin.com/in/sahil-chauhan-490b0021a/';
var KB=[
 {k:'resume cv download pdf',a:'Here is Sahil\'s resume: '+A(resume,'Download resume')},
 {k:'hire hiring available availability job role opportunity open work',a:'Sahil is open to Data Analyst roles. '+A('#contact','Send him a message')+' or email chauhansahil03115@gmail.com, and I can share his resume too.'},
 {k:'contact email reach phone message talk',a:'Email: chauhansahil03115@gmail.com. Or use the '+A('#contact','contact form')+', or find him on '+A(LI,'LinkedIn')+'.'},
 {k:'customer trends analysis retail dashboard sql power bi',a:'Customer Trends Analysis: Sahil cleaned retail customer data with Python (Pandas), analysed segments, loyalty and purchase drivers in SQL, and built an interactive Power BI dashboard. '+A(GH+'/Customer-Trends-Analysis-using-SQL-Python-and-Power-BI','See the repo')+'.'},
 {k:'blockchain banking metamask web3 ethereum crypto',a:'Secure Banking System on Blockchain: built with MetaMask and Web3 for cryptocurrency transactions, with detailed PDF transaction records. '+A(GH+'/Secure-Banking-System-Using-Blockchain-Technology-','See the repo')+'.'},
 {k:'project projects built portfolio github repo',a:'Two main projects: <b>Customer Trends Analysis</b> (SQL, Python, Power BI) and a <b>Secure Banking System on Blockchain</b> (MetaMask, Web3). Ask about either one, or see '+A('#services','Projects')+'. GitHub: '+A(GH,'Chauhansahiil')+'.'},
 {k:'internship experience intern company worked kulturehire codesoft tenet',a:'Three internships: Full Stack Developer at Tenet Computer and Communication (Dec 2024 – Jun 2025), Data Analyst at KultureHire (Sep – Oct 2024), and Python Programming at CodeSoft (Aug – Sep 2023). '+A('#experience','See details')+'.'},
 {k:'full stack react node developer tenet',a:'At Tenet, Sahil worked on front-end with HTML, CSS, JavaScript and React, back-end with Node.js and Express, and helped with MySQL, MongoDB and API integration.'},
 {k:'skills tools tech stack technologies know good',a:'Analysis: SQL, Excel, Power BI (DAX), Seaborn, EDA. Programming: Python, R, C++. ML and AI: GenAI, LLM, PyTorch, TensorFlow, RAG. Cloud: AWS, CI/CD, REST API. Databases: MySQL, MongoDB, Snowflake. '+A('#Skills','See all skills')+'.'},
 {k:'python pandas numpy',a:'Sahil uses Python with Pandas and NumPy for cleaning, processing and analysing data, in his CodeSoft internship and the Customer Trends Analysis project.'},
 {k:'education degree college university btech b.tech cgpa grade marks study studied',a:'B.Tech in Artificial Intelligence, G H Raisoni College of Engineering and Management, Nagpur (2021 – 2025), CGPA 6.96 / 10. XII (HSC), Sindhu College, Nagpur, 2021, 77%.'},
 {k:'course courses coursework subjects syllabus learn',a:'Coursework includes Machine Learning, Neural Networks, Reinforcement Learning, NLP, Computer Vision and Deep Learning, SQL and DBMS, Statistics and Probability, and Big Data Computing.'},
 {k:'certification certifications certificate certified accenture ibm nvidia forage',a:'Certifications: Accenture Data Analytics and Visualization (Forage), Data Analysis with Python (Cognitive Class, IBM), Fundamentals of Deep Learning (NVIDIA), and Certified Ethereum Developer Program (Indian Blockchain Institute).'},
 {k:'ai genai llm machine learning ml deep learning rag',a:'Sahil studied AI at B.Tech level and works with GenAI, LLMs, RAG, PyTorch and TensorFlow, alongside machine learning fundamentals and feature engineering.'},
 {k:'where location live based city nagpur india',a:'Sahil is based in Nagpur, Maharashtra, India.'},
 {k:'who about yourself introduce sahil background',a:'Sahil Chauhan is a B.Tech graduate in AI from Nagpur who turns raw data into dashboards and insights using SQL, Excel, Power BI and Python. He has three internships and two projects. '+A('#about','More about him')+'.'},
 {k:'hello hi hey',a:'Hi! Ask me about Sahil\'s projects, skills, experience, education, or ask for his resume.'}
];
var CH=['Get his resume','Show his projects','What are his skills?','Where did he intern?','Education','How can I contact him?'];
var box=$('#ai'),msgs=$('#msgs'),inp=$('#ai-in');
function add(h,me){var d=document.createElement('div');d.className='m '+(me?'me':'bot');if(me)d.textContent=h;else d.innerHTML=h;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d}
function match(q){var w=q.toLowerCase().replace(/[^a-z0-9. ]/g,' ').split(/\s+/).filter(Boolean),best=null,top=0;
  KB.forEach(function(e){var s=0,ks=e.k.split(' ');w.forEach(function(t){if(t.length>1&&ks.some(function(k){return k===t||(t.length>3&&(k.indexOf(t)===0||t.indexOf(k)===0))}))s++});if(s>top){top=s;best=e}});return best}
var hist=[],AI=C.AI_ENDPOINT||(C.WORKER_URL?C.WORKER_URL+'/chat':'');
function fmt(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/(https?:\/\/[^\s)]+[^\s).,;:])/g,'<a href="$1" target="_blank" rel="noopener">$1</a>').replace(/\n/g,'<br>')}
function ask(q){q=q.trim();if(!q)return;add(q,true);var t=add('<span class="dots"><i></i><i></i><i></i></span>');
  function say(h){setTimeout(function(){t.innerHTML=h;msgs.scrollTop=msgs.scrollHeight},calm?0:300)}
  var hit=match(q),fb='I only know what is on this portfolio. Try asking about his projects, skills, experience, education or resume, or '+A('#contact','message Sahil directly')+'.';
  if(hit&&/^resume/.test(hit.k))return say(hit.a);
  if(!AI)return say(hit?hit.a:fb);
  fetch(AI,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q,history:hist.slice(-6)})})
   .then(function(r){if(!r.ok)throw 0;return r.json()})
   .then(function(j){if(!j.answer)throw 0;hist.push({role:'user',content:q},{role:'assistant',content:j.answer});say(fmt(j.answer))})
   .catch(function(){say(hit?hit.a:fb)})}
function openAI(v){box.hidden=!v;$('#ai-fab').style.display=v?'none':'';if(v){inp.focus();if(!msgs.children.length){add('Hi, I\'m Sahil\'s AI assistant. Ask me about his projects, skills, experience or education, or ask for his resume.');
  CH.forEach(function(c){var b=document.createElement('button');b.type='button';b.textContent=c;b.onclick=function(){ask(c)};$('#chips').appendChild(b)})}}}
$$('[data-open-ai]').forEach(function(b){b.addEventListener('click',function(){openAI(true)})});
$('#ai-x').onclick=function(){openAI(false)};
$('#ai-form').addEventListener('submit',function(e){e.preventDefault();ask(inp.value);inp.value=''});
addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openAI(box.hidden)}if(e.key==='Escape'&&!box.hidden)openAI(false)});
msgs.addEventListener('click',function(e){if(e.target.tagName==='A'&&e.target.getAttribute('href')[0]==='#')openAI(false)});
})();