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
if(fine&&!calm)$$('.home-content a,.about-btns a,.button-area button').forEach(function(b){
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
    var its=$$('.experience-item',exp),mid=innerHeight*.5,best=null,bd=1e9,inView=r.bottom>innerHeight*.15&&r.top<innerHeight*.85;
    its.forEach(function(it){var q=it.getBoundingClientRect(),d=Math.abs(q.top+q.height/2-mid);it.classList.toggle('lit',q.top<innerHeight*.62);if(d<bd){bd=d;best=it}});
    its.forEach(function(it){it.classList.toggle('active',inView&&bd<innerHeight*.6&&it===best)})}}
addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(frame)}},{passive:true});addEventListener('resize',frame);frame();

/* ---------- job fit checker (runs only in the browser, nothing is sent) ---------- */
var SKILLDATA=null;
(function(){var inp=$('#fit-in'),out=$('#fit-out');if(!inp)return;
 var SK=[
  ['SQL',/\bsql\b|mysql|postgres|t-?sql/i,'Strong SQL: CTEs, window functions and subqueries in his Customer Trends project, plus MySQL at Tenet.'],
  ['Python',/\bpython\b|pandas|numpy/i,'Python with Pandas and NumPy (about 4 out of 5 for analytics work), used at CodeSoft and in his projects.'],
  ['Power BI / DAX',/power ?bi|\bdax\b/i,'Built an interactive Power BI dashboard; DAX is in his skill set.'],
  ['Tableau',/tableau/i,'He knows Tableau; Power BI is the tool he has used most.'],
  ['Data visualization',/data visuali[sz]ation|visuali[sz]ation tools?|dashboards?|business intelligence|\bBI tools?\b/i,'Power BI dashboard, Tableau and Seaborn.'],
  ['Excel',/\bexcel\b|\bpivot|vlookup|google sheets|ms excel/i,'Pivot tables (beginner to pro at KultureHire), VLOOKUP and data cleaning frameworks.'],
  ['Data cleaning and EDA',/data clean|clean(?:ing)?\b.{0,25}\bdata|\bpreprocess|exploratory|\beda\b|data prep|wrangl/i,'Cleaning and EDA in Pandas, and standardisation frameworks at KultureHire.'],
  ['Statistics',/statistic|hypothesis|probability|a\/b test|mathematic|\bmaths?\b|quantitative|numeracy/i,'Statistics and Probability coursework, and quantitative analysis in his projects.'],
  ['Machine learning',/machine learning|\bml\b|scikit|sklearn|feature engineering/i,'ML coursework (neural networks, reinforcement learning, NLP, computer vision) and feature engineering.'],
  ['Deep learning',/deep learning|pytorch|tensorflow|neural network/i,'NVIDIA Fundamentals of Deep Learning; PyTorch and TensorFlow in his skills.'],
  ['GenAI / LLMs',/gen ?ai|generative ai|\bllms?\b|\brag\b|prompt engineering|large language models?|\bai models?\b|\bchatbots?\b/i,'GenAI, LLM and RAG are in his skill set.'],
  ['NLP',/\bnlp\b|natural language processing/i,'NLP coursework.'],
  ['R',/(?:python|sql|sas|julia|stata)\s*(?:,|\/|and|or|&)\s*R(?![a-z])|\bR\s*(?:,|\/|programming|language|studio)/i,'R is listed in his programming skills.'],
  ['C++',/c\+\+/i,'C++ is listed in his programming skills.'],
  ['JavaScript / React',/javascript|\breact(?:\.?js)?\b(?!\s+(?:to|quickly|fast))|\bhtml\b|\bcss\b/i,'Front-end work with HTML, CSS, JavaScript and React at Tenet.'],
  ['Node.js / Express',/node\.?js|express\.?js/i,'Back-end work with Node.js and Express at Tenet.'],
  ['REST APIs',/\brestful\b|\brest (?:api|apis|services?)\b|api (?:development|integration|design)|(?:build|develop|design)\w* apis?/i,'API integration at Tenet; REST API is in his skills.'],
  ['MongoDB',/mongo/i,'MongoDB at Tenet.'],
  ['Snowflake',/snowflake/i,'Snowflake is in his database skills.'],
  ['AWS',/\baws\b|amazon web/i,'AWS is listed in his cloud skills.'],
  ['CI/CD',/ci ?\/ ?cd/i,'CI/CD is listed in his skills.'],
  ['Git / GitHub',/\bgit\b|github/i,'His projects are public on GitHub.'],
  ['Blockchain / Web3',/blockchain|web3|ethereum|smart contract/i,'Co-authored a published paper, MetaMask and Web3.js, and an Ethereum developer certificate.'],
  ['Analytical and problem-solving skills',/analytical (?:skills?|questions?|thinking|reasoning|abilit\w*)|problem[- ]solving|logical (?:reasoning|thinking|puzzles?)|critical thinking|interpret data|identify (?:trends|patterns)|draw (?:meaningful )?(?:conclusions|insights)|data[- ]driven/i,'Analytical work in his Customer Trends project (SQL, Pandas, Power BI) and EDA.',0.6],
  ['English',/\benglish\b|reading, writing|written and verbal|verbal and written/i,'He speaks English, Hindi and Marathi.',0.6],
  ['Data analysis',/data analys[ie]s|analy[sz](?:e|ing) (?:large |complex )?(?:data|datasets|distributions|trends|numbers)|data analytics|analytics/i,'Data analysis with SQL, Python and Power BI in his Customer Trends project.',0.6],
  ['Reporting',/(?:prepar|generat|creat|build|produc|deliver|develop|maintain|run)\w*\s+(?:\w+\s+){0,3}reports?\b|ad[- ]hoc (?:requests? for )?reports?|\bmis reports?|recurring reports?|reporting (?:and|&) analytics/i,'Excel and Power BI reporting, including a Power BI dashboard.',0.6],
  ['Computer vision',/computer vision|opencv|image processing|\byolo\b/i,'Computer Vision and Deep Learning coursework.'],
  ['Reinforcement learning',/reinforcement learning/i,'Reinforcement Learning coursework.'],
  ['Big data concepts',/\bbig data\b/i,'Big Data Computing coursework.'],
  ['Object-oriented programming',/object[- ]oriented|\boop\b/i,'Programming in Python, C++ and JavaScript.',0.6]];
 var GAP=[
  ['Looker / Looker Studio',/looker/i,'Power BI or Tableau'],['Qlik',/qlik/i,'Power BI or Tableau'],['Google Analytics',/google analytics|\bga4\b/i,'Excel and Power BI'],
  ['Spark / PySpark',/\bspark\b|pyspark/i,'Python, Pandas and SQL'],['Hadoop / Hive / Presto',/hadoop|\bhive\b|presto/i,'SQL and Snowflake'],['Kafka',/kafka/i,'Python and REST APIs'],
  ['Airflow',/airflow/i,'Python and CI/CD'],['dbt',/\bdbt\b/i,'SQL and Snowflake'],['Azure',/azure/i,'AWS and Snowflake'],['Google Cloud / BigQuery',/\bgcp\b|google cloud|bigquery/i,'AWS and Snowflake'],
  ['Redshift',/redshift/i,'Snowflake and SQL'],['Databricks',/databricks/i,'Python and Snowflake'],['Docker / Kubernetes / Terraform',/docker|kubernetes|terraform/i,'CI/CD and AWS'],
  ['Java / Spring',/\bjava\b|spring boot/i,'JavaScript and Python'],['C# / .NET',/c#|\.net\b|asp\.net/i,'JavaScript and Python'],['Go / Rust / PHP / Ruby',/\bgolang\b|\brust\b|\bphp\b|\bruby\b/i,'Python and JavaScript'],
  ['Angular / Vue',/angular|\bvue(?:\.?js)?\b/i,'React'],['Django / Flask / FastAPI',/django|flask|fastapi/i,'Python and Node.js'],['Android / iOS / Flutter',/\bandroid\b|\bios\b|\bflutter\b|\bkotlin\b|\bswift\b/i,'React and JavaScript'],
  ['Scala',/\bscala\b/i,'Python'],['SAS / SPSS / Stata',/\bsas\b|spss|stata/i,'Python and R'],['MATLAB',/matlab/i,'Python and R'],
  ['Alteryx / Informatica / Talend',/alteryx|informatica|talend/i,'Python and SQL'],['SSIS / SSRS',/\bssis\b|\bssrs\b/i,'SQL'],['Oracle / SAP / Salesforce',/oracle|\bsap\b|salesforce/i,'SQL and MySQL'],
  ['Elasticsearch / Splunk',/elasticsearch|splunk/i,'SQL and MongoDB'],
  ['Requirements gathering / BRD / user stories',/requirements? (?:gathering|analysis|elicitation)|elicit|\bbrds?\b|\bfrd\b|functional specifications?|user stories|requirement documents?|gather(?:ing)?[^.\n]{0,25}requirements/i,'Excel and Power BI reporting (no formal business analyst role listed)'],
  ['Business process analysis / modelling',/process (?:analysis|mapping|flows?|modell?ing|improvement)|business process|\bbpmn\b|\buml\b|use cases?/i,'data analysis and EDA'],
  ['UAT / verification and validation',/\buat\b|user acceptance|traceability/i,''],
  ['Agile / Scrum / Jira',/\bagile\b|\bscrum\b|\bjira\b|\bconfluence\b/i,''],
  ['ERP systems',/\berp\b/i,'SQL and Snowflake'],
  ['Planning and forecasting software',/planning software|demand forecasting|inventory optimi[sz]ation|\bs&op\b|kinaxis|anaplan/i,'Excel and Python analysis'],
  ['Online research / fact-checking',/online research|fact[- ]?check|validate claims|verify (?:the )?(?:claims|accuracy)|research skills|conduct(?:ing)? research|market research|literature review/i,'a co-authored published research paper'],
  ['AI model fine-tuning and annotation',/fine-?tun|\brlhf\b|model training|train(?:ing)? (?:large language |ai |ml )?models?|annotation|data labell?ing|labeling/i,'GenAI, LLM, PyTorch and TensorFlow'],
  ['Customer / technical support',/customer (?:service|support|success)|front-?line|technical support|help ?desk|service desk|\btickets?\b|incident (?:management|resolution)|\bl[12] support/i,''],
  ['Master data / bulk data operations',/master data|bulk uploads?|data entry|manual(?:ly)? updating data|data migration|data governance/i,'data cleaning in Excel, Power BI and Pandas'],
  ['Data structures and algorithms',/data structures|\balgorithms?\b|leetcode/i,'C++ and Python programming'],
  ['TypeScript / Next.js / Redux',/typescript|next\.?js|redux/i,'JavaScript and React'],
  ['Testing / QA tools',/selenium|junit|pytest|unit tests?|test automation|\bqa\b|postman|cypress/i,''],
  ['Microservices / system design',/microservices?|system design|distributed systems/i,'REST APIs and Node.js'],
  ['Linux / shell scripting',/linux|\bbash\b|shell scripting/i,''],
  ['GraphQL',/graphql/i,'REST APIs'],
  ['MLOps / model deployment',/mlops|ml ops|model deployment|kubeflow|mlflow/i,'PyTorch and TensorFlow'],
  ['LangChain / vector databases',/langchain|llamaindex|vector (?:database|db|store)s?|pinecone|chroma|faiss|hugging ?face/i,'GenAI, LLM and RAG'],
  ['Agentic AI frameworks',/agentic|\bmcp\b|autogen|crewai|langgraph|ai agents?/i,'GenAI and LLM coursework'],
  ['ETL / data warehousing',/\betl\b|\belt\b|data warehous|data pipelines?/i,'SQL and Snowflake'],
  ['Excel VBA / Power Automate',/\bvba\b|\bmacros?\b|power apps|power automate/i,'Excel and Power BI']];
 var DOM=[
  ['BIM / Revit / CAD',[/revit/i,/\bbim\b/i,/dynamo/i,/autocad/i,/autodesk/i,/point clouds?/i]],
  ['manufacturing and supply chain operations',[/supply chain/i,/demand forecasting/i,/inventory/i,/procurement/i,/logistics/i,/planning software/i,/manufacturing/i,/plant operations?/i,/warehouse/i,/shop ?floor/i]],
  ['accounting and finance operations',[/\btally\b/i,/\bgst\b/i,/accounts payable|accounts receivable/i,/general ledger/i,/bookkeeping/i]],
  ['embedded and mechanical engineering',[/embedded/i,/firmware/i,/\bplc\b/i,/scada/i,/solidworks/i,/\bcnc\b/i]],
  ['sales and marketing',[/lead generation/i,/telecalling|cold calling/i,/\bseo\b/i,/social media/i,/sales targets?/i]],
  ['healthcare and clinical work',[/clinical/i,/patient/i,/pharma/i,/hospital/i]],
  ['product lifecycle management (PLM) support',[/product life ?cycle|\bplm\b/i,/bill of materials|\bboms?\b/i,/master data/i,/cosmetics|skin ?care/i,/regulatory/i]]];
 SKILLDATA={SK:SK,GAP:GAP};
 var NUM={one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10};
 var PREF=/nice to have|preferred|good to have|bonus|desirable|an advantage|a plus\b|plus point|optional/i,HEAD=/^(required|requirements?|qualifications?|must have|responsibilit|what you|key |about you|skills|candidate profile|job description|duties)/i;
 var SAMPLE="Data Analyst\nWe are looking for a Data Analyst with 1+ years of experience. You will build dashboards in Power BI or Tableau, write SQL queries to answer business questions, clean data using Python (Pandas) and Excel, and present insights to stakeholders. Nice to have: Azure, Airflow.";


 var NOW=function(){return new Date()},MON=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
 function li(n,t){return'<li><b>'+n+'</b><span>'+t+'</span></li>'}
 function show(h){out.innerHTML=h;out.hidden=false;var b=$('#fit-ai');if(b)b.onclick=function(){openAI(true)};out.scrollIntoView({behavior:calm?'auto':'smooth',block:'nearest'})}
 function pracHtml(pr){return'<div class="fit-prac"><h4>Practical fit</h4><ul>'+pr.map(function(p){return'<li class="'+p[0]+'"><i>'+({ok:'\u2713',warn:'!',info:'i'}[p[0]])+'</i><span>'+p[1]+'</span></li>'}).join('')+'</ul></div>'}
 function ctaHtml(){return'<div class="fit-cta"><a class="pillbtn" href="'+resume+'"'+(resume[0]==='#'?'':' target="_blank" rel="noopener"')+'>Download resume</a><a class="pillbtn ghost" href="#contact">Contact Sahil</a><button type="button" class="pillbtn ghost" id="fit-ai">Ask the AI more</button></div>'}
 function note(m){return'<p class="fit-note">'+m+'</p>'}
 function fmt(n){return(Math.round(n*10)/10).toString()}
 var INT='His portfolio lists three internships, and his data analyst experience is the KultureHire internship (Sep \u2013 Oct 2024).',
  INTG='His portfolio lists three internships: Full Stack Developer at Tenet (Dec 2024 \u2013 Jun 2025), Data Analyst at KultureHire (Sep \u2013 Oct 2024) and Python Programming at CodeSoft (Aug \u2013 Sep 2023).';
 var SOFT=[['communication',/communicat/i],['stakeholder management',/stakeholder/i],['documentation',/documentation/i],['business acumen',/business acumen|business understanding/i],['attention to detail',/attention to detail/i],['teamwork',/team ?work|collaborat/i],['ownership',/\bownership\b/i],['leadership',/leadership|lead a team|mentor/i],['time management',/time management/i],['working across time zones',/time ?zones?|global teams|us and china|offshore/i],['working with senior management',/senior management|leadership team|c-level|senior stakeholders/i],['multitasking',/multi-?task|simultaneously manage|manage (?:a large and diverse number of )?tasks|prioriti[sz]/i],['relationship building',/build relationships|relationship[- ]building|people skills/i]];
 function clean(t){return t.replace(/\[([^\]]*)\]\([^)]*\)/g,'$1').replace(/https?:\/\/\S+/g,' ').replace(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g,' ').replace(/(?:\+\d{1,4}\s+){4,}\+?\d*/g,' ').replace(/(?:\+91[\s-]?)?[6-9]\d{9}\b/g,' ').replace(/\b(?:experiance|expreience|exprience|expirience)\b/gi,'experience').replace(/^\s*(?:name|phone|email|resume|upload file|cover letter|submit|apply now|apply|log in|sign up)\s*\*?\s*:?\s*$/gim,' ').replace(/^\s*data science,? analytics (?:&|and) machine learning\s*$/gim,' ')}
 function exp(t){var best=0,typo=0,pref=0,mo=null,mtxt='',m,re=/(\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten)\s*\+?\s*(?:-|\u2013|to)?\s*(?:\d{1,2}|one|two|three|four|five|six|seven|eight|nine|ten)?\s*\+?\s*(?:years?|yrs?)\b/gi;
  while((m=re.exec(t))){var a=m[1].toLowerCase(),n=NUM[a]||parseInt(a,10);if(!n)continue;
   if(/(?:up to|upto|max(?:imum)?|less than|below|under|within|at most)\s*$/i.test(t.slice(Math.max(0,m.index-22),m.index)))continue;
   var ctx=t.slice(Math.max(0,m.index-70),m.index+m[0].length+70);
   if(/experience|\bexp\b|background|track record|working as|worked/i.test(ctx)&&!/\bago\b|founded|established|in business/i.test(ctx)){if(n>15)typo=Math.max(typo,n);else if(/preferred|desirable|a plus|nice to have|an advantage|not (?:a )?(?:requirement|mandatory)/i.test(t.slice(m.index+m[0].length,m.index+m[0].length+45)))pref=Math.max(pref,n);else best=Math.max(best,n)}}
  var hd=/^\s*(\d{1,2})\s*(?:-|\u2013|to)\s*(\d{1,2})\s*(?:years?|yrs?)\s*$/gim;
  while((m=hd.exec(t))){var l1=parseInt(m[1],10),h1=parseInt(m[2],10);if(l1>0&&h1<=15&&h1>=l1)best=Math.max(best,l1)}
  var rm=/(\d{1,2})\s*(?:-|\u2013|to)?\s*(\d{1,2})?\s*\+?\s*months?\b/gi;
  while((m=rm.exec(t))){var c2=t.slice(Math.max(0,m.index-60),m.index+m[0].length+40);
   if(/experience|\bexp\b/i.test(c2)&&!/notice|probation|stipend|contract|\bago\b/i.test(c2)){var lo=parseInt(m[1],10),hi=m[2]?parseInt(m[2],10):lo;mo=Math.max(mo||0,hi);mtxt=m[2]?lo+'\u2013'+hi:String(lo)}}
  return{yrs:best,typo:typo,pref:pref,months:mo,mtxt:mtxt}}
 function pay(t){if(/[$\u20ac\u00a3]|\busd\b|\beur\b|\bgbp\b|\baed\b/i.test(t))return null;
  var m=t.match(/(\d+(?:\.\d+)?)\s*(?:lpa|lakhs?|lacs?)?\s*(?:-|\u2013|to)\s*(\d+(?:\.\d+)?)\s*(?:lpa|lakhs?|lacs?)/i);
  if(m)return{lo:parseFloat(m[1]),hi:parseFloat(m[2]),txt:m[1]+' to '+m[2]+' LPA'};
  m=t.match(/(?:up to|upto|max(?:imum)?)\s*(?:rs\.?|inr|\u20b9)?\s*(\d+(?:\.\d+)?)\s*(?:lpa|lakhs?|lacs?)/i);
  if(m)return{lo:0,hi:parseFloat(m[1]),txt:'up to '+m[1]+' LPA'};
  var re=/(?:\u20b9|rs\.?|inr)\s*([\d,]+(?:\.\d+)?)(?:\s*(?:-|\u2013|to)\s*(?:\u20b9|rs\.?|inr)?\s*([\d,]+(?:\.\d+)?))?/gi,x;
  while((x=re.exec(t))){var tail=t.slice(x.index+x[0].length,x.index+x[0].length+30),mo=/month|monthly|\/\s*mo|\bpm\b/i.test(tail),yr=/year|annum|annual|p\.a|\bctc\b|\/\s*yr/i.test(tail)||/annual|ctc|per annum/i.test(t.slice(Math.max(0,x.index-25),x.index));
   if(!mo&&!yr)continue;var a=parseFloat(x[1].replace(/,/g,'')),b=x[2]?parseFloat(x[2].replace(/,/g,'')):a,k=mo?12/100000:1/100000,lo=a*k,hi=b*k;if(hi<.3||hi>150)continue;
   return{lo:lo,hi:hi,txt:'\u20b9'+x[1].replace(/\.00$/,'')+(x[2]?'\u2013\u20b9'+x[2].replace(/\.00$/,''):'')+(mo?' per month':' per year')+' (about '+(x[2]?fmt(lo)+' to '+fmt(hi):fmt(hi))+' LPA)'}}
  return null}
 function dates(t){var r=[],m,re1=/\b(\d{1,2})(?:st|nd|rd|th)?\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?,?\s+(20\d\d)\b/gi,re2=/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(20\d\d)\b/gi;
  function add(d,mo,y,i,x){r.push({dt:new Date(+y,MON.indexOf(mo.toLowerCase().slice(0,3)),+d),ctx:t.slice(Math.max(0,i-70),i),txt:x})}
  while((m=re1.exec(t)))add(m[1],m[2],m[3],m.index,m[0]);while((m=re2.exec(t)))add(m[2],m[1],m[3],m.index,m[0]);return r}
 function domains(t){var head=t.slice(0,250),res='';DOM.forEach(function(d){if(res)return;var n=0,inHead=false;d[1].forEach(function(x){if(x.test(t))n++;if(x.test(head))inHead=true});if(n>=2||inHead)res=d[0]});return res}
 function prac(t){var r=[];function add(s,x){r.push([s,x])}
  var india=/\b(india|nagpur|mumbai|navi mumbai|thane|pune|nashik|bengaluru|bangalore|hyderabad|delhi|noida|gurgaon|gurugram|chennai|kolkata|ahmedabad|jaipur|indore|kochi|chandigarh|coimbatore)\b/i,
   mh=/\b(maharashtra|mumbai|navi mumbai|thane|pune|nashik|nagpur|aurangabad)\b/i,
   abroad=/\b(usa|united states|uk|united kingdom|germany|berlin|munich|dubai|uae|singapore|canada|australia|netherlands|europe|london|ireland|sweden|switzerland|france|paris|japan|qatar|saudi)\b/i,hasIn=india.test(t),hasAb=abroad.test(t);
  var fm=t.match(/(?:bachelor'?s?|master'?s?|b\.?tech|degree|graduates?|students?)\s*(?:degree\s*)?in\s+([^.\n]{3,160})/i);
  if(fm){var fl=fm[1].replace(/\s+/g,' ').trim();if(fl.length>110)fl=fl.slice(0,107)+'...';
   if(/computer|information technology|\bit\b|artificial intelligence|\bai\b|data|statistic|any (?:stream|discipline|branch|field)|engineering|related field|equivalent/i.test(fm[1]))add('ok','Education: the description lists '+fl+'. Sahil holds a B.Tech in Artificial Intelligence, which is closest to Computer Science and IT.');
   else add('warn','Education: the description asks for a degree in '+fl+'. Sahil holds a B.Tech in Artificial Intelligence, so please check whether that field is accepted.')}
  else if(/\bdegree\b(?!\s+of\b)|bachelor|graduat|b\.?tech/i.test(t))add('ok','Education: Sahil holds a B.Tech in Artificial Intelligence from G H Raisoni College of Engineering and Management (2021 \u2013 2025).');
  var bt=null,rb=/(20\d\d)\s*(?:-|\u2013|to|and|\/)\s*(20\d\d)/g,mm;
  while((mm=rb.exec(t))){var c=t.slice(Math.max(0,mm.index-80),mm.index+mm[0].length+80);if(/batch|passing year|pass(?:ed)? out|graduation year|graduat|passout/i.test(c)){bt=[Math.min(+mm[1],+mm[2]),Math.max(+mm[1],+mm[2])];break}}
  if(bt)add(bt[0]<=2025&&2025<=bt[1]?'ok':'warn','Graduation year: the role asks for the '+bt[0]+'\u2013'+bt[1]+' batches. Sahil graduated in 2025'+(bt[0]<=2025&&2025<=bt[1]?'.':', which is outside that range.'));
  else{var sy=t.match(/(20\d\d)\s*(?:graduates?|batch|pass-?outs?)/i);if(sy)add(+sy[1]===2025?'ok':'warn','Graduation year: the role mentions the '+sy[1]+' batch. Sahil graduated in 2025'+(+sy[1]===2025?'.':', which does not match.'))}
  var cg=t.match(/(\d(?:\.\d+)?)\s*(?:\/\s*10\s*)?\s*cgpa|cgpa\s*(?:of|:|-|\u2013)?\s*(\d(?:\.\d+)?)/i);
  if(cg){var raw=cg[1]||cg[2],need=parseFloat(raw);if(need>0&&need<=10)add(6.96>=need?'ok':'warn','CGPA: the role asks for '+raw+' CGPA. Sahil\'s CGPA is 6.96 / 10.0'+(6.96>=need?', which meets it.':', which is below it.'))}
  var pc=t.match(/(?:minimum|min\.?|at least|aggregate|marks|percentage)[^.\n]{0,40}?(\d{2}(?:\.\d+)?)\s*%/i);
  if(pc)add('info','Marks: the role mentions at least '+pc[1]+'%. Sahil\'s portfolio shows a CGPA of 6.96 / 10.0, and the percentage depends on his university\'s conversion, so please ask him for the exact figure.');
  if(/\bnagpur\b/i.test(t))add('ok','Location: the role is in Nagpur, where Sahil is based.');
  else if(hasIn&&(!hasAb||/(?:based|located|location:?|work(?:ing)? from)[^.\n]{0,25}india/i.test(t))){var cy=(t.match(/\b(navi mumbai|mumbai|thane|pune|nashik|bengaluru|bangalore|hyderabad|delhi|noida|gurgaon|gurugram|chennai|kolkata|ahmedabad|jaipur|indore|kochi|chandigarh|coimbatore)\b/i)||[])[1];add('ok','Location: '+(cy?cy.replace(/\b\w/g,function(c){return c.toUpperCase()})+', India':'India')+'. Sahil is open to relocating to any city'+(mh.test(t)?', and he can join immediately for roles within Maharashtra':'')+'. He needs no visa for roles in India.')}
  else if(hasAb&&!hasIn)add('warn','Location: this role appears to be outside India. Sahil would need visa sponsorship for it.');
  else if(hasAb&&hasIn)add('info','Location: the description mentions both India and another country. Please check where the role is based.');
  var wm=[];if(/work from office|\bwfo\b|on-?site|in-?office|in[- ]person/i.test(t))wm.push('on-site');if(/hybrid/i.test(t))wm.push('hybrid');if(/remote|work from home|\bwfh\b/i.test(t))wm.push('remote');
  if(wm.length)add('ok','Work mode: '+wm.join(' / ')+'. Sahil is fine with remote, hybrid or on-site work.');
  var jn=t.match(/immediate(?:ly)?\s*(?:to|-|\u2013)\s*(\d{1,3})\s*days/i),up=t.match(/(?:notice period|joining|join)[^.\n]{0,40}?(?:up to|upto|max(?:imum)?|within|not more than)\s*(\d{1,3})\s*days/i);
  if(jn)add(parseInt(jn[1],10)>=15?'ok':'warn','Joining: the role allows immediate to '+jn[1]+' days. Sahil\'s notice period is 15 days, and he can join immediately within Maharashtra.');
  else if(up)add(parseInt(up[1],10)>=15?'ok':'warn','Joining: the role allows up to '+up[1]+' days. Sahil\'s notice period is 15 days, and he can join immediately within Maharashtra.');
  else if(/immediate joiners?|immediate joining|urgent(?:ly)? (?:required|hiring|need)|urgent requirement/i.test(t))add('info','Joining: the role is hiring urgently. Sahil\'s notice period is 15 days, and he can join immediately for roles within Maharashtra.');
  var p=pay(t);
  if(p){var s4=4.5;add(s4>p.hi?'warn':'ok','Pay: '+p.txt+' is stated. Sahil\'s expectation is around 4.5 LPA, which is '+(s4>p.hi?((p.lo&&p.lo!==p.hi)?'above the top of that range':'above that amount'):(p.lo&&s4<p.lo?'below that range':'within it'))+', and he is open to discussion based on the role and growth.')}
  var lg=t.match(/\b(german|french|spanish|japanese|mandarin|arabic|dutch)\b/i);
  if(lg&&/fluen|proficien|required|mandatory|must|native/i.test(t))add('warn','Language: the role mentions '+lg[1]+'. Sahil speaks English, Hindi and Marathi, with basic German only.');
  var ce=t.match(/pl-?300|az-?900|dp-?900|dp-?203|aws certified[^.\n]{0,25}|tableau (?:desktop )?(?:specialist|certified|certification)|google data analytics|\bpmp\b|\bcfa\b|six sigma|scrum master|cissp|\bccna\b/i);
  if(ce)add('warn','Certification: the description mentions '+ce[0].trim()+', which is not on his list (Accenture, IBM, NVIDIA and Indian Blockchain Institute).');
  if(/github|coding project|portfolio projects?/i.test(t)&&/apply|share|submit|send|strengthen/i.test(t))add('ok','Application: the description asks for or welcomes a GitHub link or project work. Sahil has public projects on GitHub (github.com/Chauhansahiil).');
  var un=[];if(/\bshifts?\b/i.test(t))un.push('shift timings');if(/service bond|bond period|\bbond\b/i.test(t))un.push('a service bond');if(/\btravel/i.test(t))un.push('travel');if(/case study|assignment|coding test|take-?home/i.test(t))un.push('a test or assignment');if(/time ?zones?|flexible working hours|flexible hours/i.test(t))un.push('working hours across time zones');
  if(un.length)add('info','The description mentions '+un.join(', ')+'. His portfolio does not cover this, so please ask him directly.');
  var now=NOW(),today=new Date(now.getFullYear(),now.getMonth(),now.getDate()),shown=false;
  dates(t).forEach(function(d){if(/clos|deadline|last date|apply by|valid (?:till|until)|expires?/i.test(d.ctx)){if(d.dt<today)add('warn','Closing date: the posting says applications close on '+d.txt+', which has passed.')}else if(!shown&&d.dt.getFullYear()<=now.getFullYear()-1){add('info','Posting date: this description is dated '+d.txt+', so the role may no longer be open.');shown=true}});
  var pr=/posted:?\s*(?:over\s*)?(\d+)\s*(day|week|month|year)s?\s*ago/gi,px,mx=0,pt='';
  while((px=pr.exec(t))){var dd=parseInt(px[1],10)*({day:1,week:7,month:30,year:365}[px[2].toLowerCase()]);if(dd>mx){mx=dd;pt=px[1]+' '+px[2].toLowerCase()+(px[1]==='1'?'':'s')+' ago'}}
  if(mx>=30&&!shown)add('info','Posting age: it says posted '+pt+', so the role may no longer be open. Please confirm on the employer\'s page.');
  return r}
 function run(){var raw=inp.value,t=clean(raw).trim();
  if((raw.match(/full job description/gi)||[]).length>=2)return show(note('It looks like more than one job description was pasted together. Please paste one description at a time so the comparison stays accurate.'));
  if(t.split(/\s+/).length<8)return show(note('That is too short to be a job description. Please paste the full text, including the requirements.'));
  var letters=t.replace(/[^\p{L}]/gu,''),latin=t.replace(/[^A-Za-z]/g,'');
  if(letters.length&&latin.length/letters.length<.6)return show(note('I can only compare English job descriptions. Please paste the text in English.'));
  var cls={},lines=t.split(/\n+|[.!?;]\s+/),mode='req';
  lines.forEach(function(L){var s=L.trim();if(!s)return;var head=s.length<60&&(/:\s*$/.test(s)||((PREF.test(s)||HEAD.test(s))&&s.split(/\s+/).length<=3));
   if(head&&PREF.test(s))mode='pref';else if(head&&HEAD.test(s))mode='req';
   if(/to apply|how to apply|share your (?:cv|resume)|send your (?:cv|resume)|submit your (?:cv|resume)|apply now|apply by/i.test(s))return;
   var m=(!head&&PREF.test(s))?'pref':mode,sh=SK.filter(function(k){return k[1].test(s)}),sg=GAP.filter(function(k){return k[1].test(s)});
   if(sh.length&&sg.length&&/\bor\b|\//i.test(s))sg=[];
   sh.concat(sg).forEach(function(k){if(m==='req')cls[k[0]]='req';else if(!cls[k[0]])cls[k[0]]='pref'})});
  var hit=SK.filter(function(s){return cls[s[0]]}),miss=GAP.filter(function(s){return cls[s[0]]}),dom=domains(t);
  if(hit.some(function(s){return s[0]==='Power BI / DAX'||s[0]==='Tableau'}))hit=hit.filter(function(s){return s[0]!=='Data visualization'});
  if(!hit.length&&!miss.length){var nt=/nurse|doctor|physician|driver|mechanic|electrician|plumber|chef|waiter|teacher|accountant|cashier|warehouse|civil engineer|mechanical engineer|security guard|sales executive|retail/i.test(t);
   var p0=prac(t);return show(note(dom?'This role is centred on '+dom+', which is outside Sahil\'s listed experience, and I could not match any tools or skills here against his profile.':(nt?'This looks like a role outside data, AI and software, so Sahil\'s profile is not a match for it.':'This description does not name tools or skills that I can compare with Sahil\'s profile, so I cannot give a skills verdict. Please read it yourself or ask Sahil directly.'))+(p0.length?pracHtml(p0):'')+ctaHtml())}
  var x0=exp(t),yrs=x0.yrs,senior=/\bsenior\b|\bprincipal\b|\bstaff\b|\bhead of\b|\bdirector\b|\bmanager\b|\blead\b|\barchitect\b/i.test(t.slice(0,160)),
   fresher=/fresher|entry[- ]level|trainee|junior|campus hire|recent graduate|fresh graduate|new graduate|0\s*(?:-|\u2013|to)\s*[12]\s*years?|(?:prior |previous )?(?:professional )?experience (?:is )?not (?:required|needed)|no (?:prior )?experience (?:required|needed)|up to \d+ years? of/i.test(t)||(x0.months!==null&&x0.months<=12),
   masters=/(?:master'?s|\bm\.?sc\b|\bm\.?tech\b|post[- ]?graduate|\bph\.?d\b|doctorate)[^.\n]{0,40}(?:required|mandatory|preferred|degree)|(?:required|mandatory|preferred)[^.\n]{0,40}(?:master'?s|\bm\.?sc\b|\bm\.?tech\b|post[- ]?graduate|\bph\.?d\b|doctorate)/i.test(t);
  var rh=hit.filter(function(s){return cls[s[0]]==='req'}),rm=miss.filter(function(s){return cls[s[0]]==='req'}),rt=rh.length+rm.length;
  var bt=hit.length+miss.length,W=function(l){return l.reduce(function(a,s){return a+(s[3]||1)},0)},ratio=rt?W(rh)/(W(rh)+rm.length):W(hit)/(W(hit)+miss.length),sk=ratio>=.7?'ok':(ratio>=.4?'warn':'bad');
  var ex=(yrs>=4||(senior&&yrs>=3))?'bad':((yrs>=2||senior)?'warn':'ok'),edge=(yrs===1&&!fresher&&ex==='ok');
  var lv=(sk==='bad'||ex==='bad')?'bad':((sk==='warn'||ex==='warn'||edge)?'warn':'ok');
  var title={ok:'Good match',warn:'Partial match',bad:'Not a match yet'}[lv];
  if(ex==='bad'&&sk!=='bad')title='Too senior for now';else if(ex==='warn'&&sk==='ok')title='A stretch on experience';else if(edge&&sk==='ok')title='Good skills match, experience at the edge';
  if(dom&&ex!=='bad'){if(sk==='ok'){lv='warn';title='Skills overlap, different domain'}else if(sk==='warn'){lv='warn';title='Partial match: domain knowledge needed'}}
  var pr=prac(t),parts=[],ana=hit.some(function(s){return /^(SQL|Power BI|Tableau|Excel|Data analysis|Reporting|Statistics|Data visualization|Data cleaning)/.test(s[0])}),INTX=ana?INT:INTG;
  parts.push(rt?('Required skills: '+rh.length+' of '+rt+' are on Sahil\'s list.'):('Skills mentioned: '+hit.length+' of '+bt+' are on Sahil\'s list.'));
  if(yrs>=1)parts.push('The description asks for '+yrs+'+ years of experience. Sahil graduated in 2025. '+INTX+(ana?' His portfolio does not show a full year in an analyst role.':' None of his internships runs for a full year.'));
  else if(x0.months!==null)parts.push('The description asks for '+x0.mtxt+' months of experience, so it suits freshers. Sahil graduated in 2025. '+INTX);
  else if(fresher)parts.push('The description looks suitable for freshers and juniors. Sahil graduated in 2025. '+INTX);
  else if(x0.pref)parts.push('The description prefers about '+x0.pref+' year'+(x0.pref>1?'s':'')+' of experience but does not require it. Sahil graduated in 2025. '+INTX);
  else parts.push('No minimum experience is stated. Sahil graduated in 2025. '+INTX);
  if(dom)parts.push('The role is centred on '+dom+', which is outside Sahil\'s listed experience.');
  if(fresher&&sk!=='ok')parts.push('The role is open to freshers, but its main requirements listed here are not yet shown on his portfolio.');
  if(lv==='ok')parts.push('This reads as a reasonable fit for his current level.');
  if(ex==='bad')parts.push('Applying could still be worth a try if you are flexible on experience, but this is a stretch.');
  if(pr.some(function(p){return p[0]==='warn'}))parts.push('Some practical points below need a check.');
  var h='<div class="fit-verdict '+lv+'"><b>'+title+'</b><span>'+parts.join(' ')+'</span></div><div class="fit-cols">'+
   '<div class="fit-col ok"><h4>Where he fits</h4><ul>'+(hit.length?hit.map(function(s){return li(s[0]+(cls[s[0]]==='pref'?' (nice to have)':''),s[2])}).join(''):'<li><span>No direct matches found.</span></li>')+'</ul></div>'+
   '<div class="fit-col no"><h4>Not on his list yet</h4><ul>'+(miss.length?miss.map(function(s){return li(s[0]+(cls[s[0]]==='pref'?' (nice to have)':''),s[2]?'Not listed. Closest he works with: '+s[2]+'.':'Not listed on his portfolio.')}).join(''):'<li><span>None of the tools I check for.</span></li>')+'</ul></div></div>';
  if(pr.length)h+=pracHtml(pr);
  var ns=[],sf=SOFT.filter(function(s){return s[1].test(t)}).map(function(s){return s[0]});
  if(/advanced excel/i.test(t))ns.push('It asks for Advanced Excel. He lists pivot tables and VLOOKUP, and whether that counts as advanced is something he can show in an interview.');
  if(x0.typo)ns.push('The description mentions '+x0.typo+' years of experience, which looks like a typo (for example 2\u20135). Please check the original posting.');
  if(sf.length)ns.push('Soft skills mentioned ('+sf.join(', ')+') are not scored, because a portfolio cannot prove them.');
  if(senior)ns.push('The title sounds senior, which may involve ownership or leading others.');if(masters)ns.push('It mentions a master\'s degree or PhD as required or preferred. Sahil holds a B.Tech.');
  ns.push('This is a keyword comparison against his portfolio, not a hiring decision, so please read the full description too.');
  h+='<ul class="fit-notes">'+ns.map(function(x){return'<li>'+x+'</li>'}).join('')+'</ul>';
  h+=ctaHtml();
  show(h);var b=$('#fit-ai');if(b)b.onclick=function(){openAI(true)}}
 out.addEventListener('pointermove',function(ev){var el=ev.target.closest?ev.target.closest('.fit-col,.fit-prac'):null;if(!el)return;var q=el.getBoundingClientRect();el.style.setProperty('--mx',(ev.clientX-q.left)+'px');el.style.setProperty('--my',(ev.clientY-q.top)+'px')});
 var runB=$('#fit-run'),clrB=$('#fit-clear'),smpB=$('#fit-sample'),used=false;
 function setOn(b,on){if(b)b.hidden=!on}
 function sync(){var has=inp.value.trim().length>0;setOn(runB,has);setOn(clrB,has);setOn(smpB,!has&&!used)}
 function cnt(){$('#fit-count').textContent=inp.value.length+' / 6000';sync()}
 clrB.onclick=function(){inp.value='';cnt();out.hidden=true;out.innerHTML='';inp.focus()};
 runB.onclick=run;
 smpB.onclick=function(){used=true;inp.value=SAMPLE;cnt();run()};
 inp.addEventListener('input',cnt);sync()})();

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
 {k:'customer trends analysis retail dashboard',a:"Customer Trends Analysis is based on an open-source project by Amlan Mohanty, which Sahil worked through end to end: cleaning retail data with Python (Pandas), answering business questions in SQL, and building an interactive Power BI dashboard, with his own notebook, queries and report. "+A(REPO,'See the repo')+"."},
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
var GAPANS="Sahil has not listed big-data and cloud tools such as Spark, Kafka, Airflow, Azure or Google Cloud, and he is still building experience with very large real-world datasets.";
function gapsQ(q){var s=q.toLowerCase();return/(\bnot|n't|\bdoesnt|\bdont|\bnever)\s+(know|use|familiar|skilled)|skill gaps?|tool gaps?|knowledge gaps?|missing skills?|what.{0,20}\blacks?\b/.test(s)}
var box=$('#ai'),msgs=$('#msgs'),inp=$('#ai-in');
function add(h,me){var d=document.createElement('div');d.className='m '+(me?'me':'bot');if(me)d.textContent=h;else d.innerHTML=h;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d}
var matchScore=0;
function match(q){var w=q.toLowerCase().replace(/[^a-z0-9. ]/g,' ').split(/\s+/).filter(Boolean),best=null,top=0;
  KB.forEach(function(e){var s=0,ks=e.k.split(' ');w.forEach(function(t){if(t.length>1&&ks.some(function(k){return k===t||(t.length>3&&k.length>5&&(k.indexOf(t)===0||t.indexOf(k)===0))}))s++});if(s>top){top=s;best=e}});matchScore=top;return best}
var hist=[],AI=C.AI_ENDPOINT||(C.WORKER_URL?C.WORKER_URL+'/chat':'');
function fmt(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/(https?:\/\/[^\s)]+[^\s).,;:])/g,'<a href="$1" target="_blank" rel="noopener">$1</a>').replace(/\n/g,'<br>')}
var SUG=['What are his projects?','What are his skills?','Is he available?','Get his resume','How can I contact him?'];
function fallback(){return"I couldn't find that on Sahil's portfolio. Here is what I can help with: "+SUG.map(function(s){return'<button type="button" class="rolebtn" data-q="'+s+'">'+s.replace(/\?$/,'')+'</button>'}).join(' ')+" Or "+A('#contact','message Sahil directly')+"."}
var TALK=[
 [/^\s*(?:hi+|hello+|hey+|hlo|helo|yo|namaste|good (?:morning|afternoon|evening)|hello there|hi there)\s*[!.?]*\s*$/i,"Hi! Ask me about Sahil's projects, skills, experience, education, or ask for his resume."],
 [/\b(?:thanks|thank you|thankyou|thx|tysm|appreciate it)\b/i,"You're welcome! Let me know if there is anything else you would like to know about Sahil."],
 [/^\s*(?:ok(?:ay)? )?(?:bye|goodbye|see you|see ya|take care)\b/i,"Thanks for stopping by! You can reach Sahil anytime through the "+A('#contact','contact section')+"."]];
var INTENTS=[
 [/who (?:are|r) (?:you|u)\b|what (?:are|r) (?:you|u)\b|are you (?:an? )?(?:ai|bot|human|real|robot|chatgpt|gpt|claude)|your name/i,"I'm the AI assistant on Sahil's portfolio. I answer questions about his projects, skills, experience, education and availability using the information on this site, and I can share his resume."],
 [/(?:how|who|when|with what|using what|what).{0,30}(?:built|build|made|make|created|create|developed|develop|trained|train|coded|designed|work|works)\b.{0,25}\b(?:you|this (?:chat|bot|assistant|portfolio|website|site|page)|the (?:portfolio|website|site|assistant|bot))\b|what (?:tech|technology|stack|tools?|language)\b.{0,30}(?:portfolio|website|site|you)|(?:portfolio|website|site)\b.{0,15}(?:built|made) with/i,"This portfolio is a 2026 build made with HTML, CSS and JavaScript. I'm the assistant on it: I answer from the information on Sahil's portfolio, with a small Cloudflare Worker and an AI model behind me for open-ended questions. The exact date he started building the site isn't listed."],
 [/(?:when|what date|which month|how long|how many months|date|timeline|duration).{0,40}(?:project|app|system|dashboard|paper|research)|(?:project|app|system|dashboard|paper|research).{0,40}(?:when|date|timeline|duration|how long)|(?:start|started|began|begin|completed|finished).{0,40}(?:project|banking|blockchain|customer trends|dashboard)/i,"His portfolio doesn't give start or completion dates for the projects. The blockchain banking work was published as a research paper in IJIRT in December 2024 ("+A(PAPER,'read the paper')+"), and both projects are public on GitHub: "+A(GH,'github.com/Chauhansahiil')+"."],
 [/graduat|passed out|pass ?out|passout|(?:complete|completed|completing|finish|finished|finishing)\b.{0,25}(?:b\.?tech|btech|degree|engineering|college|studies)|(?:b\.?tech|btech|degree).{0,25}(?:complete|completed|finish|finished|year)|which year.{0,20}(?:b\.?tech|btech|degree|college)|year of (?:passing|graduation)|passing year|graduation year/i,"Sahil graduated in 2025. He completed his B.Tech in Artificial Intelligence at G H Raisoni College of Engineering and Management, Nagpur (2021 \u2013 2025) with a CGPA of 6.96 / 10, after scoring 77% in XII (HSC) at Sindhu College in 2021."],
 [/\bfresher\b|how many years|years of experience|how much experience|total experience|work(?:ing)? experience|full[- ]?time (?:job|experience|role)|currently (?:working|employed)|current (?:job|employer|company|status|position)|is he (?:working|employed|experienced)/i,"Sahil graduated in 2025 and is open to opportunities, mainly Data Analyst and related roles. His portfolio lists three internships (Data Analyst at KultureHire, Full Stack Developer at Tenet and Python Programming at CodeSoft) and no full-time roles. It doesn't state his current employment status, so please ask him directly if you need that."],
 [/e-?mail/i,"Email: chauhansahil03115@gmail.com. You can also use the "+A('#contact','contact form')+" or find him on "+A(LI,'LinkedIn')+"."],
 [/\b(?:phone|mobile|whatsapp|call)\b|contact number|home address|postal address|residential|hometown|home town/i,"His phone number isn't listed on the portfolio. You can reach him at chauhansahil03115@gmail.com, through the "+A('#contact','contact form')+", or on "+A(LI,'LinkedIn')+"."],
 [/\bage\b|how old|date of birth|\bdob\b|birthday|married|marital|\bwife\b|girlfriend|boyfriend|religion|\bcaste\b|politic|parents|\bfather\b|\bheight\b|\bweight\b/i,"Personal details like that aren't shared on Sahil's portfolio. I can help with his professional background, or you can "+A('#contact','contact him directly')+"."],
 [/linkedin|github|git hub|social media|profile link|portfolio link/i,"You can find Sahil on "+A(GH,'GitHub')+" and "+A(LI,'LinkedIn')+"."],
 [/night shift|rotational shift|\bshifts?\b|\btravel|service bond|\bbond\b|weekend/i,"His portfolio doesn't cover shift timings, travel or service-bond preferences, so please ask him directly through the "+A('#contact','contact form')+"."],
 [/freelanc|part[- ]?time|contract (?:work|role|basis)|consult/i,"His portfolio says he is open to Data Analyst and related roles, and it doesn't mention freelance, part-time or contract work, so please "+A('#contact','contact him directly')+" to discuss it."]];
function pick(list,q){for(var i=0;i<list.length;i++)if(list[i][0].test(q))return list[i][1];return''}
function skillQ(q){var D=SKILLDATA;if(!D)return'';
 if(!/know|\buse\b|\bused\b|experience|familiar|skill|good|strong|level|proficien|comfortable|worked|work with|can he|does he have|has he|expert|ability|handle|rate|how well/i.test(q))return'';
 function qre(k){return k[0]==='R'?/\bR(?:[\s?,.)\/]|$)|\bknow r\b|\buse r\b/:k[1]}
 var hit=D.SK.filter(function(k){return qre(k).test(q)}),miss=D.GAP.filter(function(k){return k[1].test(q)});
 if(hit.some(function(k){return k[0]==='Power BI / DAX'||k[0]==='Tableau'}))hit=hit.filter(function(k){return k[0]!=='Data visualization'});
 if(!hit.length&&!miss.length)return'';
 function rich(n){var key={SQL:'sql joins',Python:'python pandas'}[n];if(!key)return'';for(var i=0;i<KB.length;i++)if(KB[i].k.indexOf(key)===0)return KB[i].a;return''}
 if(hit.length===1&&!miss.length)return rich(hit[0][0])||('Yes. '+hit[0][2]);
 var p=[];hit.slice(0,4).forEach(function(h){p.push(h[0]+': '+h[2])});
 miss.slice(0,3).forEach(function(m){p.push(m[0]+' is not on his skills list'+(m[2]?'; the closest he works with is '+m[2]:'')+'.')});
 return(hit.length?'Yes. ':'')+p.join(' ')}
function route(q){var r=pick(TALK,q);if(r)return{a:r};
 if(gapsQ(q))return{a:GAPANS};
 r=skillQ(q);if(r)return{a:r};
 r=pick(INTENTS,q);if(r)return{a:r};
 r=future(q);if(r)return{a:r};
 var hit=match(q);
 if(hit&&(hit.det||matchScore>=2))return{a:hit.a,hit:hit};
 return{a:'',hit:hit}}
function ask(q){q=q.trim();if(!q)return;add(q,true);var t=add('<span class="dots"><i></i><i></i><i></i></span>');
  function say(h){setTimeout(function(){t.innerHTML=h;msgs.scrollTop=msgs.scrollHeight},calm?0:300)}
  var r=route(q);if(r.a)return say(r.a);
  var back=r.hit?r.hit.a:fallback();
  if(!AI)return say(back);
  var ctl=window.AbortController?new AbortController():null,tm=ctl?setTimeout(function(){ctl.abort()},12000):0;
  fetch(AI,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:q,history:hist.slice(-6)}),signal:ctl?ctl.signal:undefined})
   .then(function(x){clearTimeout(tm);if(!x.ok)throw new Error('HTTP '+x.status);return x.json()})
   .then(function(j){if(!j.answer)throw new Error('empty answer');hist.push({role:'user',content:q},{role:'assistant',content:j.answer});say(fmt(j.answer))})
   .catch(function(err){clearTimeout(tm);console.warn('[assistant] AI unavailable, using built-in answers:',err&&err.message);say(back)})}
function greet(){msgs.innerHTML='';hist=[];add('Hi, I\'m Sahil\'s AI assistant. Ask me anything about his projects, skills, experience or education, or ask for his resume.')}
function openAI(v){box.hidden=!v;document.body.classList.toggle('ai-open',v);$('#ai-fab').style.display=v?'none':'';if(v){inp.focus();if(!msgs.children.length)greet()}else $('#ai-fab').focus()}
(function(){msgs.setAttribute('aria-live','polite');
  CH.forEach(function(c){var b=document.createElement('button');b.type='button';b.textContent=c;b.onclick=function(){ask(c)};$('#chips').appendChild(b)});
  var n=document.createElement('p');n.className='ai-note';n.textContent='AI answers are based on Sahil\'s portfolio and may be imperfect.';box.insertBefore(n,$('#ai-form'));
  $('#ai-clear').onclick=greet;
  var fab=$('#ai-fab');if(fab&&!calm){fab.classList.add('intro');setTimeout(function(){fab.classList.remove('intro')},5000)}})();
$$('[data-open-ai]').forEach(function(b){b.addEventListener('click',function(ev){ev.preventDefault();openAI(true)})});
$('#ai-x').onclick=function(){openAI(false)};
$('#ai-form').addEventListener('submit',function(e){e.preventDefault();ask(inp.value);inp.value=''});
addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openAI(box.hidden)}if(e.key==='Escape'&&!box.hidden)openAI(false)});
msgs.addEventListener('click',function(e){if(e.target.className==='rolebtn'){ask(e.target.getAttribute('data-q'));return}if(e.target.tagName==='A'&&e.target.getAttribute('href')[0]==='#')openAI(false)});
})();