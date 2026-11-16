// Checks the "Copy summary" text and the print-ready "Save as PDF" report.
// Run from the site folder:  node tests/run-report-tests.js
var fs=require('fs'),path=require('path');
var RealDate=Date;global.Date=class extends RealDate{constructor(...a){a.length?super(...a):super('2026-10-31T10:00:00Z')}};
var src=fs.readFileSync(path.join(__dirname,'..','enhance.js'),'utf8');
var code=src.slice(src.indexOf('/* ---------- job fit checker'),src.indexOf('/* ---------- AI assistant'));
var els={};function mk(id){return els[id]||(els[id]={value:'',innerHTML:'',hidden:false,textContent:'',disabled:false,listeners:{},scrollIntoView:function(){},focus:function(){},addEventListener:function(){},onclick:null})}
var $=function(s){return mk(s)},calm=true,resume='https://portfolio-api.example.workers.dev/resume',openAI=function(){};
var copied='',printed=false,created={};
var document={getElementById:function(id){return created[id]||null},createElement:function(){return{style:{},setAttribute:function(){},select:function(){},innerHTML:''}},body:{appendChild:function(el){if(el.id)created[el.id]=el},removeChild:function(){}},execCommand:function(){return true}};
var navigator={clipboard:{writeText:function(s){copied=s;return Promise.resolve()}}};
var window={isSecureContext:true,print:function(){printed=true}};
var location={origin:'https://chauhansahiil.github.io',pathname:'/portfolio/'};
eval(code);
function runCase(f){mk('#fit-in').value=fs.readFileSync(path.join(__dirname,'cases',f),'utf8');copied='';printed=false;mk('#fit-run').onclick()}
var bad=0;function check(name,ok,info){console.log((ok?'PASS ':'FAIL ')+name+(ok?'':'  -> '+info));if(!ok)bad++}
var T=(async function(){
 runCase('idfy-entry-level-analyst.txt');
 check('result shows the share row',mk('#fit-out').innerHTML.indexOf('id="fit-copy"')>0&&mk('#fit-out').innerHTML.indexOf('id="fit-pdf"')>0);
 mk('#fit-copy').onclick();await new Promise(function(r){setTimeout(r,20)});
 ['JOB FIT SUMMARY','Candidate: Sahil Chauhan','Checked on: 31 Oct 2026','VERDICT: Good match','WHERE HE FITS','- SQL:','PRACTICAL FIT','[CHECK] Closing date','Portfolio: https://chauhansahiil.github.io/portfolio/','Resume: https://portfolio-api.example.workers.dev/resume','Contact: chauhansahil03115@gmail.com','keyword comparison'].forEach(function(s){check('copy text has "'+s+'"',copied.indexOf(s)>=0,copied.slice(0,200))});
 check('copy text has no HTML entities',!/&#39;|&amp;|&lt;|<[a-z]/.test(copied));
 mk('#fit-pdf').onclick();var rep=created['fit-report']&&created['fit-report'].innerHTML||'';
 check('print opened the browser print window',printed);
 ['Job fit report','rp-verdict','Good match','Where he fits','Not on his list yet','Practical fit','Closing date','Portfolio:'].forEach(function(s){check('print page has "'+s+'"',rep.indexOf(s)>=0)});
 runCase('injection-attempt.txt');mk('#fit-pdf').onclick();rep=created['fit-report'].innerHTML;
 check('pasted HTML cannot reach the print page',rep.indexOf('<img')<0&&rep.indexOf('onerror=alert(1)>')<0,rep.slice(0,300));
 mk('#fit-copy').onclick();await new Promise(function(r){setTimeout(r,20)});
 check('pasted HTML is shown as plain text when copied',copied.indexOf('<img')>=0&&copied.indexOf('Education:')>=0);
 runCase('staff-nurse.txt');check('no-verdict result can still be shared',mk('#fit-out').innerHTML.indexOf('id="fit-copy"')>0);
 mk('#fit-copy').onclick();await new Promise(function(r){setTimeout(r,20)});check('no-verdict summary says so',copied.indexOf('VERDICT: No skills verdict')>=0,copied.slice(0,300));
 runCase('hindi-text.txt');check('error messages have no share row',mk('#fit-out').innerHTML.indexOf('fit-copy')<0);
 runCase('senior-ml-engineer.txt');mk('#fit-copy').onclick();await new Promise(function(r){setTimeout(r,20)});check('senior role summary',copied.indexOf('VERDICT: Too senior for now')>=0&&copied.indexOf('NOT ON HIS LIST YET')>=0);
 console.log(bad?bad+' check(s) failed':'All report checks passed');process.exit(bad?1:0)})();