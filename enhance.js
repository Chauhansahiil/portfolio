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
var secs=['.about','.experience','.services','.skills','.certifications','.education','.fit','.contact'];
var orbs=[];
secs.forEach(function(s){var el=$(s);if(!el)return;['a','b'].forEach(function(k,i){var o=document.createElement('i');o.className='orb '+k;el.insertBefore(o,el.firstChild);orbs.push({o:o,s:el,v:i?.12:-.1})})});

/* glare + tilt on cards */
var cards='.services .serv-content .card,.cert-card,.experience-item,.edu-row,.course-panel,.about .about-content .left img,.contact .right form';
$$(cards).forEach(function(el){
  if(el.tagName==='IMG')return;
  el.classList.add('fx');var g=document.createElement('span');g.className='glare';el.appendChild(g);
  el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.style.setProperty('--mx',(e.clientX-r.left)+'px');el.style.setProperty('--my',(e.clientY-r.top)+'px');
    if(fine&&!calm&&!el.matches('form,.edu-row')){var px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;el.classList.add('tilting');el.style.transform='perspective(900px) rotateY('+px*8+'deg) rotateX('+(-py*8)+'deg) scale(1.02)'}});
  el.addEventListener('pointerleave',function(){el.classList.remove('tilting');el.style.transform='';});
});

/* education: score rings that fill when they scroll into view */
$$('.edu-row').forEach(function(r){var s=$('.edu-score',r);if(!s)return;var t=s.textContent,m=t.match(/([\d.]+)\s*(?:\/\s*([\d.]+))?\s*(%)?/);if(!m)return;
  var v=parseFloat(m[1]),mx=m[2]?parseFloat(m[2]):100,p=Math.max(0,Math.min(1,v/mx));
  var d=document.createElement('div');d.className='edu-ring';d.setAttribute('role','img');d.setAttribute('aria-label',t.trim());d.style.setProperty('--p',p);
  d.innerHTML='<svg viewBox="0 0 120 120" aria-hidden="true"><circle class="rt" cx="60" cy="60" r="52"/><circle class="rf" cx="60" cy="60" r="52"/></svg><div><b>'+(m[3]?Math.round(v)+'%':v.toFixed(2))+'</b><small>'+(m[3]?'XII score':'CGPA / '+mx)+'</small></div>';
  r.appendChild(d);
  if(calm||!('IntersectionObserver'in window)){d.classList.add('on');return}
  new IntersectionObserver(function(es,o){es.forEach(function(x){if(x.isIntersecting){setTimeout(function(){d.classList.add('on')},350);o.disconnect()}})},{threshold:.5}).observe(d)});

/* magnetic buttons */
if(fine&&!calm)$$('.home-content a,.about-btns a,.button-area button,#ai-fab').forEach(function(b){
  b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.25)+'px '+((e.clientY-r.top-r.height/2)*.3)+'px'});
  b.addEventListener('pointerleave',function(){b.style.translate=''})});

/* scroll reveals */
if(!calm&&'IntersectionObserver'in window){
  var map=[['section .title','rv'],['.about .left','rv rv-l'],['.about .right','rv rv-r'],['.experience-item:nth-child(odd)','rv rv-l'],['.experience-item:nth-child(even)','rv rv-r'],
   ['.services .card','rv'],['.skills .column .text,.skills .column>p','rv'],['.group-label','rv rv-l'],['.tools','rv'],['.cert-card','rv'],['.edu-row:nth-child(odd)','rv rv-l'],['.edu-row:nth-child(even)','rv rv-r'],
   ['.course-head,.course-sub','rv'],['.course-panel li','rv'],['.course-panel','rv'],['.contact .column.left','rv rv-l'],['.contact .column.right','rv rv-r']];
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var el=e.target;el.classList.add('in');io.unobserve(el);
    setTimeout(function(){el.classList.remove('rv','rv-l','rv-r','in');el.style.removeProperty('--d')},1700)}})},{threshold:.15,rootMargin:'0px 0px -6% 0px'});
  map.forEach(function(m){$$(m[0]).forEach(function(el,i){var kids=el.parentNode.children,idx=[].indexOf.call(kids,el);el.className+=' '+m[1];el.style.setProperty('--d',Math.min(idx,5)*.12+'s');io.observe(el)})})}

setTimeout(function(){$$('.title.rv').forEach(function(t){var r=t.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0)t.classList.add('in')})},1800);
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

/* ---------- job fit checker (runs only in the browser, nothing is sent) ---------- */
(function(){var inp=$('#fit-in'),out=$('#fit-out');if(!inp)return;
 var SK=[
  ['SQL',/\bsql\b|mysql|postgres|t-?sql/i,'Strong SQL: CTEs, window functions and subqueries in his Customer Trends project, plus MySQL at Tenet.'],
  ['Python',/\bpython\b|pandas|numpy/i,'Python with Pandas and NumPy (about 4 out of 5 for analytics work), used at CodeSoft and in his projects.'],
  ['Power BI / DAX',/power ?bi|\bdax\b/i,'Built an interactive Power BI dashboard; DAX is in his skill set.'],
  ['Tableau',/tableau/i,'He knows Tableau; Power BI is the tool he has used most.'],
  ['Data visualization',/data visuali[sz]ation|visuali[sz]ation tools?|dashboards?|business intelligence|\bBI tools?\b/i,'Power BI dashboard, Tableau and Seaborn.'],
  ['Excel',/\bexcel\b|\bpivot|vlookup|google sheets/i,'Pivot tables (beginner to pro at KultureHire), VLOOKUP and data cleaning frameworks.'],
  ['Data cleaning and EDA',/data clean|clean(?:ing)?\b.{0,25}\bdata|\bpreprocess|exploratory|\beda\b|data prep|wrangl/i,'Cleaning and EDA in Pandas, and standardisation frameworks at KultureHire.'],
  ['Statistics',/statistic|hypothesis|probability|a\/b test/i,'Statistics and Probability coursework.'],
  ['Machine learning',/machine learning|\bml\b|scikit|sklearn|feature engineering/i,'ML coursework (neural networks, reinforcement learning, NLP, computer vision) and feature engineering.'],
  ['Deep learning',/deep learning|pytorch|tensorflow|neural network/i,'NVIDIA Fundamentals of Deep Learning; PyTorch and TensorFlow in his skills.'],
  ['GenAI / LLMs',/gen ?ai|generative ai|\bllms?\b|\brag\b|prompt engineering/i,'GenAI, LLM and RAG are in his skill set.'],
  ['NLP',/\bnlp\b|natural language processing/i,'NLP coursework.'],
  ['R',/(?:python|sql|sas|julia|stata)\s*(?:,|\/|and|or|&)\s*R(?![a-z])|\bR\s*(?:,|\/|programming|language|studio)/i,'R is listed in his programming skills.'],
  ['C++',/c\+\+/i,'C++ is listed in his programming skills.'],
  ['JavaScript / React',/javascript|\breact(?:\.?js)?\b(?!\s+(?:to|quickly|fast))|\bhtml\b|\bcss\b/i,'Front-end work with HTML, CSS, JavaScript and React at Tenet.'],
  ['Node.js / Express',/node\.?js|express\.?js/i,'Back-end work with Node.js and Express at Tenet.'],
  ['REST APIs',/\brest(?:ful)?\b|api (?:development|integration|design)|(?:build|develop|design)\w* apis?/i,'API integration at Tenet; REST API is in his skills.'],
  ['MongoDB',/mongo/i,'MongoDB at Tenet.'],
  ['Snowflake',/snowflake/i,'Snowflake is in his database skills.'],
  ['AWS',/\baws\b|amazon web/i,'AWS is listed in his cloud skills.'],
  ['CI/CD',/ci ?\/ ?cd/i,'CI/CD is listed in his skills.'],
  ['Git / GitHub',/\bgit\b|github/i,'His projects are public on GitHub.'],
  ['Blockchain / Web3',/blockchain|web3|ethereum|smart contract/i,'Co-authored a published paper, MetaMask and Web3.js, and an Ethereum developer certificate.']];
 var GAP=[
  ['Looker / Looker Studio',/looker/i,'Power BI or Tableau'],['Qlik',/qlik/i,'Power BI or Tableau'],['Google Analytics',/google analytics|\bga4\b/i,'Excel and Power BI'],
  ['Spark / PySpark',/spark/i,'Python, Pandas and SQL'],['Hadoop / Hive / Presto',/hadoop|\bhive\b|presto/i,'SQL and Snowflake'],['Kafka',/kafka/i,'Python and REST APIs'],
  ['Airflow',/airflow/i,'Python and CI/CD'],['dbt',/\bdbt\b/i,'SQL and Snowflake'],['Azure',/azure/i,'AWS and Snowflake'],['Google Cloud / BigQuery',/\bgcp\b|google cloud|bigquery/i,'AWS and Snowflake'],
  ['Redshift',/redshift/i,'Snowflake and SQL'],['Databricks',/databricks/i,'Python and Snowflake'],['Docker / Kubernetes / Terraform',/docker|kubernetes|terraform/i,'CI/CD and AWS'],
  ['Java / Spring',/\bjava\b|spring boot/i,'JavaScript and Python'],['C# / .NET',/c#|\.net\b|asp\.net/i,'JavaScript and Python'],['Go / Rust / PHP / Ruby',/\bgolang\b|\brust\b|\bphp\b|\bruby\b/i,'Python and JavaScript'],
  ['Angular / Vue',/angular|\bvue(?:\.?js)?\b/i,'React'],['Django / Flask / FastAPI',/django|flask|fastapi/i,'Python and Node.js'],['Android / iOS / Flutter',/android|\bios\b|flutter|kotlin|swift/i,'React and JavaScript'],
  ['Scala',/scala/i,'Python'],['SAS / SPSS / Stata',/\bsas\b|spss|stata/i,'Python and R'],['MATLAB',/matlab/i,'Python and R'],
  ['Alteryx / Informatica / Talend',/alteryx|informatica|talend/i,'Python and SQL'],['SSIS / SSRS',/ssis|ssrs/i,'SQL'],['Oracle / SAP / Salesforce',/oracle|\bsap\b|salesforce/i,'SQL and MySQL'],
  ['Elasticsearch / Splunk',/elasticsearch|splunk/i,'SQL and MongoDB']];
 var NUM={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10};
 var PREF=/nice to have|preferred|good to have|bonus|desirable|an advantage|a plus\b|plus point|optional/i,HEAD=/^(required|requirements?|qualifications?|must have|responsibilit|what you|key |about you|skills|candidate profile|job description|duties)/i;
 var SAMPLE="Data Analyst\nWe are looking for a Data Analyst with 1+ years of experience. You will build dashboards in Power BI or Tableau, write SQL queries to answer business questions, clean data using Python (Pandas) and Excel, and present insights to stakeholders. Nice to have: Azure, Airflow.";
 function li(n,t){return'<li><b>'+n+'</b><span>'+t+'</span></li>'}
 function show(h){out.innerHTML=h;out.hidden=false;out.scrollIntoView({behavior:calm?'auto':'smooth',block:'nearest'})}
 function note(m){return'<p class="fit-note">'+m+'</p>'}
 function years(t){var best=0,re=/(\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten)\s*\+?\s*(?:-|\u2013|to)?\s*(?:\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten)?\s*\+?\s*(?:years?|yrs?)\b/gi,m;
  while((m=re.exec(t))){var a=m[1].toLowerCase(),n=NUM[a]||parseInt(a,10);if(!n||n>25)continue;var ctx=t.slice(Math.max(0,m.index-70),m.index+m[0].length+70);
   if(/experience|\bexp\b|background|track record|working as|worked/i.test(ctx)&&!/\bago\b|founded|established|in business/i.test(ctx))best=Math.max(best,n)}return best}
 function run(){var t=inp.value.trim();
  if(t.split(/\s+/).length<8)return show(note('That is too short to be a job description. Please paste the full text, including the requirements.'));
  var letters=t.replace(/[^\p{L}]/gu,''),latin=t.replace(/[^A-Za-z]/g,'');
  if(letters.length&&latin.length/letters.length<.6)return show(note('I can only compare English job descriptions. Please paste the text in English.'));
  var cls={},lines=t.split(/\n+|[.!?;]\s+/),mode='req';
  lines.forEach(function(L){var s=L.trim();if(!s)return;var head=s.length<60&&(/:\s*$/.test(s)||((PREF.test(s)||HEAD.test(s))&&s.split(/\s+/).length<=3));
   if(head&&PREF.test(s))mode='pref';else if(head&&HEAD.test(s))mode='req';
   var m=(!head&&PREF.test(s))?'pref':mode;
   SK.concat(GAP).forEach(function(k){if(k[1].test(s)){if(m==='req')cls[k[0]]='req';else if(!cls[k[0]])cls[k[0]]='pref'}})});
  var hit=SK.filter(function(s){return cls[s[0]]}),miss=GAP.filter(function(s){return cls[s[0]]});
  if(hit.some(function(s){return s[0]==='Power BI / DAX'||s[0]==='Tableau'}))hit=hit.filter(function(s){return s[0]!=='Data visualization'});
  if(!hit.length&&!miss.length){var nt=/nurse|doctor|physician|driver|mechanic|electrician|plumber|chef|waiter|teacher|accountant|cashier|warehouse|civil engineer|mechanical engineer|security guard|sales executive|retail/i.test(t);
   return show(note(nt?'This looks like a role outside data, AI and software, so Sahil\'s profile is not a match for it.':'I could not recognise any tools or skills here that I can compare with Sahil\'s profile. It may not be a technical job description, or it may use terms I do not check. Please read it yourself or ask Sahil directly.'))}
  var yrs=years(t),senior=/\bsenior\b|\bprincipal\b|\bstaff\b|\bhead of\b|\bdirector\b|\bmanager\b|\blead\b|\barchitect\b/i.test(t.slice(0,160)),
   fresher=/fresher|entry[- ]level|trainee|junior|campus hire|recent graduate|fresh graduate|new graduate|0\s*(?:-|\u2013|to)\s*[12]\s*years?|no (?:prior )?experience (?:required|needed)/i.test(t),
   masters=/master'?s|\bm\.?sc\b|\bm\.?tech\b|\bmba\b|post[- ]?graduate|\bph\.?d\b|doctorate/i.test(t);
  var rh=hit.filter(function(s){return cls[s[0]]==='req'}),rm=miss.filter(function(s){return cls[s[0]]==='req'}),rt=rh.length+rm.length;
  var bt=hit.length+miss.length,ratio=rt?rh.length/rt:hit.length/bt,sk=ratio>=.7?'ok':(ratio>=.4?'warn':'bad');
  var ex=(yrs>=4||(senior&&yrs>=3))?'bad':((yrs>=2||senior)?'warn':'ok');
  var lv=(sk==='bad'||ex==='bad')?'bad':((sk==='warn'||ex==='warn')?'warn':'ok');
  var title={ok:'Good match',warn:'Partial match',bad:'Not a match yet'}[lv];
  if(ex==='bad'&&sk!=='bad')title='Too senior for now';else if(ex==='warn'&&sk==='ok')title='A stretch on experience';
  var parts=[];
  parts.push(rt?('Required skills: '+rh.length+' of '+rt+' are on Sahil\'s list.'):('Skills mentioned: '+hit.length+' of '+bt+' are on Sahil\'s list.'));
  if(yrs>=1)parts.push('The description asks for '+yrs+'+ years of experience. Sahil graduated in 2025 and has about one year of internship experience in total, around two months of it as a data analyst intern.');
  else if(fresher)parts.push('The description looks suitable for freshers or juniors.');
  else parts.push('No minimum experience is stated.');
  if(lv==='ok')parts.push('This reads as a reasonable fit for his current level.');
  if(ex==='bad')parts.push('Applying could still be worth a try if you are flexible on experience, but this is a stretch.');
  var h='<div class="fit-verdict '+lv+'"><b>'+title+'</b><span>'+parts.join(' ')+'</span></div><div class="fit-cols">'+
   '<div class="fit-col ok"><h4>Where he fits</h4><ul>'+(hit.length?hit.map(function(s){return li(s[0]+(cls[s[0]]==='pref'?' (nice to have)':''),s[2])}).join(''):'<li><span>No direct matches found.</span></li>')+'</ul></div>'+
   '<div class="fit-col no"><h4>Not on his list yet</h4><ul>'+(miss.length?miss.map(function(s){return li(s[0]+(cls[s[0]]==='pref'?' (nice to have)':''),'Not listed. Closest he works with: '+s[2]+'.')}).join(''):'<li><span>None of the tools I check for.</span></li>')+'</ul></div></div>';
  var ns=[];if(senior)ns.push('The title sounds senior, which may involve ownership or leading others.');if(masters)ns.push('It mentions a master\'s degree or PhD. Sahil holds a B.Tech.');
  ns.push('Not compared: location, salary, notice period, soft skills and domain knowledge. This is a keyword check against his portfolio, not a hiring decision, so please read the full description too.');
  h+='<ul class="fit-notes">'+ns.map(function(x){return'<li>'+x+'</li>'}).join('')+'</ul>';
  h+='<div class="fit-cta"><a class="pillbtn" href="'+resume+'"'+(resume[0]==='#'?'':' target="_blank" rel="noopener"')+'>Download resume</a><a class="pillbtn ghost" href="#contact">Contact Sahil</a><button type="button" class="pillbtn ghost" id="fit-ai">Ask the AI more</button></div>';
  show(h);var b=$('#fit-ai');if(b)b.onclick=function(){openAI(true)}}
 $('#fit-run').onclick=run;$('#fit-sample').onclick=function(){inp.value=SAMPLE;cnt();run()};
 function cnt(){$('#fit-count').textContent=inp.value.length+' / 6000'}inp.addEventListener('input',cnt)})();

/* ---------- AI assistant (answers come from your own portfolio content) ---------- */
var A=function(h,t){return'<a href="'+h+'"'+(h[0]==='#'?'':' target="_blank" rel="noopener"')+'>'+t+'</a>'};
var GH='https://github.com/Chauhansahiil',LI='https://www.linkedin.com/in/sahil-chauhan-490b0021a/';
var REPO=GH+'/Customer-Trends-Analysis-using-SQL-Python-and-Power-BI',PAPER='https://ijirt.org/publishedpaper/IJIRT170787_PAPER.pdf',ELEV=GH+'/Elevate-lms';
var KB=[
 {k:'resume cv download pdf',det:1,a:"Here is Sahil's resume: "+A(resume,'Download resume')},
 {k:'salary ctc lpa expectation compensation',det:1,a:"Sahil is looking for around 4.5 LPA, and he is open to a conversation based on the role, the responsibilities and the growth opportunities."},
 {k:'visa sponsorship authorisation authorization permit sponsor',det:1,a:"For roles in India, Sahil does not need any visa or sponsorship. For roles outside India, he would need visa sponsorship."},
 {k:'jd description checker',det:1,a:"Paste a job description into the "+A('#fit','Check the fit')+" section and you will see which of Sahil's skills match and where the gaps are. It runs in your browser and nothing is stored."},
 {k:'why hire choose reasons candidate fit',a:"Three reasons. First, hands-on analysis work: as a Data Analyst Intern at KultureHire he built data cleaning and standardisation frameworks in Excel and Power BI. Second, end-to-end project work: his Customer Trends Analysis project covers Pandas cleaning, SQL analysis and a Power BI dashboard. Third, an AI degree with Accenture, IBM and NVIDIA certifications. "+A('#services','See his projects')+"."},
 {k:'different unique stand apart freshers fresher special edge',a:"What sets Sahil apart is the mix. He has an AI degree, three internships across Python, data analysis and full-stack development, an end-to-end SQL, Python and Power BI project, and a co-authored research paper on blockchain banking. That range helps him understand how data is created and moves through applications, not just how it is analysed. He also learns quickly: at KultureHire he went from beginner to pro level in pivot table analysis."},
 {k:'strengths strength weakness weaknesses improve',a:"Sahil's strengths are the full analytics workflow, from cleaning data in Pandas to answering business questions in SQL and presenting them in Power BI, and learning quickly. He has also collaborated in a team on a published paper. A weakness he is working on is limited experience with large real-world business datasets, since most of his hands-on work is at project and internship scale. He is addressing it with larger end-to-end projects and by looking for a role with real business data."},
 {k:'customer trends findings find insights results found discover discovered conclusion learn',a:"In Customer Trends Analysis, Sahil used SQL to answer ten business questions on retail shopping data: who spends more by gender, age group and subscription, whether discounts and shipping type change spending, which products rate highest or are discounted most, and how customers split into New, Returning and Loyal groups. The actual figures are in the dashboard and report in the repo, and he is happy to walk you through them. "+A(REPO,'See the repo')+"."},
 {k:'dataset data size rows records csv source large',a:"The project uses a retail customer shopping dataset in CSV format, with details such as gender, age group, item and category, purchase amount, discount used, review rating, shipping type, subscription status and previous purchases. The exact row count is in the repo, and Sahil can tell you more on a call. "+A(REPO,'See the repo')+"."},
 {k:'hardest difficult challenge challenging toughest struggle problem faced',a:"Sahil found the analysis step the most demanding: turning broad business questions into precise SQL, such as grouping customers into New, Returning and Loyal segments and ranking the top products in each category with CTEs and a window function, while keeping the work consistent from Python to SQL to the Power BI dashboard."},
 {k:'customer trends analysis retail dashboard project',a:"Customer Trends Analysis is based on an open-source project by Amlan Mohanty, which Sahil worked through end to end: cleaning retail data with Python (Pandas), answering business questions in SQL, and building an interactive Power BI dashboard, with his own notebook, queries and report. "+A(REPO,'See the repo')+"."},
 {k:'blockchain banking metamask web3 ethereum crypto paper research published journal ijirt publication author coauthor',a:"Sahil co-authored a research paper, Secure Banking System Using Block-chain Technology, published in IJIRT (Volume 11, Issue 7, December 2024) with three classmates and Dr. Smita Nirkhi, head of the AI department. The system uses MetaMask and Web3.js with smart contracts built in Remix, SHA-256 hashing and token-based authentication, with separate user and admin modules. He worked on it as part of the team. "+A(PAPER,'Read the paper')+" or "+A(GH+'/Secure-Banking-System-Using-Blockchain-Technology-','see the repo')+"."},
 {k:'live screenshot screenshots demo link dashboard',a:"There is no public live dashboard link, but the Power BI file and the project report are in the GitHub repo. "+A(REPO,'Open the repo')+". For a walkthrough or screenshots, please "+A('#contact','contact Sahil')+" directly."},
 {k:'sql joins cte ctes window functions subquery query queries',a:"Sahil's SQL is strong and practical: he is comfortable with joins, aggregations, subqueries, CTEs and window functions. In the Customer Trends project he used CTEs, ROW_NUMBER for ranking top products, CASE logic for customer segments and subqueries for comparisons."},
 {k:'power dax measures bi',a:"Sahil built an interactive Power BI dashboard for the Customer Trends project, presenting the customer segment, loyalty and purchase-driver analysis, and DAX is part of his skill set. The dashboard file is in the repo, and he can walk through the specific measures in an interview. "+A(REPO,'Open the repo')+"."},
 {k:'tableau',a:"Yes, Sahil knows Tableau as well. Power BI is the dashboard tool he has used most, with Tableau as a second option."},
 {k:'python pandas numpy',a:"Sahil rates himself about 4 out of 5 in Python and Pandas for data analyst and business analyst work: cleaning and preparing data, exploring it, and automating routine analysis, as in his CodeSoft internship and the Customer Trends project."},
 {k:'kulturehire',a:"At KultureHire (Sep – Oct 2024), Sahil worked as a Data Analyst Intern. He went from beginner to pro level in pivot table analysis and built frameworks for standardising and cleaning data in Excel and Power BI."},
 {k:'tenet full stack react node developer elevate lms',a:"At Tenet (Dec 2024 – Jun 2025), Sahil worked as a Full Stack Developer Intern with React, Node.js and Express, MySQL and MongoDB, and API integration. One project he worked on there was Elevate LMS, a learning management system with a client and a server. "+A(ELEV,'See the repo')+"."},
 {k:'codesoft',a:"At CodeSoft (Aug – Sep 2023), Sahil wrote basic and intermediate Python programs and scripts for task automation, data processing and analysis, using NumPy and Pandas."},
 {k:'switch moved move transition change shift',a:"Sahil's degree is in AI, and data analysis is where that background and his interest in turning numbers into decisions meet. His full-stack internship gave him a solid grounding in applications, APIs and databases, which helps in analytics too, but his data work at KultureHire and in his projects pointed him toward analysis as the direction to grow in."},
 {k:'internship experience intern company worked',a:"Three internships: Full Stack Developer at Tenet Computer and Communication (Dec 2024 – Jun 2025), Data Analyst at KultureHire (Sep – Oct 2024), and Python Programming at CodeSoft (Aug – Sep 2023). "+A('#experience','See details')+"."},
 {k:'availability available notice period join immediately relocate relocation remote hybrid onsite city cities start',a:"Sahil's notice period is 15 days, and he can join immediately for roles within his home state, Maharashtra. He is open to relocating to any city and is fine with remote, hybrid or on-site work."},
 {k:'roles role looking interested position positions kind',a:"Sahil is looking at Data Analyst and related analytics roles, AI and ML, GenAI, Agentic AI, and Software Developer positions."},
 {k:'hire hiring opportunity open work',a:"Sahil is open to opportunities. "+A('#contact','Send him a message')+" or email chauhansahil03115@gmail.com, and I can share his resume too."},
 {k:'contact email reach phone message talk',a:"Email: chauhansahil03115@gmail.com. Or use the "+A('#contact','contact form')+", or find him on "+A(LI,'LinkedIn')+"."},
 {k:'project projects built portfolio github repo',a:"Sahil's main projects are Customer Trends Analysis (SQL, Python, Power BI) and a Secure Banking System on Blockchain (MetaMask, Web3), which is also a published paper. Ask about either, or see "+A('#services','Projects')+". GitHub: "+A(GH,'Chauhansahiil')+"."},
 {k:'skills tools tech stack technologies know good',a:"Analysis: SQL, Excel, Power BI (DAX), Tableau, Seaborn, EDA. Programming: Python, R, C++. ML and AI: GenAI, LLM, PyTorch, TensorFlow, RAG. Cloud: AWS, CI/CD, REST API. Databases: MySQL, MongoDB, Snowflake. "+A('#Skills','See all skills')+"."},
 {k:'education degree college university btech b.tech cgpa grade marks backlog backlogs gap percentage study studied',a:"B.Tech in Artificial Intelligence at G H Raisoni College of Engineering and Management, Nagpur (2021 – 2025), CGPA 6.96 / 10, after 77% in XII (HSC) at Sindhu College in 2021. His studies ran continuously, and alongside them he completed three internships, a published paper and certifications. His portfolio does not mention backlogs, so please ask him directly if you need that detail."},
 {k:'course courses coursework subjects syllabus',a:"Coursework includes Machine Learning, Neural Networks, Reinforcement Learning, NLP, Computer Vision and Deep Learning, SQL and DBMS, Statistics and Probability, and Big Data Computing."},
 {k:'certification certifications certificate certified accenture ibm nvidia forage',a:"Certifications: Accenture Data Analytics and Visualization (Forage), Data Analysis with Python (Cognitive Class, IBM), Fundamentals of Deep Learning (NVIDIA), and Certified Ethereum Developer Program (Indian Blockchain Institute)."},
 {k:'ai genai llm machine learning ml deep learning rag',a:"Sahil studied AI at B.Tech level and works with GenAI, LLMs, RAG, PyTorch and TensorFlow, alongside machine learning fundamentals and feature engineering."},
 {k:'languages language speak marathi hindi english german',a:"Sahil speaks Marathi (his mother tongue), Hindi and English, and has basic German."},
 {k:'hobbies hobby interests interest time cricket badminton games movies books carpentry',a:"Outside work, Sahil enjoys cricket, badminton and video games. He likes watching movies and reading, and does some carpentry work."},
 {k:'team teamwork collaborate collaboration group',a:"Sahil has worked in teams through his internships and through his published research paper, which he co-authored with three classmates and the head of the AI department."},
 {k:'where location live based city nagpur india',a:"Sahil is based in Nagpur, Maharashtra, India."},
 {k:'who about yourself introduce sahil background',a:"Sahil Chauhan is a B.Tech graduate in AI from Nagpur who turns raw data into dashboards and insights using SQL, Excel, Power BI, Tableau and Python. He has three internships, two projects and a published research paper. "+A('#about','More about him')+"."},
 {k:'hello hi hey',a:"Hi! Ask me about Sahil's projects, skills, experience, education, or ask for his resume."}
];
var ROLEBTN=[['Data Analyst','a Data Analyst'],['AI / ML','an AI and ML engineer'],['GenAI','GenAI'],['Agentic AI','Agentic AI'],['Software Developer','a Software Developer']];
var ROLES={
 da:"In three to five years, Sahil sees himself as a dependable data analyst who owns dashboards and reporting that teams actually rely on, and who is trusted to take a business question from raw data to a clear recommendation. He wants to deepen his SQL, Power BI, Tableau, Python and statistics, grow closer to the business side, and move toward a senior or business analytics role, mentoring newer analysts along the way.",
 ai:"As an AI and ML engineer, Sahil sees himself building and deploying machine learning solutions that solve real problems, not just models that look good in a notebook. He wants to build on his foundation in machine learning, neural networks, NLP and deep learning, learn production practices such as deployment and monitoring, and grow into an engineer who is trusted with end-to-end ML work.",
 gen:"In GenAI, Sahil sees himself building reliable LLM-powered applications, using retrieval-augmented generation (RAG), careful prompt design and evaluation so that answers are grounded in real data. Over three to five years he wants to move from building features to designing GenAI solutions end to end, with a strong focus on accuracy, safety and business value.",
 ag:"In Agentic AI, Sahil sees himself designing systems where AI agents plan, use tools and complete multi-step tasks dependably. He wants to combine his AI background with his full-stack experience, focus on reliability, guardrails and evaluation, and grow into someone who can take agent-based products from idea to production.",
 sw:"As a software developer, Sahil sees himself as a well-rounded full-stack engineer who builds clean, maintainable applications and takes ownership of what he ships. Starting from his React, Node.js, Express and database experience, he wants to grow into technical ownership and eventually lead small teams, bringing data and AI into the products he builds."};
function roleOf(s){if(/agentic|agent/.test(s))return'ag';if(/genai|gen ai|generative|llm/.test(s))return'gen';if(/data|analyst|analytics|business|\bbi\b/.test(s))return'da';if(/software|developer|full.?stack/.test(s))return'sw';if(/\bai\b|\bml\b|machine/.test(s))return'ai';return''}
function future(q){var s=q.toLowerCase();if(!/see (him|himself|yourself)|3 to 5|5 years|five years|three years|3 years|next few years|future|goals?|aspir|ambition|long.?term/.test(s))return'';var r=roleOf(s);if(r)return ROLES[r];
  return'Happy to share. Which role do you have in mind? '+ROLEBTN.map(function(b){return'<button type="button" class="rolebtn" data-q="Where does he see himself in 3 to 5 years as '+b[1]+'?">'+b[0]+'</button>'}).join(' ')}
var CH=['Why hire Sahil?','Best project','Availability','Get his resume','Match a job description','How can I contact him?'];
var NOPE={looker:'Power BI for dashboards',qlik:'Power BI for dashboards',azure:'AWS and Snowflake',gcp:'AWS and Snowflake',bigquery:'Snowflake and SQL',redshift:'Snowflake and SQL',spark:'Python, Pandas and SQL',pyspark:'Python, Pandas and SQL',hadoop:'SQL and Snowflake',kafka:'Python and REST APIs',airflow:'Python and CI/CD',dbt:'SQL and Snowflake',docker:'CI/CD and AWS',kubernetes:'CI/CD and AWS',scala:'Python and R',matlab:'Python and R',sas:'Python and R',spss:'Python and R'};
function toolCheck(q){var w=q.toLowerCase().replace(/[^a-z0-9 ]/g,' ').split(/\s+/);for(var i=0;i<w.length;i++)if(NOPE[w[i]])return w[i].charAt(0).toUpperCase()+w[i].slice(1)+' is not on Sahil\'s skills list yet. The closest he works with is '+NOPE[w[i]]+'. '+A('#Skills','See his skills')+'.';return''}
var box=$('#ai'),msgs=$('#msgs'),inp=$('#ai-in');
function add(h,me){var d=document.createElement('div');d.className='m '+(me?'me':'bot');if(me)d.textContent=h;else d.innerHTML=h;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d}
function match(q){var w=q.toLowerCase().replace(/[^a-z0-9. ]/g,' ').split(/\s+/).filter(Boolean),best=null,top=0;
  KB.forEach(function(e){var s=0,ks=e.k.split(' ');w.forEach(function(t){if(t.length>1&&ks.some(function(k){return k===t||(t.length>3&&(k.indexOf(t)===0||t.indexOf(k)===0))}))s++});if(s>top){top=s;best=e}});return best}
var hist=[],AI=C.AI_ENDPOINT||(C.WORKER_URL?C.WORKER_URL+'/chat':'');
function fmt(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/(https?:\/\/[^\s)]+[^\s).,;:])/g,'<a href="$1" target="_blank" rel="noopener">$1</a>').replace(/\n/g,'<br>')}
function ask(q){q=q.trim();if(!q)return;add(q,true);var t=add('<span class="dots"><i></i><i></i><i></i></span>');
  function say(h){setTimeout(function(){t.innerHTML=h;msgs.scrollTop=msgs.scrollHeight},calm?0:300)}
  var hit=match(q),fb='I only know what is on this portfolio. Try asking about his projects, skills, experience, education or resume, or '+A('#contact','message Sahil directly')+'.';
  if(hit&&hit.det)return say(hit.a);
  var tc=toolCheck(q);if(tc)return say(tc);
  var fu=future(q);if(fu)return say(fu);
  if(!AI)return say(hit?hit.a:fb);
  fetch(AI,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q,history:hist.slice(-6)})})
   .then(function(r){if(!r.ok)throw 0;return r.json()})
   .then(function(j){if(!j.answer)throw 0;hist.push({role:'user',content:q},{role:'assistant',content:j.answer});say(fmt(j.answer))})
   .catch(function(){say(hit?hit.a:fb)})}
function greet(){msgs.innerHTML='';hist=[];add('Hi, I\'m Sahil\'s AI assistant. Ask me anything about his projects, skills, experience or education, or ask for his resume.')}
function openAI(v){box.hidden=!v;$('#ai-fab').style.display=v?'none':'';if(v){inp.focus();if(!msgs.children.length)greet()}else $('#ai-fab').focus()}
(function(){msgs.setAttribute('aria-live','polite');
  CH.forEach(function(c){var b=document.createElement('button');b.type='button';b.textContent=c;b.onclick=function(){ask(c)};$('#chips').appendChild(b)});
  var n=document.createElement('p');n.className='ai-note';n.textContent='AI answers are based on Sahil\'s portfolio and may be imperfect.';box.insertBefore(n,$('#ai-form'));
  var c=document.createElement('button');c.type='button';c.className='ai-clear';c.textContent='Clear';c.onclick=greet;$('.ai-head').insertBefore(c,$('#ai-x'))})();
$$('[data-open-ai]').forEach(function(b){b.addEventListener('click',function(ev){ev.preventDefault();openAI(true)})});
$('#ai-x').onclick=function(){openAI(false)};
$('#ai-form').addEventListener('submit',function(e){e.preventDefault();ask(inp.value);inp.value=''});
addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openAI(box.hidden)}if(e.key==='Escape'&&!box.hidden)openAI(false)});
msgs.addEventListener('click',function(e){if(e.target.className==='rolebtn'){ask(e.target.getAttribute('data-q'));return}if(e.target.tagName==='A'&&e.target.getAttribute('href')[0]==='#')openAI(false)});
})();