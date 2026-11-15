const {readFileSync}=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const source=readFileSync(__dirname+'/index.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
function setup(Audio){
 let now=1000,id=0; const frames=new Map(),els=new Map();
 const element=()=>({style:{},dataset:{},events:{},children:[],textContent:'',classList:{contains:()=>false,add(){},remove(){},toggle(){}},setAttribute(){},addEventListener(k,f){this.events[k]=f},append(e){this.children.push(e)},after(){},remove(){}});
 const get=s=>{if(!els.has(s))els.set(s,element());return els.get(s)};
 const document={hidden:false,events:{},querySelector:get,querySelectorAll:()=>[],createElement:element,addEventListener(k,f){this.events[k]=f}};
 const window={AudioContext:Audio,addEventListener(){}};
 const c=vm.createContext({document,window,performance:{now:()=>now},requestAnimationFrame:f=>{frames.set(++id,f);return id},cancelAnimationFrame:i=>frames.delete(i),setTimeout(){}});
 vm.runInContext(source,c);
 return {c,document,get,frames,run:s=>vm.runInContext(s,c),advance(t){now=t;const fs=[...frames.values()];frames.clear();fs.forEach(f=>f(now));},setNow(t){now=t}};
}
(async()=>{
 let h=setup(); h.run('begin()'); assert.equal(h.run('selfPosition'),40.2);h.advance(6000);assert.equal(h.run('selfPosition'),40.2);console.log('PASS tap-only movement, idle stays still, missing audio supported');
 for(let i=0;i<100;i++)h.run('begin()'); assert(h.run('selfPosition>=23 && selfPosition<=66')); assert.equal(h.frames.size,1);console.log('PASS rapid taps bounded; one animation loop');
 h.document.hidden=true;h.document.events.visibilitychange();const elapsed=h.run('pausedAt-origin');assert.equal(h.frames.size,0);h.setNow(66000);h.document.hidden=false;h.document.events.visibilitychange();assert.equal(h.frames.size,0);h.run('begin()');assert.equal(h.run('performance.now()-origin'),elapsed);console.log('PASS background freezes elapsed time; next tap resumes');
 h.advance(180000); const count=h.get('#ripples').children.length;h.advance(180016);assert.equal(h.get('#ripples').children.length,count);console.log('PASS long frame gap does not replay missed footsteps');
 const position=h.run('selfPosition');h.get('#scene').events.pointerdown({isPrimary:false,button:0});h.get('#scene').events.pointerdown({isPrimary:true,button:2});assert.equal(h.run('selfPosition'),position);console.log('PASS secondary pointer ignored');
 h.document.events.keydown({code:'Space',repeat:false,target:{closest:()=>true}});assert.equal(h.run('selfPosition'),position);console.log('PASS focused buttons do not trigger extra Space step');
 let resolve;class PendingAudio{constructor(){this.state='suspended'}resume(){return new Promise(r=>resolve=r)}}
 h=setup(PendingAudio);h.run('begin()');assert.equal(h.run('selfPosition'),40.2);h.document.hidden=true;h.document.events.visibilitychange();resolve();await Promise.resolve();assert(h.run('resumePending'));console.log('PASS pending audio resume never blocks walking or restarts hidden page');
 console.log('All 7 regression groups passed. Audio hardware and Safari remain manual checks.');
})();
