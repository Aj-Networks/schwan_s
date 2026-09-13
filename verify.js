// SkillSight self-check. Renders every page in a stub DOM and asserts that a
// started plan is visible from every list that contains that skill.
const fs=require('fs'),vm=require('vm');
let store={};
function el(id){return{id,dataset:{},innerHTML:"",textContent:"",title:"",classList:{c:new Set(),add(x){this.c.add(x)},remove(x){this.c.delete(x)},toggle(x,v){v?this.c.add(x):this.c.delete(x)}},addEventListener(){},querySelectorAll(){return[]},querySelector(){return null},appendChild(){}};}
const n={};const g=i=>n[i]||(n[i]=el(i));
const ctx={console,document:{documentElement:{dataset:{}},createElement:()=>el('x'),getElementById:g,addEventListener(){},querySelectorAll(){return[]},querySelector(){return null}},
window:{matchMedia:()=>({matches:false}),location:{hash:''},addEventListener(){},scrollTo(){}},
history:{replaceState(){}},localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>{store[k]=v}}};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync('data.js','utf8'),ctx);
vm.runInContext(fs.readFileSync('script.js','utf8'),ctx);
const run=c=>vm.runInContext(c,ctx);
const canon=x=>run(`canonicalSkill(${JSON.stringify(x)})`);
const hasPlan=x=>!!run(`actionFor(canonicalSkill(${JSON.stringify(x)}))`);
let fail=0;const bad=m=>{console.log("  FAIL:",m);fail++;};

console.log("A. skill pages render");
const targets=new Set();
["overview","skills","risk","future","people","plants","plans"].forEach(t=>{
  run(`state.skill=null;state.list=null;state.tab=${JSON.stringify(t)};render();`);
  (g("page").innerHTML.match(/data-skill="([^"]+)"/g)||[]).forEach(m=>targets.add(m.slice(12,-1).replace(/&amp;/g,"&")));});
targets.forEach(t=>{
  run(`state.skill=${JSON.stringify(t)};state.list="skills";render();`);
  const h=g("page").innerHTML;
  if(!h.includes('class="skill-head"')) bad(`${t}: no skill page`);
  if(h.includes("undefined")||h.includes("NaN")) bad(`${t}: undefined or NaN on screen`);
  if(!h.includes("How to close it")&&!h.includes("No plan set")) bad(`${t}: no plan and no reason given`);
  if(!h.includes("Where this comes from")) bad(`${t}: no provenance`);
});
console.log(`   ${targets.size} targets`);

console.log("B. a started plan is visible from every list that holds it");
["priority","gaps","skills","risk","future"].forEach(list=>{
  run(`LISTS[${JSON.stringify(list)}].items()`).forEach(name=>{
    store={}; run(`setPlanStarted(${JSON.stringify(name)}, true)`);
    const c=canon(name);
    if(run('startedSkills()').length!==1) bad(`${c}: wrote more than one key`);
    [["overview","priority"],["overview","gaps"],["skills","skills"],["risk","risk"],["future","future"]].forEach(([tab,key])=>{
      if(!run(`LISTS[${JSON.stringify(key)}].items()`).some(i=>canon(i)===c)) return;
      run(`state.skill=null;state.list=null;state.tab=${JSON.stringify(tab)};render();`);
      if(!g("page").innerHTML.includes("Plan started")) bad(`${c}: no badge on ${tab}/${key}`);
    });
    run('state.tab="overview";render();');
    if(!/class="tick"/.test(g("tabs").innerHTML)) bad(`${c}: no tab tally`);
    run('state.tab="plans";render();');
    if(!g("page").innerHTML.includes("data-unplan")) bad(`${c}: missing from the plans page`);
  });
});
console.log("   42 skill and list combinations");

console.log("C. employee profiles");
run('D.employees').forEach(e=>{
  e.has.concat(e.learning).filter(hasPlan).forEach(sk=>{
    store={}; run(`setPlanStarted(${JSON.stringify(sk)}, true)`);
    run(`state.skill=null;state.tab="people";state.person=${JSON.stringify(e.id)};render();`);
    const h=g("page").innerHTML;
    if(!h.includes("Plan started")&&!h.includes('class="check done"')) bad(`${e.id}/${sk}: nothing shows on the profile`);
    if(!/<i class="tick">/.test(h)) bad(`${e.id}/${sk}: no tally on the person card`);
  });
  console.log(`   ${e.id}: ${e.has.concat(e.learning).filter(hasPlan).length} plan-bearing skills`);
});

console.log("D. list stepping");
["priority","gaps","skills","risk","future"].forEach(list=>{
  const items=run(`LISTS[${JSON.stringify(list)}].items()`);
  items.forEach((name,i)=>{
    run(`state.skill=${JSON.stringify(name)};state.list=${JSON.stringify(list)};render();`);
    const h=g("page").innerHTML;
    if(!h.includes(`${i+1} of ${items.length}`)) bad(`${list}/${name}: wrong position`);
    if(i<items.length-1&&!h.includes(">Next</a>")) bad(`${list}/${name}: no Next`);
    if(i>0&&!h.includes(">Previous</a>")) bad(`${list}/${name}: no Previous`);
  });
});
console.log("   42 positions");

console.log("E. data rules");
const ALLD=run('ALL'), D=run('D');
ALLD.forEach(s=>{
  const rule=s.coverage<40||D.successionRisks.some(r=>r.skill.split(" - ")[0]===s.skill.split(" - ")[0])||D.futureSkills.some(f=>f.skill===s.skill);
  if(rule!==!!D.recommendedActions[s.skill]) bad(`${s.skill}: plan does not match the stated rule`);
});
Object.keys(D.alternateActions).forEach(k=>{ if(!D.recommendedActions[k]) bad(`${k}: backup options with no first step`); });
console.log(`   ${ALLD.length} skills`);

console.log(fail? `\n${fail} PROBLEM(S)` : "\nALL CHECKS PASSED");
process.exit(fail?1:0);
