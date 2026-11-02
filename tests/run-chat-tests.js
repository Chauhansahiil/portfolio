// Regression tests for the chat assistant's built-in answers (the part that works without the AI model).
// Run from the site folder:  node tests/run-chat-tests.js
// Each line: a question a visitor might type, and text the answer must contain.
// "AI" means the built-in rules do not answer it, so it is passed to the AI model.
var fs=require('fs'),path=require('path');
var src=fs.readFileSync(path.join(__dirname,'..','enhance.js'),'utf8');
var code=src.slice(src.indexOf('/* ---------- job fit checker'),src.indexOf('function ask(q)'));
var els={};function mk(id){return els[id]||(els[id]={value:'',innerHTML:'',hidden:true,textContent:'',scrollIntoView:function(){},addEventListener:function(){},onclick:null})}
var $=function(s){return mk(s)},$$=function(){return[]},calm=true,resume='RESUME',openAI=function(){},C={},document={};
eval(code);
function plain(h){return h.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')}
var T=[
 ['Hello','Ask me about'],['hi','Ask me about'],['Thanks!',"You're welcome"],['ok bye','Thanks for stopping by'],
 ['When did he graduate','graduated in 2025'],['In which year he completed his B.Tech','graduated in 2025'],['what is his passing year','graduated in 2025'],
 ['When did he started his secure banking system using blockchain technology project',"doesn't give start or completion dates"],['when was the paper published','December 2024'],
 ['How he build you ???','2026 build'],['When he build this portfolio','2026 build'],['What tech is this portfolio built with','HTML, CSS and JavaScript'],['who are you','AI assistant on Sahil'],
 ['When he is available','notice period is 15 days'],['what is his notice period','15 days'],['Can he relocate?','relocating to any city'],
 ['Whats he dont know','has not listed big-data'],['What does he not know?','has not listed big-data'],['What are his skill gaps?','has not listed big-data'],
 ['Does he know Tableau?','Tableau'],['Does he know Java?','Java / Spring is not on his skills list'],['Does he know Spark and Tableau?','Spark / PySpark is not on his skills list'],
 ['How good is his SQL?','strong and practical'],['How much experience does he have in Python?','4 out of 5'],['Does he know R?','R is listed'],['Does he know machine learning?','ML coursework'],
 ['How much experience does he have?','three internships'],['Is he a fresher?','graduated in 2025'],['is he currently working?',"doesn't state his current employment status"],
 ['What is his phone number?',"isn't listed"],['What is his email address?','chauhansahil03115@gmail.com'],['How old is he?',"aren't shared"],['Is he married?',"aren't shared"],
 ['Does he have a linkedin?','find Sahil on GitHub and LinkedIn'],['Can he work night shifts?',"doesn't cover shift"],['Is he available for freelance work?','freelance'],
 ['What is his salary expectation?','4.5 LPA'],['Does he need a visa sponsorship?','visa'],['Get his resume','Download resume'],
 ['Where does he see himself in 5 years?','Which role'],['Where does he see himself in 3 to 5 years as a Data Analyst?','dependable data analyst'],
 ['what are his hobbies','cricket'],['what languages does he speak','Marathi'],['What are his certifications','Accenture'],['Why should we hire him','Three reasons'],
 ['What are his skills?','Analysis:'],['What did he do at KultureHire?','pivot table'],['Which college did he study in?','Raisoni'],['Any backlogs?','backlogs'],
 ['Explain quantum physics','AI'],['What is the weather today','AI']];
var bad=0;
T.forEach(function(t){var r=route(t[0]),out=plain(r.a||'');
 var ok=t[1]==='AI'?(!r.a):(out.indexOf(t[1])>=0||(!r.a&&r.hit&&plain(r.hit.a).indexOf(t[1])>=0));
 console.log((ok?'PASS ':'FAIL ')+t[0]+(ok?'':'  -> '+(r.a?out.slice(0,140):'(AI) fallback hit: '+(r.hit?r.hit.k.split(' ')[0]:'none'))));if(!ok)bad++});
console.log(bad?bad+' of '+T.length+' failed':'All '+T.length+' questions passed');process.exit(bad?1:0);