// Regression tests for the "Check the fit" tool. Run from the site folder:  node tests/run-fit-tests.js
// Each case pastes a real or realistic job description and checks the verdict and key facts.
// When you find a wrong result on the site, add the text to tests/cases and a line to CASES below.
var fs=require('fs'),path=require('path');
var RealDate=Date;global.Date=class extends RealDate{constructor(...a){a.length?super(...a):super('2026-10-31T10:00:00Z')}};   // fixed "today" so tests stay repeatable
var src=fs.readFileSync(path.join(__dirname,'..','enhance.js'),'utf8');
var code=src.slice(src.indexOf('/* ---------- job fit checker'),src.indexOf('/* ---------- AI assistant'));
var els={};function mk(id){return els[id]||(els[id]={value:'',innerHTML:'',hidden:true,textContent:'',scrollIntoView:function(){},addEventListener:function(){},onclick:null})}
var $=function(s){return mk(s)},calm=true,resume='RESUME',openAI=function(){};
eval(code);
function text(f){return fs.readFileSync(path.join(__dirname,'cases',f),'utf8')}
function plain(h){return h.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ')}
var CASES=[
 {f:'idfy-entry-level-analyst.txt',title:'Good match',has:['freshers','Closing date','B.Tech','within it'],not:['full year in an analyst role']},
 {f:'solarsquare-ba-data-viz.txt',title:'A stretch on experience',has:['2+ years','looks like a typo','Posting age'],not:['25+ years']},
 {f:'adityabirla-tm-data-analytics.txt',title:'Partial match: domain knowledge needed',has:['manufacturing and supply chain','ERP','Posting age'],not:['Too senior']},
 {f:'business-analyst-0-6-months.txt',title:'Not a match yet',has:['0\u20136 months','1.8 to 2.4 LPA','above the top','Requirements gathering'],not:['Good match']},
 {f:'click2cloud-business-analyst.txt',title:'Not a match yet',has:['Requirements gathering','Business process'],not:['7263975000','talent@']},
 {f:'plan8-revit-developer.txt',title:'Skills overlap, different domain',has:['BIM / Revit / CAD','1.2 LPA','GitHub'],not:['C# / .NET']},
 {f:'masycoda-supply-chain-analyst.txt',title:'Not a match yet',has:['manufacturing and supply chain','Planning and forecasting','May 8, 2024'],not:['Good match']},
 {f:'senior-ml-engineer.txt',title:'Too senior for now',has:['6+ years','master\'s degree'],not:['Good match']},
 {f:'staff-nurse.txt',msg:'healthcare and clinical work'},
 {f:'berlin-data-analyst.txt',has:['outside India','visa sponsorship','German'],not:['EUR 50,000 is stated','Pay:']},
 {f:'hindi-text.txt',msg:'English job descriptions'},
 {f:'data-engineer-spark.txt',title:'Not a match yet',has:['Spark','Airflow','Azure'],not:['Good match']},
 {f:'junior-analyst-fresher.txt',title:'Good match',has:['Pune','3 to 4 LPA','above the top of that range'],not:['Too senior']},
 {f:'one-to-three-years.txt',title:'Good skills match, experience at the edge',has:['1+ years','allows up to 30 days','Mumbai']},
 {f:'pasted-with-phone-numbers.txt',title:'Good match',has:['2.5 to 3.5 LPA','above the top of that range'],not:['9876543210','example.com']},
 {f:'several-pasted-together.txt',msg:'more than one job description'},
 {f:'junk-form-only.txt',msg:'too short'}];
var bad=0;
if(process.argv[2]==='--show'){CASES.forEach(function(c){mk('#fit-in').value=text(c.f);mk('#fit-run').onclick();var h=mk('#fit-out').innerHTML.replace(/<li class="(\w+)"><i>[^<]*<\/i><span>/g,'\n   [$1] ').replace(/<li><b>/g,'\n   - ').replace(/<\/b><span>/g,': ').replace(/<\/(?:h4|div|ul|p)>/g,'\n').replace(/<[^>]+>/g,' ').replace(/[ ]+/g,' ');console.log('=== '+c.f+'\n'+h)});process.exit(0)}
CASES.forEach(function(c){mk('#fit-in').value=text(c.f);mk('#fit-run').onclick();var h=mk('#fit-out').innerHTML,p=plain(h),ok=true,why=[];
 if(c.title){var m=h.match(/<b>([^<]+)<\/b>/);if(!m||m[1]!==c.title){ok=false;why.push('title was "'+(m&&m[1])+'"')}}
 if(c.msg&&p.indexOf(c.msg)<0){ok=false;why.push('message missing: '+c.msg)}
 (c.has||[]).forEach(function(s){if(p.indexOf(s)<0){ok=false;why.push('missing "'+s+'"')}});
 (c.not||[]).forEach(function(s){if(p.indexOf(s)>=0){ok=false;why.push('should not contain "'+s+'"')}});
 console.log((ok?'PASS ':'FAIL ')+c.f+(ok?'':'  -> '+why.join('; ')));if(!ok){bad++;console.log('   '+p.slice(0,700))}});
console.log(bad?bad+' case(s) failed':'All '+CASES.length+' cases passed');process.exit(bad?1:0);