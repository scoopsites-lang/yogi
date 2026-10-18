(function(){
const SB_URL='https://zyleeqmcixyhvuapneeo.supabase.co';
const SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5bGVlcW1jaXh5aHZ1YXBuZWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MzAwMzIsImV4cCI6MjEwNzMwNjAzMn0.WDYGqmy9cnp8nRYyr5ZkVxWcR-pI8o8TqDq-V1cJRlA';
const sb=window.supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:true,autoRefreshToken:true}});
const DAY=864e5,H=36e5,TOKEN_KEY='yogis-token',SEEN_KEY='yogis-seen',MODE_KEY='yogis-mode';
let myTok=null,adminSess=false,myUid=null;
const DAYS=['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'],DL=['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳'];
const I={
 check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 ck:'<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
 search:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
 plus:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
 back:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>',
 snow:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M9 4l3 2 3-2M9 20l3-2 3 2"/></svg>',
 msg:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20l1.3-3.8A8 8 0 1 1 8 19z"/></svg>',
 link:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
 renew:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/></svg>',
 apple:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 7c-1-2.5 1-4.5 3-4.5M16.5 8c-2 0-3 1-4.5 1S9.5 8 7.5 8C5 8 3.5 10.5 3.5 13c0 4 3 8.5 5 8.5 1.3 0 2-.8 3.5-.8s2.2.8 3.5.8c2 0 5-4.5 5-8.5 0-2.5-1.5-5-4-5z"/></svg>',
 android:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="5" y="9" width="14" height="11" rx="2"/><path d="M5 13a7 7 0 0 1 14 0M8 5l1.5 2.5M16 5l-1.5 2.5"/></svg>',
 bell:'<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0"/></svg>',
 eye:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
 sun:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
 moon:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>',
 refresh:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/></svg>'
};
const logo=s=>'<svg class="logo" width="'+s+'" height="'+s+'" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="50" cy="15" rx="9" ry="8"/><path d="M50 40C45 31 30 28 26 39c-4 12 9 23 24 37 15-14 28-25 24-37-4-11-19-8-24 1z"/><path d="M45 52c-3-5 1-10 5-7 4-3 8 2 5 7-1 2-3 4-5 6"/><path d="M62 82C48 72 22 68 18 79c-3 9 20 11 44 1"/><path d="M38 82c14-10 40-14 44-3 3 9-20 11-44 1"/></svg>';

/* ---------- small utils ---------- */
const now=()=>Date.now();
const today=()=>{const d=new Date();d.setHours(0,0,0,0);return d.getTime()};
const addMonths=(ts,m)=>{const d=new Date(ts);d.setMonth(d.getMonth()+m);return d.getTime()};
const p2=n=>String(n).padStart(2,'0');
const iso=ts=>{const d=new Date(ts);return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())};
const parseD=s=>{const a=s.split('-');return new Date(+a[0],a[1]-1,+a[2]).getTime()};
const fmt=ts=>{const d=new Date(ts);return p2(d.getDate())+'.'+p2(d.getMonth()+1)+'.'+d.getFullYear()};
const dm=ts=>{const d=new Date(ts);return d.getDate()+'.'+(d.getMonth()+1)};
const hm=ts=>{const d=new Date(ts);return p2(d.getHours())+':'+p2(d.getMinutes())};
const dayTime=ts=>'יום '+DL[new Date(ts).getDay()]+' '+hm(ts);
const inTxt=ms=>{const h=Math.floor(ms/H),m=Math.round((ms%H)/6e4);return h?(h+' שעות'+(m?' ו־'+m+' דק׳':'')):m+' דק׳'};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initials=n=>n.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('');
const first=p=>p.name.split(' ')[0];
const G=(p,f,m)=>p&&p.gender==='m'?m:f;
const wkStart=ts=>{const d=new Date(ts);d.setHours(0,0,0,0);d.setDate(d.getDate()-d.getDay());return d.getTime()};
const appUrl=()=>'https://yogis.co.il/';
const isStandalone=()=>{try{return window.matchMedia('(display-mode: standalone)').matches||navigator.standalone===true}catch(e){return false}};
let installEvt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e;if(mode==='p')render()});
/* personal manifest: the installed app opens straight to this practitioner's card */
function personalManifest(tok){try{
  const base=location.origin+'/';
  const m={name:'YoGis',short_name:'YoGis',lang:'he',dir:'rtl',start_url:base+'?t='+encodeURIComponent(tok),scope:base,display:'standalone',background_color:'#F7F3EC',theme_color:'#F7F3EC',
    icons:[{src:base+'icon-192.png',sizes:'192x192',type:'image/png'},{src:base+'icon-512.png',sizes:'512x512',type:'image/png'},{src:base+'icon-maskable.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]};
  const l=document.querySelector('link[rel=manifest]');if(l)l.href=URL.createObjectURL(new Blob([JSON.stringify(m)],{type:'application/manifest+json'}));
  if(!new URLSearchParams(location.search).get('t'))history.replaceState(null,'',location.pathname+'?t='+encodeURIComponent(tok));
}catch(e){}}
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{v==null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch(e){}}};
const THEME_KEY='yogis-theme';
function isDark(){const t=document.documentElement.dataset.theme;if(t)return t==='dark';try{return matchMedia('(prefers-color-scheme: dark)').matches}catch(e){return false}}
function applyTheme(t){if(t)document.documentElement.dataset.theme=t;else delete document.documentElement.dataset.theme;
  const m=document.querySelector('meta[name=theme-color]');if(m)m.content=isDark()?'#1C1B19':'#F7F3EC'}
applyTheme(store.get(THEME_KEY));
const themeBtn=()=>'<button class="iconbtn" data-act="theme" aria-label="'+(isDark()?'מעבר לתצוגה בהירה':'מעבר לתצוגה כהה')+'">'+(isDark()?I.sun:I.moon)+'</button>';
async function q(p){const r=await p;if(r.error)throw r.error;return r.data}
const errMsg=e=>{const m=(e&&e.message)||'';if(/fetch|network/i.test(m))return 'אין חיבור לאינטרנט. נסי שוב.';return m||'משהו השתבש. נסי שוב.'};

/* ---------- state ---------- */
let S={studio:{},places:[],people:[],classes:[],sessions:{},notes:[]};
let mode='loading',view='home',sel=null,token=null,q_='',filter='all',wkOff=0,pwkOff=0,INST={},busy=false,loadErr=null;
const app=document.getElementById('app');
const findP=id=>S.people.find(x=>x.id===id);
const isFull=(n,c)=>c.cap>0&&n>=c.cap;
const capTxt=c=>c.cap>0?c.cap:'∞';

function weekInst(off){
  const base=new Date(wkStart(now()));base.setDate(base.getDate()+7*off);
  return S.classes.map(c=>{const d=new Date(base);d.setDate(d.getDate()+c.day);const tm=c.time.split(':').map(Number);d.setHours(tm[0],tm[1],0,0);const t=d.getTime();
    return{c,t,on:iso(t),k:c.id+'_'+iso(t)}}).sort((a,b)=>a.t-b.t);
}
const EMPTY={regs:[],late:[],waived:[],done:false,cancelled:false};
const getS=k=>S.sessions[k]||EMPTY;

/* card logic (same rules as the database) */
const cur=p=>p.cards[p.cards.length-1];
const frozenDays=c=>c.frozen?Math.max(0,Math.min(14,Math.round((Math.min(today(),c.frozen.until)-c.frozen.since)/DAY))):0;
const effExpires=c=>c.frozen?c.expires+frozenDays(c)*DAY:c.expires;
const freezeUsed=c=>!!c&&(c.freezes.length>0||!!c.frozen);
const left=c=>c.type==='monthly'?Infinity:c.total-c.used.length;
function status(c){
  if(!c)return'none';
  if(c.frozen)return'frozen';
  if(today()>c.expires)return'expired';
  if(c.type==='punch'&&left(c)<=0)return'done';
  if(c.expires-today()<=14*DAY)return'soon';
  return'active';
}
const LABEL={active:'פעילה',soon:'פגה בקרוב',frozen:'מוקפאת',done:'נוצלה',expired:'פג תוקף',none:'אין כרטיסייה'};
const pill=s=>'<span class="pill p-'+(s==='none'?'expired':s)+'">'+LABEL[s]+'</span>';
const daysTo=c=>Math.max(0,Math.ceil((effExpires(c)-today())/DAY));
function myRegs(p){const out=[];for(const k in S.sessions){const s=S.sessions[k];if(s.done||s.cancelled)continue;const r=s.regs.find(r=>r.pid===p.id);if(r)out.push({k,s,r})}return out.sort((a,b)=>a.s.t-b.s.t)}
const reserved=p=>myRegs(p).length;
const avail=p=>{const c=cur(p);return !c?0:c.type==='monthly'?Infinity:left(c)-reserved(p)};
function pendingReqs(){const out=[];for(const k in S.sessions){const s=S.sessions[k];if(s.cancelled)continue;s.regs.forEach(r=>{if(r.status==='pending')out.push({k,s,r,p:findP(r.pid)})})}return out.filter(x=>x.p).sort((a,b)=>a.s.t-b.s.t)}
function mapCard(c,punches,freezes){
  return{id:c.id,type:c.type,total:c.total,start:parseD(c.start||c.start_date),expires:parseD(c.expires),
    frozen:c.frozen_since?{since:parseD(c.frozen_since),until:c.frozen_until?parseD(c.frozen_until):parseD(c.frozen_since)+14*DAY,reason:c.frozen_reason||''}:null,
    used:punches,freezes:freezes.map(f=>({from:parseD(f.from_date||f.from),to:parseD(f.to_date||f.to),reason:f.reason||''}))};
}
const mapClass=c=>({id:c.id,day:c.day,time:(c.start_time||c.time).slice(0,5),name:c.name,dur:c.dur,cap:c.cap,place:c.place});

/* ---------- loading ---------- */
async function loadAdmin(){
  try{await q(sb.rpc('a_process'))}catch(e){}
  const since=iso(today()-21*DAY);
  const [st,pe,ca,fr,cl,se,rg,pu,cn,an]=await Promise.all([
    q(sb.from('studio').select('*').eq('id',1).single()),
    q(sb.from('people').select('*').order('created_at')),
    q(sb.from('cards').select('*').order('created_at')),
    q(sb.from('freezes').select('*')),
    q(sb.from('classes').select('*').eq('active',true)),
    q(sb.from('sessions').select('*').gte('on_date',since)),
    q(sb.from('regs').select('*').eq('removed',false).order('created_at')),
    q(sb.from('punches').select('*').eq('void',false).order('at')),
    q(sb.from('cancellations').select('*')),
    q(sb.from('admin_notes').select('*').order('created_at',{ascending:false}).limit(50))]);
  const {data:ses_}=await sb.auth.getSession();myUid=(ses_&&ses_.session&&ses_.session.user)?ses_.session.user.id:null;
  const sesById={};const sessions={};
  se.forEach(s=>{const o={id:s.id,class_id:s.class_id,on:s.on_date,t:Date.parse(s.starts_at),dur:s.dur||60,name:s.name,cap:s.cap,place:s.place,cancelled:s.cancelled,done:s.done,regs:[],late:[],waived:[]};sesById[s.id]=o;sessions[s.class_id+'_'+s.on_date]=o});
  rg.forEach(r=>{const s=sesById[r.session_id];if(s)s.regs.push({id:r.id,pid:r.person_id,status:r.status,reason:r.reason,punched:r.punched,refunded:r.refunded})});
  cn.forEach(x=>{const s=sesById[x.session_id];if(s)(x.kind==='late'?s.late:s.waived).push(x.person_id)});
  const keyOf=id=>{const s=se.find(x=>x.id===id);return s?s.class_id+'_'+s.on_date:null};
  S={studio:{name:st.name,teacher:st.teacher,monthly:st.monthly_enabled,defaultTotal:st.default_total,cutoff:st.cutoff_hours,price:st.price_per_class==null?50:st.price_per_class,sent:st.last_sent?Date.parse(st.last_sent):null},
    places:st.places||[],classes:cl.map(mapClass),sessions,notes:[],
    anotes:an.map(n=>({id:n.id,t:Date.parse(n.created_at),title:n.title,body:n.body,pid:n.person_id,read:(n.read_by||[]).includes(myUid)})),
    people:pe.map(p=>({id:p.id,name:p.name,phone:p.phone,token:p.token,gender:p.gender||'f',
      cards:ca.filter(c=>c.person_id===p.id).map(c=>mapCard(c,pu.filter(x=>x.card_id===c.id).map(x=>({id:x.id,t:Date.parse(x.at),why:x.why,kind:x.kind||'manual',sk:x.session_id?keyOf(x.session_id):null})),fr.filter(f=>f.card_id===c.id)))})).filter(p=>p.cards.length)
  };
  S.people.reverse();
  try{let seen=JSON.parse(store.get('yogis-aseen')||'[]');S.anotes.filter(n=>!n.read&&!seen.includes(n.id)&&now()-n.t<6*H).slice(0,3).forEach(n=>sysNotify(n.title,n.body));store.set('yogis-aseen',JSON.stringify(S.anotes.slice(0,60).map(n=>n.id)))}catch(e){}
}
async function loadP(){
  const v=await q(sb.rpc('p_view',{p_token:token}));
  const me=v.person;
  const sessions={};
  (v.sessions||[]).forEach(s=>{const regs=[];const mine=s.mine?{pid:me.id,status:s.mine.status,reason:s.mine.reason}:null;if(mine)regs.push(mine);for(let i=regs.length;i<s.count;i++)regs.push({pid:null});
    sessions[s.class_id+'_'+s.on_date]={id:s.id,class_id:s.class_id,on:s.on_date,t:Date.parse(s.t),name:s.name,cap:s.cap,place:s.place,cancelled:s.cancelled,done:s.done,regs,late:[],waived:[]}});
  const card=v.card?mapCard(v.card,(v.card.used||[]).map(u=>({t:Date.parse(u.t),why:u.why})),v.card.freezes||[]):null;
  S={studio:{name:v.studio.name,teacher:v.studio.teacher,cutoff:v.studio.cutoff},places:[],classes:(v.classes||[]).map(mapClass),sessions,
    people:[{id:me.id,name:me.name,gender:me.gender||'f',cards:card?[card]:[]}],
    notes:(v.notes||[]).map(n=>({id:n.id,pid:me.id,t:Date.parse(n.t),ref:n.ref?Date.parse(n.ref):null,title:n.title,body:n.body,kind:n.kind,read:n.read}))};
  phoneNotify();
}
async function reload(){
  try{loadErr=null;if(mode==='p')await loadP();else if(mode==='admin')await loadAdmin()}catch(e){loadErr=errMsg(e)}
  render();
}
async function act(fn,okMsg,undo){
  if(busy)return;busy=true;
  try{const r=await fn();close();await reload();if(okMsg)toast(typeof okMsg==='function'?okMsg(r):okMsg,undo);return r}
  catch(e){toast(esc(errMsg(e)));throw e}
  finally{busy=false}
}

/* phone notification for new unread notes, while the app is open */
function phoneNotify(){
  let seen;try{seen=JSON.parse(store.get(SEEN_KEY)||'[]')}catch(e){seen=[]}
  const fresh=S.notes.filter(n=>!n.read&&!expired(n)&&!seen.includes(n.id)&&now()-n.t<6*H);
  fresh.slice(0,3).forEach(n=>sysNotify(noteTitle(n),n.body));
  store.set(SEEN_KEY,JSON.stringify(S.notes.slice(0,60).map(n=>n.id)));
}
function sysNotify(title,body){try{if(!('Notification' in window)||Notification.permission!=='granted')return;
  if(navigator.serviceWorker&&navigator.serviceWorker.controller)navigator.serviceWorker.ready.then(r=>r.showNotification(title,{body,icon:'icon-192.png',badge:'icon-192.png',lang:'he',dir:'rtl'}));else new Notification(title,{body,lang:'he',dir:'rtl'})}catch(e){}}

/* ---------- shared view pieces ---------- */
function greet(){const h=new Date().getHours();return h<12?'בוקר טוב':h<17?'צהריים טובים':h<21?'ערב טוב':'לילה טוב'}
function header(){return '<div class="top"><div class="brand">'+logo(40)+'<div style="min-width:0"><b>YoGis</b><small>'+esc(S.studio.name)+'</small></div></div>'+(myTok?'<button class="iconbtn" data-act="tome">'+I.eye+'הצד שלי</button>':'')+themeBtn()+'<button class="iconbtn bell" data-act="anotes" aria-label="התראות">'+I.bell+((u=>u?'<em>'+u+'</em>':'')((S.anotes||[]).filter(n=>!n.read).length))+'</button><button class="iconbtn" data-act="refresh" aria-label="רענון">'+I.refresh+'</button></div>'}
function row(p,withPunch){
  const c=cur(p),s=status(c),canPunch=s==='active'||s==='soon';
  const sub=c.type==='monthly'?'מנוי חודשי · '+c.used.length+' כניסות':(s==='frozen'?'מוקפאת עד '+fmt(c.frozen.until)+' · '+esc(c.frozen.reason):'בתוקף עד '+fmt(effExpires(c)));
  const fz=s==='frozen';
  return '<div class="row'+(fz?' frozen-row':'')+'"><button class="rowmain" data-open="'+p.id+'"><span class="av"'+(fz?' style="background:var(--lav-soft);color:var(--ink)" title="מוקפא"':'')+'>'+(fz?I.snow:esc(initials(p.name)))+'</span><span class="who"><b>'+esc(p.name)+'</b><small>'+sub+'</small></span>'+
   (c.type==='monthly'?'<span class="count">∞<small>חודשי</small></span>':'<span class="count">'+left(c)+'/'+c.total+'<small>נותרו</small></span>')+'</button>'+
   (withPunch?(canPunch?'<button class="punch" data-punch="'+p.id+'">'+(c.type==='monthly'?'כניסה':'ניקוב')+'</button>':pill(s)):'')+'</div>';
}
function reqCard(x){
  return '<div class="req"><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b>'+esc(x.p.name)+'</b><span class="lead" style="font-size:.85rem">'+esc(x.s.name)+' · '+dayTime(x.s.t)+'</span></div>'+
   '<q>'+esc(x.r.reason||'ללא הסבר')+'</q><div class="btns"><button class="btn btn-primary btn-sm" data-approve="'+x.r.id+'">ביטול ללא ניקוב</button><button class="btn btn-soft btn-sm" data-decline="'+x.r.id+'">השארת הניקוב</button></div></div>';
}
function weekLabel(off){const ws=new Date(wkStart(now()));ws.setDate(ws.getDate()+7*off);const we=new Date(ws);we.setDate(we.getDate()+6);return dm(ws.getTime())+'–'+dm(we.getTime())}
function groupDays(list,rowFn){
  let html='',lastDay=-1;const td=today();
  list.forEach(inst=>{const d=new Date(inst.t);d.setHours(0,0,0,0);const dt=d.getTime();
    if(dt!==lastDay){lastDay=dt;const tag=dt===td?'<em>היום</em>':dt===td+DAY?'<em>מחר</em>':'';html+='<div class="dayh"><div>יום '+DAYS[d.getDay()]+tag+'</div><span>'+dm(dt)+'</span></div>'}
    html+=rowFn(inst)});
  return html;
}
function cardBody(c,p,forP){
  const s=status(c);
  if(c.type==='monthly')return '<div class="big"><b>∞</b><span>מנוי חודשי ללא הגבלה</span></div><div class="meta"><div><small>כניסות החודש</small><b>'+c.used.length+'</b></div><div><small>בתוקף עד</small><b>'+fmt(effExpires(c))+'</b></div></div>';
  const res=Math.min(reserved(p),Math.max(0,left(c)));
  let dots='';for(let i=0;i<c.total;i++){const u=i<c.used.length,r=!u&&i<c.used.length+res;dots+='<span class="dot'+(u?' used':r?' res':'')+'">'+(u?I.check:'')+'</span>'}
  return '<div class="big"><b>'+Math.max(0,left(c))+'</b><span>שיעורים נותרו מתוך '+c.total+'</span></div><div class="dots" style="grid-template-columns:repeat('+Math.min(5,c.total)+',1fr)">'+dots+'</div>'+
   '<div class="legend"><span><i style="background:var(--sage)"></i>נוצלו</span>'+(res?'<span><i style="background:var(--lav)"></i>שמורים לשיעורים שנרשמת אליהם</span>':'')+'<span><i style="border:1.5px dashed var(--sage)"></i>פנויים</span></div>'+
   '<div class="meta"><div><small>'+(s==='frozen'?'תוקף נוכחי (מתארך)':'בתוקף עד')+'</small><b>'+fmt(effExpires(c))+'</b></div><div><small>'+(s==='expired'?'פג תוקף לפני':'ימים לתום התוקף')+'</small><b>'+(s==='expired'?Math.ceil((today()-c.expires)/DAY)+' ימים':daysTo(c))+'</b></div></div>'+
   (s==='frozen'?'<div class="note">'+(forP?'הכרטיסייה מוקפאת ':'מוקפאת ')+'מ־'+fmt(c.frozen.since)+' עד '+fmt(c.frozen.until)+' ('+esc(c.frozen.reason)+'). ההפשרה אוטומטית בסוף התקופה, והתוקף יוארך במספר ימי ההקפאה.'+(forP?'<button class="btn btn-lav full" style="margin-top:10px" data-act="punfreeze">'+I.snow+'הפשרת הכרטיסייה עכשיו</button>':'')+'</div>':'');
}
function history(c){
  const ev=c.used.map((u,i)=>({t:u.t,txt:(i+1)+'. '+u.why}));
  c.freezes.forEach(f=>ev.push({t:f.to,txt:'הקפאה ('+f.reason+') · '+Math.round((f.to-f.from)/DAY)+' ימים'}));
  if(c.frozen)ev.push({t:c.frozen.since,txt:'הוקפאה ('+c.frozen.reason+')'});
  ev.push({t:c.start,txt:c.type==='monthly'?'מנוי חודשי נפתח':'כרטיסייה של '+c.total+' שיעורים נפתחה'});
  ev.sort((a,b)=>b.t-a.t);
  return '<div class="hist">'+ev.map(e=>'<div>'+esc(e.txt)+'<span>'+fmt(e.t)+'</span></div>').join('')+'</div>';
}

/* ---------- manager views ---------- */
function vLogin(){
  return '<div class="top"><div class="brand">'+logo(44)+'<div><b>YoGis</b><small>כניסת מורה</small></div></div></div>'+
   '<div class="banner" style="background:var(--sage-soft)"><div><b>מתרגלים ומתרגלות</b><small>להרשמה לשיעורים צריך לפתוח את הקישור האישי שקיבלתם מהמורה ב־WhatsApp. אפשר גם להדביק אותו כאן:</small><div style="display:flex;gap:6px;margin-top:8px"><input id="plinkin" dir="ltr" placeholder="https://yogis.co.il/?t=…" style="flex:1;min-width:0;border:1px solid var(--line);border-radius:10px;padding:8px;background:var(--surface)"><button class="btn btn-primary btn-sm" data-act="usepl">כניסה</button></div></div></div><h1>כניסה לניהול הסטודיו</h1><p class="lead">כניסה למורה בלבד.</p>'+(store.get(TOKEN_KEY)?'<button class="btn btn-soft full" style="margin-top:10px" data-act="backme">'+I.back+'חזרה לכרטיסייה שלי</button>':'')+''+
   '<form id="loginf" class="card" style="box-shadow:none;border:1px solid var(--line)"><div class="field" style="margin-top:0"><label for="em">אימייל</label><input id="em" type="email" autocomplete="username" dir="ltr" required></div>'+
   '<div class="field"><label for="pw">סיסמה</label><input id="pw" type="password" autocomplete="current-password" dir="ltr" required></div>'+
   '<p id="lerr" style="color:var(--bad);margin:10px 0 0" hidden></p><button class="btn btn-primary full" style="margin-top:14px" type="submit">כניסה</button></form>';
}
function aBanner(){const u=(S.anotes||[]).filter(n=>!n.read);if(!u.length)return'';const n=u[0];
  return '<div class="banner" role="status"><div><b>'+esc(n.title)+'</b><small>'+esc(n.body)+(u.length>1?' · ועוד '+(u.length-1)+' התראות':'')+'</small></div><button class="btn btn-soft btn-sm" data-act="anotes">לכל ההתראות</button></div>'}
function vHome(){
  const all=S.people.map(p=>[p,cur(p),status(cur(p))]);
  const act_=all.filter(x=>x[2]==='active'||x[2]==='soon').length;
  const month=new Date(today());month.setDate(1);
  const punches=all.reduce((n,x)=>n+x[1].used.filter(u=>u.t>=month.getTime()&&u.kind!=='opening').length,0);
  const regsWeek=weekInst(0).filter(i=>i.t>now()).reduce((n,i)=>n+getS(i.k).regs.length,0);
  const frozen=all.filter(x=>x[2]==='frozen').length;
  const attn=all.filter(x=>['soon','done','expired'].includes(x[2]));
  const ready=all.filter(x=>x[2]==='active'||x[2]==='soon').map(x=>x[0]).concat(all.filter(x=>x[2]==='frozen').map(x=>x[0]));
  const reqs=pendingReqs();
  const nxt=[...weekInst(0),...weekInst(1)].find(i=>i.t>now()&&!getS(i.k).cancelled);
  let next='';
  if(nxt){INST[nxt.k]=nxt;const s=getS(nxt.k);next='<h2>השיעור הבא <span>'+(nxt.t-now()<DAY?'בעוד '+inTxt(nxt.t-now()):'יום '+DAYS[new Date(nxt.t).getDay()])+'</span></h2><button class="nextcls" style="width:100%;text-align:start" data-ses="'+nxt.k+'"><div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline"><b style="font-size:1.1rem">'+esc(nxt.c.name)+'</b><span class="lead">'+dayTime(nxt.t)+'</span></div><div class="lead" style="font-size:.88rem">'+s.regs.length+' רשומים'+(nxt.c.cap?' מתוך '+nxt.c.cap:'')+' · '+esc(nxt.c.place)+'</div><div class="names">'+(s.regs.length?s.regs.map(r=>'<span class="'+(r.status==='pending'?'pend':'')+'">'+esc((findP(r.pid)||{name:'?'}).name)+'</span>').join(''):'<span>עדיין אין נרשמים</span>')+'</div></button>'}
  const empty=!S.people.length?'<div class="note">עוד אין מתרגלות במערכת. הוסיפי מתרגלת בלשונית "מתרגלים", ושלחי לה את הקישור האישי ב־WhatsApp.</div>':'';
  return header()+aBanner()+'<h1>'+greet()+', '+esc(S.studio.teacher)+'</h1><p class="lead">מי מגיעה השבוע, ומי צריכה תשומת לב.</p>'+empty+
   '<div class="stats"><button class="stat sage" data-tile="active"><b>'+act_+'</b><span>כרטיסיות פעילות</span></button><button class="stat" data-tile="regs"><b>'+regsWeek+'</b><span>הרשמות לשאר השבוע</span></button><button class="stat" data-tile="money"><b>'+punches+'</b><span>ניקובים החודש · '+shekel(punches*S.studio.price)+'</span></button><button class="stat lav" data-tile="frozen"><b>'+frozen+'</b><span>מוקפאות כרגע</span></button></div>'+
   (reqs.length?'<h2>בקשות ביטול <span>'+reqs.length+' ממתינות</span></h2><div class="list">'+reqs.map(reqCard).join('')+'</div>':'')+next+
   (attn.length?'<h2>דורשות תשומת לב <span>'+attn.length+'</span></h2><div class="list">'+attn.map(x=>row(x[0],true)).join('')+'</div>':'')+
   (ready.length?'<h2>ניקוב ידני <span>למי שהגיעה בלי הרשמה</span></h2><div class="list">'+ready.map(p=>row(p,true)).join('')+'</div>':'');
}
function adminCls(inst){
  INST[inst.k]=inst;const s=getS(inst.k),n=s.regs.length,past=inst.t<=now(),pend=s.regs.filter(r=>r.status==='pending').length;
  const cls=s.cancelled?'off':past?'past':pend?'pending':'';
  const st=s.cancelled?'בוטל':past?(s.done?'נוקב':'עבר'):pend?pend+' בקשות':isFull(n,inst.c)?'מלא':inst.c.cap?(inst.c.cap-n)+' פנויים':'פתוח';
  return '<button class="cls '+cls+'" data-ses="'+inst.k+'"><span class="tm">'+inst.c.time+'<small>'+inst.c.dur+' דק׳</small></span><span class="info"><b>'+esc(inst.c.name)+'</b><small>'+n+' / '+capTxt(inst.c)+' רשומים · '+esc(inst.c.place)+'</small>'+(inst.c.cap?'<span class="cap"><i style="width:'+Math.min(100,n/inst.c.cap*100)+'%"></i></span>':'')+'</span><span class="st">'+st+'</span></button>';
}
function vSched(){
  const list=weekInst(wkOff);
  return header()+'<h1>לו״ז שיעורים</h1><p class="lead">המתרגלות נרשמות מהטלפון. ביטול חופשי עד '+S.studio.cutoff+' שעות לפני השיעור.</p>'+
   '<div class="seg"><button data-wk="0" aria-pressed="'+(wkOff===0)+'">השבוע · '+weekLabel(0)+'</button><button data-wk="1" aria-pressed="'+(wkOff===1)+'">שבוע הבא · '+weekLabel(1)+'</button></div>'+
   '<button class="btn btn-primary full" style="margin-top:12px" data-act="sendwk">'+I.msg+'שליחת הלו״ז ב־WhatsApp</button>'+
   (S.studio.sent?'<p class="lead" style="font-size:.82rem;margin-top:6px;text-align:center">נשלח לאחרונה ב־'+fmt(S.studio.sent)+'</p>':'')+
   '<div class="list" style="gap:8px">'+(list.length?groupDays(list,adminCls):'<div class="empty">אין שיעורים קבועים. הוסיפי שיעור למטה.</div>')+'</div>'+
   '<h2>שיעורים קבועים <span>הקישי לעריכה</span></h2><div class="card" style="padding:6px 14px;box-shadow:none;border:1px solid var(--line)">'+
   S.classes.slice().sort((a,b)=>a.day-b.day||a.time.localeCompare(b.time)).map(c=>'<div class="tmpl"><button class="rowmain" data-edittmpl="'+c.id+'"><span class="d">'+DL[c.day]+'</span><span class="who"><b>'+esc(c.name)+' · '+c.time+'</b><small>'+c.dur+' דקות · '+(c.cap?'עד '+c.cap+' משתתפים':'ללא הגבלה')+' · '+esc(c.place)+'</small></span><span class="lead" style="font-size:.85rem">עריכה</span></button><button class="x" data-deltmpl="'+c.id+'" aria-label="הסרת השיעור הקבוע">×</button></div>').join('')+
   '</div><button class="btn btn-soft full" style="margin-top:10px" data-act="addtmpl">'+I.plus+'שיעור קבוע חדש</button>';
}
function vPeople(){
  const f=S.people.filter(p=>{const s=status(cur(p));
    if(q_&&!(p.name.includes(q_)||p.phone.replace(/-/g,'').includes(q_.replace(/-/g,''))))return false;
    if(filter==='active')return s==='active'||s==='soon';
    if(filter==='frozen')return s==='frozen';
    if(filter==='ended')return s==='done'||s==='expired';
    return true});
  f.sort((a,b)=>(status(cur(a))==='frozen')-(status(cur(b))==='frozen'));
  const chip=(k,t)=>'<button class="chip" data-filter="'+k+'" aria-pressed="'+(filter===k)+'">'+t+'</button>';
  return header()+'<h1>מתרגלים</h1><p class="lead">'+S.people.length+' מתרגלים בסטודיו</p>'+
   '<label class="search">'+I.search+'<input id="q" type="search" placeholder="חיפוש לפי שם או טלפון" value="'+esc(q_)+'"></label>'+
   '<div class="chips">'+chip('all','הכל')+chip('active','פעילות')+chip('frozen','מוקפאות')+chip('ended','הסתיימו')+'</div>'+
   '<div class="list" style="margin-top:12px">'+(f.length?f.map(p=>row(p,true)).join(''):'<div class="empty">'+(S.people.length?'לא נמצאו מתרגלים. נסי שם אחר.':'עוד אין מתרגלות. הקישי על "מתרגל חדש" כדי להוסיף את הראשונה.')+'</div>')+'</div>'+
   '<button class="btn btn-primary fab" data-act="add">'+I.plus+'מתרגל חדש</button>';
}
function vPerson(){
  const p=findP(sel);if(!p){view='people';return vPeople()}
  const c=cur(p),s=status(c),can=s==='active'||s==='soon',ended=s==='done'||s==='expired',mr=myRegs(p);
  return header()+'<button class="back" data-go="people">'+I.back+'כל המתרגלים</button>'+
   '<div style="display:flex;align-items:center;gap:12px;margin-top:4px"><span class="av" style="width:52px;height:52px;font-size:1.1rem">'+esc(initials(p.name))+'</span><div style="min-width:0"><h1 style="margin:0">'+esc(p.name)+'</h1><span class="lead" dir="ltr">'+esc(p.phone)+'</span></div></div>'+
   '<div class="card'+(s==='frozen'?' frozen':'')+'"><div class="card-head"><div><b>'+(c.type==='monthly'?'מנוי חודשי':'כרטיסיית '+c.total+' שיעורים')+'</b><small>נפתחה ב־'+fmt(c.start)+(c.type==='punch'?' · תקפה 3 חודשים':'')+'</small></div>'+pill(s)+'</div>'+cardBody(c,p)+'</div>'+
   (c.freezes.length&&s!=='frozen'?'<div class="note" style="background:var(--lav-soft);border-color:transparent;color:var(--ink)">'+I.snow+' הכרטיסייה הוקפאה בעבר: '+c.freezes.map(f=>fmt(f.from)+'–'+fmt(f.to)+' ('+Math.round((f.to-f.from)/DAY)+' ימים)').join(', ')+'</div>':'')+
   '<div class="actions">'+
    (ended?'<button class="btn btn-primary wide" data-act="renew">'+I.renew+'חידוש כרטיסייה</button>':'<button class="btn btn-primary wide" data-punch="'+p.id+'"'+(can?'':' disabled')+'>'+I.ck+(c.type==='monthly'?'רישום כניסה':'ניקוב ידני')+'</button>')+
    '<button class="btn btn-soft" data-act="wa">'+I.msg+'שליחה ב־WhatsApp</button>'+
    (s==='frozen'?'<button class="btn btn-lav" data-act="unfreeze">'+I.snow+'הפשרה</button>':(freezeUsed(c)?'<button class="btn btn-lav" data-act="freeze"'+(ended?' disabled':'')+'>'+I.snow+'הקפאה נוספת</button>':'<button class="btn btn-lav" data-act="freeze"'+(ended?' disabled':'')+'>'+I.snow+'הקפאה</button>'))+
    '<button class="btn btn-soft" data-act="editp">'+I.renew.replace('M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7','M4 20h4L19 9l-4-4L4 16zM14 6l4 4')+'עריכת פרטים</button>'+
    '<button class="btn btn-soft" data-act="plink">'+I.link+'הקישור האישי של '+esc(first(p))+'</button>'+
   '</div><h2>שיעורים קרובים <span>'+mr.length+'</span></h2>'+
   (mr.length?'<div class="hist">'+mr.map(x=>'<div>'+esc(x.s.name)+(x.r.status==='pending'?' · בקשת ביטול ממתינה':'')+'<span>'+dayTime(x.s.t)+' · '+dm(x.s.t)+'</span></div>').join('')+'</div>':'<p class="lead">'+G(p,'לא רשומה','לא רשום')+' לשיעורים כרגע.</p>')+
   '<h2>היסטוריה</h2>'+history(c);
}
const shekel=n=>'₪'+Math.round(n).toLocaleString('he-IL');
function upcomingRegs(){const out=[];[0,1].forEach(o=>weekInst(o).forEach(i=>{const s=getS(i.k);if(s.cancelled||i.t<=now())return;if(o===1&&i.t>wkStart(now())+14*DAY)return;s.regs.forEach(r=>out.push({inst:i,r,p:findP(r.pid)}))}));return out}
function vRegs(){
  const list=weekInst(0).filter(i=>i.t>now()&&!getS(i.k).cancelled);
  const total=list.reduce((n,i)=>n+getS(i.k).regs.length,0);
  let html='';
  if(!list.length)html='<div class="empty">אין עוד שיעורים השבוע.</div>';
  else html=groupDays(list,inst=>{INST[inst.k]=inst;const s=getS(inst.k);
    return '<button class="nextcls" style="width:100%;text-align:start" data-ses="'+inst.k+'"><div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline"><b>'+inst.c.time+' · '+esc(inst.c.name)+'</b><span class="lead" style="font-size:.85rem">'+s.regs.length+(inst.c.cap?' / '+inst.c.cap:'')+' רשומים</span></div><div class="lead" style="font-size:.85rem">'+esc(inst.c.place)+' · צפי '+shekel(s.regs.length*S.studio.price)+'</div><div class="names">'+(s.regs.length?s.regs.map(r=>'<span class="'+(r.status==='pending'?'pend':'')+'">'+esc((findP(r.pid)||{name:'?'}).name)+'</span>').join(''):'<span>עדיין אין נרשמים</span>')+'</div></button>'});
  return header()+'<button class="back" data-go="home">'+I.back+'חזרה</button><h1>הרשמות לשאר השבוע</h1><p class="lead">'+total+' הרשמות ב־'+list.length+' שיעורים · צפי הכנסה '+shekel(total*S.studio.price)+' לפי '+shekel(S.studio.price)+' לשיעור.</p><div class="list" style="gap:8px">'+html+'</div>';
}
function expectedTable(price){
  const end=now()+7*DAY,rows=[...weekInst(0),...weekInst(1)].filter(i=>i.t>now()&&i.t<end&&!getS(i.k).cancelled);
  let tot=0;const tr=rows.map(i=>{INST[i.k]=i;const s=getS(i.k),n=s.regs.length;tot+=n;
    return '<tr data-ses="'+i.k+'"><td class="when">'+DL[new Date(i.t).getDay()]+' '+dm(i.t)+'<small>'+i.c.time+'</small></td><td class="cl">'+esc(i.c.name)+'<small>'+esc(i.c.place)+'</small></td><td class="nm">'+(n?s.regs.map(r=>esc((findP(r.pid)||{name:'?'}).name)+(r.status==='pending'?' <em>(בקשת ביטול)</em>':'')).join(', '):'<span class="mut">אין נרשמים</span>')+'</td><td class="num cnt" data-u="רשומים">'+n+'</td><td class="num amt">'+shekel(n*price)+'</td></tr>'}).join('');
  return '<h2>הכנסה צפויה ל־7 הימים הקרובים <span>'+tot+' הרשמות · '+shekel(tot*price)+'</span></h2>'+
   (rows.length?'<div class="tblw"><table class="tbl"><thead><tr><th>מועד</th><th>שיעור</th><th>מתרגלים רשומים</th><th>רשומים</th><th>צפי</th></tr></thead><tbody>'+tr+'</tbody><tfoot><tr><td colspan="3">סה״כ</td><td class="num">'+tot+'</td><td class="num">'+shekel(tot*price)+'</td></tr></tfoot></table></div>':'<div class="empty">אין שיעורים ב־7 הימים הקרובים.</div>');
}
function actualTable(all,mStart,price){
  const m=all.filter(x=>x.t>=mStart),groups={};
  m.forEach(x=>{const key=x.sk&&x.kind!=='manual'?x.sk:'manual_'+iso(x.t);(groups[key]=groups[key]||{key,t:x.t,list:[],sk:x.sk&&x.kind!=='manual'?x.sk:null}).list.push(x);if(x.t<groups[key].t)groups[key].t=x.t});
  const gs=Object.values(groups).sort((a,b)=>b.t-a.t);
  const tr=gs.map(g=>{const s=g.sk?S.sessions[g.sk]:null,st=s?s.t:g.t;
    return '<tr><td class="when">'+DL[new Date(st).getDay()]+' '+dm(st)+(s?'<small>'+hm(s.t)+'</small>':'')+'</td><td class="cl">'+(s?esc(s.name)+'<small>'+esc(s.place)+'</small>':'ניקוב ידני')+'</td><td class="nm">'+g.list.map(x=>esc(x.p.name)+(x.kind==='late'?' <em>(ביטול מאוחר)</em>':'')).join(', ')+'</td><td class="num cnt" data-u="ניקובים">'+g.list.length+'</td><td class="num amt">'+shekel(g.list.length*price)+'</td></tr>'}).join('');
  return '<h2>בפועל החודש <span>'+m.length+' ניקובים · '+shekel(m.length*price)+'</span></h2>'+
   (gs.length?'<div class="tblw"><table class="tbl"><thead><tr><th>מועד</th><th>שיעור</th><th>מי נוקב</th><th>ניקובים</th><th>הכנסה</th></tr></thead><tbody>'+tr+'</tbody><tfoot><tr><td colspan="3">סה״כ</td><td class="num">'+m.length+'</td><td class="num">'+shekel(m.length*price)+'</td></tr></tfoot></table></div>':'<div class="empty">עדיין אין ניקובים החודש.</div>');
}
function vMoney(){
  const price=S.studio.price,all=[];
  S.people.forEach(p=>p.cards.forEach(c=>c.used.forEach(u=>{if(u.kind!=='opening')all.push({t:u.t,p,kind:u.kind,sk:u.sk})})));
  const d=new Date(today());d.setDate(1);const mStart=d.getTime();
  const pm=new Date(mStart);pm.setMonth(pm.getMonth()-1);const pmStart=pm.getTime();
  const wStart=wkStart(now());
  const thisMonth=all.filter(x=>x.t>=mStart).length,lastMonth=all.filter(x=>x.t>=pmStart&&x.t<mStart).length,thisWeek=all.filter(x=>x.t>=wStart).length;
  const up=upcomingRegs(),upWeek=up.filter(x=>x.inst.t<wStart+7*DAY).length;
  const daysIn=new Date(new Date(mStart).getFullYear(),new Date(mStart).getMonth()+1,0).getDate(),dayN=new Date().getDate();
  const proj=Math.round(thisMonth/dayN*daysIn);
  // last 6 months bars
  const months=[];for(let i=5;i>=0;i--){const a=new Date(mStart);a.setMonth(a.getMonth()-i);const b=new Date(a);b.setMonth(b.getMonth()+1);months.push({lbl:(a.getMonth()+1)+'/'+String(a.getFullYear()).slice(2),n:all.filter(x=>x.t>=a.getTime()&&x.t<b.getTime()).length,cur:i===0})}
  const mx=Math.max(1,...months.map(m=>m.n));
  const bars='<div class="bars" role="img" aria-label="ניקובים לפי חודש">'+months.map(m=>'<div class="bar'+(m.cur?' cur':'')+'"><span class="bv">'+shekel(m.n*price)+'</span><i style="height:'+Math.max(4,Math.round(m.n/mx*100))+'%"></i><span class="bl">'+m.lbl+'</span></div>').join('')+'</div>';
  // top practitioners this month
  const by={};all.filter(x=>x.t>=mStart).forEach(x=>{by[x.p.id]=(by[x.p.id]||{p:x.p,n:0});by[x.p.id].n++});
  const top=Object.values(by).sort((a,b)=>b.n-a.n).slice(0,8);
  return header()+'<h1>הכנסות</h1><p class="lead">לפי '+shekel(price)+' לכל שיעור שנוקב. אפשר לשנות את המחיר בהגדרות.</p>'+
   '<div class="stats"><div class="stat sage"><b>'+shekel(thisMonth*price)+'</b><span>החודש עד היום · '+thisMonth+' ניקובים</span></div><div class="stat"><b>'+shekel(proj*price)+'</b><span>צפי לסוף החודש</span></div>'+
   '<div class="stat"><b>'+shekel(lastMonth*price)+'</b><span>חודש קודם · '+lastMonth+' ניקובים</span></div><button class="stat lav" data-go="regs"><b>'+shekel(upWeek*price)+'</b><span>צפי מהרשמות לשאר השבוע · '+upWeek+'</span></button></div>'+
   '<h2>השבוע <span>'+thisWeek+' ניקובים · '+shekel(thisWeek*price)+'</span></h2>'+expectedTable(price)+actualTable(all,mStart,price)+
   '<h2>6 חודשים אחרונים</h2>'+bars+
   (top.length?'<h2>מתרגלים פעילים החודש</h2><div class="hist">'+top.map(x=>'<div>'+esc(x.p.name)+'<span>'+x.n+' שיעורים · '+shekel(x.n*price)+'</span></div>').join('')+'</div>':'')+
   (()=>{const m=all.filter(x=>x.t>=mStart),k=t=>m.filter(x=>x.kind===t).length;return '<h2>פירוט החודש</h2><div class="hist"><div>שיעורים מהלו״ז (ניקוב אוטומטי)<span>'+k('class')+'</span></div><div>ניקוב ידני<span>'+k('manual')+'</span></div><div>ביטול מאוחר<span>'+k('late')+'</span></div></div>'})()+
   '<p class="foot">החישוב כולל רק שיעורים שנוקבו בפועל: ניקוב אוטומטי בשיעור, ניקוב ידני וביטול מאוחר. לא כולל שיעורים שנוצלו לפני המעבר לאפליקציה וניקובים שהוחזרו.</p>';
}
function vSettings(){
  return header()+'<h1>הגדרות</h1><p class="lead">פרטי הסטודיו, מקומות תרגול וסוגי כרטיסיות.</p>'+
  '<h2>הסטודיו</h2><div class="field"><label for="sn">שם הסטודיו</label><input id="sn" value="'+esc(S.studio.name)+'"></div><div class="field"><label for="tn">שם המורה</label><input id="tn" value="'+esc(S.studio.teacher)+'"></div>'+
  '<div class="field"><label for="dt">ברירת מחדל לכרטיסייה חדשה</label><select id="dt">'+[5,10,20].map(n=>'<option value="'+n+'"'+(S.studio.defaultTotal==n?' selected':'')+'>'+n+' שיעורים</option>').join('')+'</select></div>'+
  '<h2>מקומות תרגול</h2><div class="chips">'+S.places.map(pl=>'<span class="chip">'+esc(pl)+' <button data-delplace="'+esc(pl)+'" aria-label="הסרת '+esc(pl)+'" style="border:0;background:none;color:var(--muted);padding:0 2px">×</button></span>').join('')+'</div><label class="search"><input id="newplace" placeholder="מקום חדש, למשל: חוף הים"><button class="btn btn-sm btn-soft" data-act="addplace">הוספה</button></label>'+
  '<h2>מדיניות ביטול</h2><div class="switch"><div><b>ביטול חופשי עד '+S.studio.cutoff+' שעות לפני השיעור</b><small>אחרי זה ביטול מנקב שיעור, או שהמתרגלת שולחת אלייך בקשה עם הסבר ואת מחליטה.</small></div></div>'+
  '<h2>סוגי כרטיסיות</h2>'+
  '<div class="switch"><div><b>כרטיסיית שיעורים</b><small>מספר שיעורים קבוע, תוקף של 3 חודשים מיום הפתיחה. ניתן להקפאה.</small></div><input type="checkbox" class="tog" checked disabled aria-label="כרטיסיית שיעורים פעילה"></div>'+
  '<div class="switch"><div><b>מנוי חודשי ללא הגבלה <span class="soon-tag">'+(S.studio.monthly?'פעיל':'כבוי')+'</span></b><small>כניסה חופשית לכל השיעורים למשך חודש. כשהאפשרות כבויה היא מוצגת אך לא ניתנת לבחירה.</small></div><input type="checkbox" class="tog" id="mon"'+(S.studio.monthly?' checked':'')+' aria-label="הפעלת מנוי חודשי"></div>'+
  '<h2>מחיר לשיעור</h2><div class="field" style="margin-top:0"><label for="pr">משמש לחישוב בעמוד ההכנסות</label><input id="pr" type="number" inputmode="numeric" min="0" value="'+S.studio.price+'"></div>'+
  '<h2>תצוגה</h2><div class="chips">'+[['','לפי הטלפון'],['light','בהירה'],['dark','כהה']].map(x=>'<button class="chip" data-themeset="'+x[0]+'" aria-pressed="'+((store.get(THEME_KEY)||'')===x[0])+'">'+x[1]+'</button>').join('')+'</div>'+
  '<h2>חשבון</h2><div class="sheet-actions"><button class="btn btn-soft" data-act="logout">יציאה מהחשבון</button></div>';
}
function vInstall(){
  return (mode==='p'?'<button class="back" data-act="pback">'+I.back+'חזרה</button>':header())+'<h1>התקנה על מסך הבית</h1><p class="lead">YoGis נפתחת כמו אפליקציה, במסך מלא ובלי חנות אפליקציות.'+(mode==='p'?' חשוב להתקין מתוך הקישור האישי, כדי שהאפליקציה תיפתח ישר לכרטיסייה שלך.':'')+'</p>'+
  '<div class="platform"><header><span class="ic" style="background:var(--clay-soft);color:var(--clay)">'+I.apple+'</span><div><b>iPhone ו־iPad</b><small>בדפדפן Safari · כדקה</small></div></header><ol class="steps">'+
   '<li><div><b>פותחים את הקישור ב־Safari</b><small>אם הקישור נפתח בתוך WhatsApp, מקישים על סמל המצפן או על "פתיחה ב־Safari" בתחתית המסך.</small></div></li>'+
   '<li><div><b>מקישים על כפתור השיתוף</b><small>הריבוע עם החץ למעלה, בתחתית המסך או ליד שורת הכתובת.</small></div></li>'+
   '<li><div><b>בוחרים "הוספה למסך הבית"</b><small>אם האפשרות לא מופיעה, גוללים מעט למטה ברשימה.</small></div></li>'+
   '<li><div><b>מקישים "הוסף"</b><small>האייקון של YoGis מופיע על מסך הבית.</small></div></li></ol></div>'+
  '<div class="platform"><header><span class="ic" style="background:var(--sage-soft);color:var(--sage-deep)">'+I.android+'</span><div><b>Android</b><small>בדפדפן Chrome · כחצי דקה</small></div></header><ol class="steps">'+
   '<li><div><b>פותחים את הקישור ב־Chrome</b><small>אם הקישור נפתח בתוך WhatsApp, מקישים על שלוש הנקודות ובוחרים "פתיחה ב־Chrome".</small></div></li>'+
   '<li><div><b>מקישים "התקנת האפליקציה"</b><small>החלון קופץ בדרך כלל לבד. אם לא, בתפריט שלוש הנקודות בוחרים "התקנת אפליקציה".</small></div></li>'+
   '<li><div><b>מאשרים את ההתקנה</b><small>מקישים "התקנה" בחלון שנפתח.</small></div></li>'+
   '<li><div><b>פותחים מהמסך הראשי</b><small>YoGis נפתחת במסך מלא.</small></div></li></ol></div>';
}

/* ---------- practitioner view ---------- */
const myNotes=p=>S.notes.filter(n=>n.pid===p.id);
const expired=n=>n.kind==='remind'&&n.ref&&n.ref<=now();
function noteTitle(n){if(n.kind==='remind'&&n.ref){const ms=n.ref-now();if(ms>0)return 'התרגול מתחיל בעוד '+inTxt(ms);return 'תזכורת לשיעור ב־'+hm(n.ref)}return n.title}
function pBanner(p){const n=myNotes(p).find(x=>!x.read&&!expired(x));if(!n)return'';
  return '<div class="banner" role="status"><div><b>'+esc(noteTitle(n))+'</b><small>'+esc(n.body)+'</small></div><button class="x" data-readnote="'+n.id+'" aria-label="סגירת ההתראה">×</button></div>'}
function pCls(p){return inst=>{
  INST[inst.k]=inst;const s=getS(inst.k),mine=s.regs.find(r=>r.pid===p.id),past=inst.t<=now(),n=s.regs.length,full=isFull(n,inst.c);
  let cls='',st='הרשמה';
  if(s.cancelled){cls='off';st='בוטל'}
  else if(past){cls='past';st=mine?'השתתפת':'עבר'}
  else if(mine&&mine.status==='pending'){cls='pending';st='ממתין לאישור'}
  else if(mine){cls='in';st=I.ck+'נרשמת'}
  else if(full){cls='full';st='מלא'}
  const sub=inst.c.dur+' דק׳ · '+esc(inst.c.place)+(s.cancelled?' · השיעור בוטל':full&&!mine?' · אין מקומות':inst.c.cap?' · '+(inst.c.cap-n)+' פנויים':'');
  return '<button class="cls '+cls+'" data-ptap="'+inst.k+'"'+(past||s.cancelled?' aria-disabled="true"':'')+'><span class="tm">'+inst.c.time+'</span><span class="info"><b>'+esc(inst.c.name)+'</b><small>'+sub+'</small></span><span class="st">'+st+'</span></button>';
}}
function vP(){
  const p=S.people[0],c=cur(p),s=status(c),list=weekInst(pwkOff),mr=myRegs(p),unread=myNotes(p).filter(n=>!n.read&&!expired(n)).length;
  return '<div class="top"><div class="brand">'+logo(40)+'<div><b>YoGis</b><small>'+esc(S.studio.name)+'</small></div></div>'+(adminSess?'<button class="iconbtn" data-act="toadmin">ניהול</button>':'')+themeBtn()+'<button class="iconbtn bell" data-act="notes" aria-label="התראות">'+I.bell+(unread?'<em>'+unread+'</em>':'')+'</button></div>'+
   (!isStandalone()?'<div class="banner" style="background:var(--sage-soft)"><div><b>'+G(p,'התקיני','התקן')+' את YoGis על מסך הבית</b><small>כך הכרטיסייה והלו״ז תמיד בהישג יד, בלחיצה אחת.</small></div>'+(installEvt?'<button class="btn btn-primary btn-sm" data-act="doinstall">התקנה</button>':'<button class="btn btn-primary btn-sm" data-act="pinstall">איך מתקינים</button>')+'</div>':'')+
   '<h1>שלום, '+esc(first(p))+'</h1><p class="lead">'+(mr.length?'נרשמת ל־'+mr.length+' שיעורים קרובים.':'עוד לא נרשמת לשיעורים השבוע.')+'</p>'+pBanner(p)+
   (c?'<div class="card'+(s==='frozen'?' frozen':'')+'"><div class="card-head"><div><b>הכרטיסייה שלי</b><small>'+(c.type==='monthly'?'מנוי חודשי':'כרטיסיית '+c.total+' שיעורים')+'</small></div>'+pill(s)+'</div>'+cardBody(c,p,true)+'</div>':'<div class="note">עדיין אין כרטיסייה פעילה. אפשר לפנות ל'+esc(S.studio.teacher)+'.</div>')+
   (s==='soon'?'<div class="note">התוקף מסתיים בעוד '+daysTo(c)+' ימים. כדאי לשבץ את השיעורים שנותרו.</div>':'')+
   (s==='done'||s==='expired'?'<div class="note">הכרטיסייה הסתיימה. לחידוש אפשר לפנות ל'+esc(S.studio.teacher)+'.</div>':'')+
   '<div class="eyebrow">לו״ז שבועי</div><p class="lead" style="text-align:center;font-size:.9rem">'+G(p,'הקישי על שיעור כדי להירשם, והקישי שוב כדי לבטל.','הקש על שיעור כדי להירשם, והקש שוב כדי לבטל.')+'<br>ניתן לבטל ללא "ניקוב" בכרטיסייה עד '+S.studio.cutoff+' שעות לפני השיעור.</p>'+
   '<div class="seg"><button data-pwk="0" aria-pressed="'+(pwkOff===0)+'">השבוע</button><button data-pwk="1" aria-pressed="'+(pwkOff===1)+'">שבוע הבא</button></div>'+
   '<div class="list" style="gap:8px">'+(list.length?groupDays(list,pCls(p)):'<div class="empty">עדיין לא פורסם לו״ז.</div>')+'</div>'+
   (c?'<h2>השיעורים שלי</h2>'+history(c):'')+
   '<div class="foot"><button class="linkbtn" data-act="pinstall">התקנת YoGis על מסך הבית</button>'+(adminSess?'':'<br><button class="linkbtn" style="color:var(--muted);font-weight:500" data-act="toadmin">כניסת מנהל</button>')+'</div>';
}

/* ---------- render ---------- */
function render(){
  INST={};let html;
  if(mode==='loading')html='<div class="top"><div class="brand">'+logo(40)+'<div><b>YoGis</b><small>טוען…</small></div></div></div><p class="lead" style="margin-top:40px;text-align:center">טוען את הנתונים…</p>';
  else if(loadErr&&(mode==='p'||mode==='admin')&&!S.classes.length)html='<div class="top"><div class="brand">'+logo(40)+'<div><b>YoGis</b></div></div></div><h1>לא הצלחנו לטעון</h1><p class="lead">'+esc(loadErr)+'</p><div class="sheet-actions"><button class="btn btn-primary" data-act="refresh">ניסיון נוסף</button>'+(mode==='p'?'<button class="btn btn-soft" data-act="forget">כניסת מורה</button>':'')+'</div>';
  else if(mode==='login')html=vLogin();
  else if(mode==='noadmin')html='<div class="top"><div class="brand">'+logo(40)+'<div><b>YoGis</b></div></div></div><h1>אין הרשאת ניהול</h1><p class="lead">החשבון הזה מחובר, אבל הוא לא מוגדר כמנהלת הסטודיו.</p><div class="sheet-actions"><button class="btn btn-soft" data-act="logout">יציאה</button></div>';
  else if(mode==='p')html=view==='install'?vInstall():vP();
  else html=({home:vHome,sched:vSched,people:vPeople,person:vPerson,install:vInstall,settings:vSettings,money:vMoney,regs:vRegs}[view]||vHome)();
  app.innerHTML=html;app.classList.toggle('pmode',mode!=='admin');
  document.getElementById('nav').hidden=mode!=='admin';
  const tab=view==='person'?'people':view==='regs'?'money':view;
  document.querySelectorAll('#nav button').forEach(b=>b.setAttribute('aria-current',b.dataset.go===tab?'page':'false'));
  const qi=document.getElementById('q');
  if(qi)qi.addEventListener('input',e=>{q_=e.target.value;const pos=e.target.selectionStart;render();const n=document.getElementById('q');n.focus();n.setSelectionRange(pos,pos)});
  const bind=(id,col,num)=>{const el=document.getElementById(id);if(el)el.addEventListener('change',e=>{const v=num?+e.target.value:e.target.value.trim();if(!v)return;act(()=>q(sb.from('studio').update({[col]:v}).eq('id',1)),'נשמר')})};
  bind('sn','name');bind('tn','teacher');bind('dt','default_total',1);bind('pr','price_per_class',1);
  const m=document.getElementById('mon');if(m)m.addEventListener('change',e=>{const on=e.target.checked;act(()=>q(sb.from('studio').update({monthly_enabled:on}).eq('id',1)),on?'מנוי חודשי הופעל':'מנוי חודשי כובה')});
  const lf=document.getElementById('loginf');if(lf)lf.addEventListener('submit',async e=>{e.preventDefault();const er=document.getElementById('lerr');er.hidden=true;
    const {error}=await sb.auth.signInWithPassword({email:document.getElementById('em').value.trim(),password:document.getElementById('pw').value});
    if(error){er.textContent=/invalid/i.test(error.message)?'האימייל או הסיסמה לא נכונים.':errMsg(error);er.hidden=false;return}
    await startAdmin()});
}

/* ---------- sheets & toast ---------- */
let bg=null;
function sheet(html){close();bg=document.createElement('div');bg.className='sheet-bg';bg.setAttribute('dir','rtl');bg.innerHTML='<div class="sheet" role="dialog" aria-modal="true">'+html+'</div>';bg.addEventListener('click',e=>{if(e.target===bg){close();return}onClick(e)});document.body.appendChild(bg);const f=bg.querySelector('input,textarea,button');if(f)f.focus()}
function close(){if(bg){bg.remove();bg=null}}
let tt;
function toast(txt,undo){document.querySelectorAll('.toast').forEach(t=>t.remove());clearTimeout(tt);const t=document.createElement('div');t.className='toast';t.setAttribute('dir','rtl');t.setAttribute('role','status');t.innerHTML='<span>'+txt+'</span>'+(undo?'<button>ביטול</button>':'');if(undo)t.querySelector('button').onclick=()=>{t.remove();undo()};document.body.appendChild(t);tt=setTimeout(()=>t.remove(),4500)}
function copyText(text,el){navigator.clipboard.writeText(text).then(()=>toast('הועתק'),()=>{const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r);toast('הטקסט מסומן. אפשר להעתיק ידנית')})}

/* ---------- manager actions ---------- */
function askPunch(id){
  const p=findP(id),c=cur(p),mon=c.type==='monthly';
  sheet('<h3>'+(mon?'רישום כניסה':'ניקוב ידני')+'</h3><p class="lead">'+esc(p.name)+(mon?' · מנוי חודשי':' · נותרו '+left(c)+' מתוך '+c.total)+'</p>'+
   (mon?'':'<p>אחרי הניקוב יישארו <b>'+(left(c)-1)+'</b> שיעורים. מתרגלות שנרשמו מראש מנוקבות אוטומטית כשהשיעור מתחיל.</p>')+
   '<div class="sheet-actions"><button class="btn btn-primary" data-confirm="'+id+'">אישור '+(mon?'כניסה':'ניקוב')+'</button><button class="btn btn-soft" data-act="close">ביטול</button></div>');
}
async function doPunch(id){
  const p=findP(id),c=cur(p);
  const row_=await act(()=>q(sb.from('punches').insert({card_id:c.id,why:c.type==='monthly'?'כניסה':'ניקוב ידני'}).select().single()),
    ()=>esc(c.type==='monthly'?'נרשמה כניסה ל'+first(p):'נוקב. ל'+first(p)+' נותרו '+left(cur(findP(id)))+' שיעורים'),
    ()=>act(()=>q(sb.from('punches').update({void:true}).eq('id',row_.id)),'הניקוב בוטל'));
}
function sesSheet(k){
  const inst=INST[k],s=getS(k),past=inst.t<=now();
  const nm=pid=>esc((findP(pid)||{name:'?'}).name);
  let body='';
  if(s.cancelled)body='<div class="note">השיעור בוטל. ההרשמות הוסרו בלי ניקוב.</div>';
  else{
    body+='<h2>'+(past?'השתתפו ונוקבו':'רשומות')+' <span>'+s.regs.length+' / '+capTxt(inst.c)+'</span></h2>';
    body+=s.regs.length?'<div class="hist">'+s.regs.map(r=>'<div><span style="color:var(--ink)">'+nm(r.pid)+(r.status==='pending'?' · <b style="color:var(--warn)">בקשת ביטול</b>':'')+(r.refunded?' · הניקוב הוחזר':'')+'</span>'+(past&&r.punched&&!r.refunded?'<button class="btn btn-soft btn-sm" data-refund="'+r.id+'">החזרת ניקוב</button>':'')+'</div>').join('')+'</div>':'<p class="lead">אין נרשמות עדיין.</p>';
    const reqs=s.regs.filter(r=>r.status==='pending'&&findP(r.pid));
    if(reqs.length)body+='<h2>בקשות ביטול</h2><div class="list">'+reqs.map(r=>reqCard({k,s,r,p:findP(r.pid)})).join('')+'</div>';
    if(s.late.length)body+='<h2>ביטולים מאוחרים (נוקבו)</h2><div class="names">'+s.late.map(pid=>'<span>'+nm(pid)+'</span>').join('')+'</div>';
    if(s.waived.length)body+='<h2>בוטלו בלי ניקוב</h2><div class="names">'+s.waived.map(pid=>'<span>'+nm(pid)+'</span>').join('')+'</div>';
  }
  sheet('<h3>'+esc(inst.c.name)+'</h3><p class="lead">יום '+DAYS[new Date(inst.t).getDay()]+' '+dm(inst.t)+' · '+inst.c.time+' · '+inst.c.dur+' דקות · '+esc(inst.c.place)+'</p>'+(past?'':'<p class="lead" style="font-size:.88rem">הרשומות ינוקבו אוטומטית כשהשיעור יתחיל.</p>')+body+
   '<div class="sheet-actions">'+(!past&&!s.cancelled?'<button class="btn btn-clay" data-act="cancelses" data-k="'+k+'">ביטול השיעור הזה</button>':'')+'<button class="btn btn-soft" data-act="close">סגירה</button></div>');
}
function addSheet(renewFor){
  const p=renewFor&&findP(renewFor);
  let type='punch',total=S.studio.defaultTotal,gender='f',exp=iso(addMonths(today(),3));
  const draw=()=>{
    const opt=(k,t,s,locked)=>'<button class="opt'+(locked?' locked':'')+'" data-type="'+k+'" aria-pressed="'+(type===k)+'"'+(locked?' aria-disabled="true"':'')+'><b>'+t+(locked?'<span class="soon-tag">בקרוב</span>':'')+'</b><small>'+s+'</small></button>';
    sheet('<h3>'+(p?'חידוש כרטיסייה':'מתרגל חדש')+'</h3>'+(p?'<p class="lead">'+esc(p.name)+'</p>':'<div class="field"><label for="nn">שם מלא</label><input id="nn" autocomplete="off" placeholder="לדוגמה: אורית כהן"></div><div class="field"><label for="np">טלפון</label><input id="np" inputmode="tel" dir="ltr" style="text-align:right" placeholder="050-0000000"></div>'+'<div class="field"><label>פנייה בהודעות ובאפליקציה</label><div class="chips">'+[['f','בלשון נקבה'],['m','בלשון זכר']].map(x=>'<button class="chip" data-gender="'+x[0]+'" aria-pressed="'+(gender===x[0])+'">'+x[1]+'</button>').join('')+'</div></div>')+
     '<div class="field"><label>סוג כרטיסייה</label><div class="opts">'+opt('punch','כרטיסיית שיעורים','תוקף 3 חודשים')+opt('monthly','מנוי חודשי','ללא הגבלת שיעורים',!S.studio.monthly)+'</div></div>'+
     (type==='punch'?'<div class="grid2"><div class="field"><label for="nt">מספר שיעורים</label><input id="nt" type="number" inputmode="numeric" min="1" max="100" value="'+total+'"></div><div class="field"><label for="nused">כבר נוצלו</label><input id="nused" type="number" inputmode="numeric" min="0" max="100" value="0"></div></div><p class="lead" style="font-size:.82rem;margin-top:4px">"כבר נוצלו": לכרטיסייה שהתחילה לפני האפליקציה. לא נספר בהכנסות.</p>':'')+'<div class="field"><label for="nexp">בתוקף עד</label><input id="nexp" type="date" value="'+exp+'"></div><p class="lead" style="font-size:.85rem;margin-top:4px">ברירת המחדל: '+(type==='punch'?'3 חודשים':'חודש')+' מהיום. אפשר לשנות.</p>'+
     '<p id="err" style="color:var(--bad);margin:8px 0 0" hidden></p><div class="sheet-actions"><button class="btn btn-primary" data-act="'+(p?'saverenew':'saveadd')+'">'+(p?'פתיחת כרטיסייה חדשה':'הוספה ופתיחת כרטיסייה')+'</button><button class="btn btn-soft" data-act="close">ביטול</button></div>');
    const nt=bg.querySelector('#nt');if(nt)nt.oninput=e=>total=+e.target.value||total;bg.querySelector('#nexp').onchange=e=>{if(e.target.value)exp=e.target.value};bg.querySelectorAll('[data-gender]').forEach(b=>b.onclick=e=>{e.stopPropagation();gender=b.dataset.gender;bg.querySelectorAll('[data-gender]').forEach(x=>x.setAttribute('aria-pressed',x===b))});
    bg.querySelectorAll('[data-type]').forEach(b=>b.onclick=e=>{e.stopPropagation();if(b.dataset.type==='monthly'&&!S.studio.monthly){toast('מנוי חודשי עוד לא הופעל. אפשר להפעיל בהגדרות.');return}
      const nn=bg.querySelector('#nn'),keep=nn?[nn.value,bg.querySelector('#np').value]:null;type=b.dataset.type;exp=iso(addMonths(today(),type==='punch'?3:1));draw();if(keep){bg.querySelector('#nn').value=keep[0];bg.querySelector('#np').value=keep[1]}});
  };
  draw();
  addSheet.make=pid=>({person_id:pid,type,total:type==='monthly'?0:Math.max(1,Math.min(100,total)),start_date:iso(today()),expires:exp});addSheet.gender=()=>gender;addSheet.used=()=>{const e=bg&&bg.querySelector('#nused');return e?Math.max(0,Math.min(total,+e.value||0)):0};
}
function tmplSheet(id){
  const c=id?S.classes.find(x=>x.id===id):{name:'יוגה',day:0,time:'18:00',dur:60,cap:12,place:S.places[0]||''};
  sheet('<h3>'+(id?'עריכת שיעור קבוע':'שיעור קבוע חדש')+'</h3><p class="lead">'+(id?'השינוי חל מהשיעור הבא. מתרגלות שכבר רשומות יקבלו הודעה על שינוי יום, שעה או מקום.':'השיעור יופיע בלו״ז בכל שבוע.')+'</p>'+
   '<div class="field"><label for="tnm">שם השיעור</label><input id="tnm" value="'+esc(c.name)+'"></div>'+
   '<div class="field"><label for="tpl">מקום התרגול</label><select id="tpl">'+S.places.map(pl=>'<option'+(pl===c.place?' selected':'')+'>'+esc(pl)+'</option>').join('')+'<option value="__new">מקום חדש…</option></select><input id="tpn" placeholder="לדוגמה: חוף הים בהרצליה" hidden></div>'+
   '<div class="grid2"><div class="field"><label for="tdy">יום</label><select id="tdy">'+DAYS.map((d,i)=>'<option value="'+i+'"'+(i===c.day?' selected':'')+'>'+d+'</option>').join('')+'</select></div><div class="field"><label for="ttm">שעה</label><input id="ttm" type="time" value="'+c.time+'"></div></div>'+
   '<div class="grid2"><div class="field"><label for="tdu">משך (דקות)</label><input id="tdu" type="number" inputmode="numeric" min="15" max="240" step="5" value="'+c.dur+'"></div><div class="field"><label for="tcp">מקסימום משתתפים</label><input id="tcp" type="number" inputmode="numeric" min="1" max="200" value="'+(c.cap||12)+'"'+(c.cap?'':' disabled')+'></div></div>'+
   '<label class="check"><input type="checkbox" id="tun"'+(c.cap?'':' checked')+'>ללא הגבלת משתתפים</label>'+
   '<p id="terr" style="color:var(--bad);margin:8px 0 0" hidden></p>'+
   '<div class="sheet-actions"><button class="btn btn-primary" data-act="savetmpl"'+(id?' data-id="'+id+'"':'')+'>'+(id?'שמירת השינויים':'הוספה ללו״ז')+'</button><button class="btn btn-soft" data-act="close">ביטול</button></div>');
  const tpl=bg.querySelector('#tpl'),tpn=bg.querySelector('#tpn');if(!S.places.length){tpl.value='__new';tpn.hidden=false}tpl.onchange=()=>{tpn.hidden=tpl.value!=='__new';if(!tpn.hidden)tpn.focus()};
  const tun=bg.querySelector('#tun'),tcp=bg.querySelector('#tcp');tun.onchange=()=>{tcp.disabled=tun.checked};
}
function freezeSheet(){
  const pc=cur(findP(sel)),again=pc&&pc.freezes.length>0;freezeSheet.again=again;
  let reason='חופשה';const reasons=['חופשה','היריון','פציעה','מחלה','אחר'];
  const endTxt=n=>fmt(today()+n*DAY);
  sheet('<h3>'+(again?'הקפאה נוספת':'הקפאת כרטיסייה')+'</h3>'+(again?'<div class="banner" style="margin-top:0"><div><b>הכרטיסייה כבר הוקפאה בעבר</b><small>'+pc.freezes.map(f=>fmt(f.from)+'–'+fmt(f.to)+' ('+Math.round((f.to-f.from)/DAY)+' ימים, '+esc(f.reason)+')').join(' · ')+'. ההקפאה הנוספת היא חריגה באישור מנהל.</small></div></div>':'')+'<p class="lead">אפשר להקפיא <b>פעם אחת בכל כרטיסייה</b>, ל־14 ימים לכל היותר. בזמן ההקפאה אי אפשר לנקב או להירשם. בסוף התקופה הכרטיסייה מופשרת אוטומטית, והתוקף מתארך במספר ימי ההקפאה. הרשמות בתקופה הזו יבוטלו בלי ניקוב.</p><div class="field"><label>סיבה</label><div class="chips">'+reasons.map(r=>'<button class="chip" data-r="'+r+'" aria-pressed="'+(r===reason)+'">'+r+'</button>').join('')+'</div></div>'+
   '<div class="field"><label for="fdays">מספר ימים (עד 14)</label><input id="fdays" type="number" inputmode="numeric" min="1" max="14" value="14"></div><p class="lead" id="fend" style="font-size:.88rem;margin-top:6px">הפשרה אוטומטית ב־'+endTxt(14)+'</p><p id="ferr" style="color:var(--bad);margin:6px 0 0" hidden></p><div class="sheet-actions"><button class="btn btn-primary" data-act="dofreeze">הקפאה מהיום</button><button class="btn btn-soft" data-act="close">ביטול</button></div>');
  bg.querySelectorAll('[data-r]').forEach(b=>b.onclick=e=>{e.stopPropagation();reason=b.dataset.r;bg.querySelectorAll('[data-r]').forEach(x=>x.setAttribute('aria-pressed',x===b))});
  const fd=bg.querySelector('#fdays');fd.oninput=()=>{const n=+fd.value;bg.querySelector('#fend').textContent=n>=1&&n<=14?'הפשרה אוטומטית ב־'+endTxt(n):'אפשר לבחור בין יום אחד ל־14 ימים'};
  freezeSheet.reason=()=>reason;freezeSheet.days=()=>+fd.value;
}
const personalLink=p=>appUrl()+'?t='+p.token;
function waText(href,text,note){
  return '<div class="msg">'+esc(text)+'</div><div class="sheet-actions"><a class="btn btn-primary" target="_blank" rel="noopener" href="'+href+'">פתיחה ב־WhatsApp</a><button class="btn btn-soft" id="cp">העתקת ההודעה</button></div>'+(note?'<p class="lead" style="font-size:.82rem;margin-top:10px">'+note+'</p>':'');
}
function waSheet(){
  const p=findP(sel),c=cur(p),s=status(c);
  let body;
  if(c.type==='monthly')body='המנוי החודשי שלך פעיל עד '+fmt(effExpires(c))+'.';
  else if(s==='frozen')body='הכרטיסייה שלך מוקפאת. נותרו בה '+left(c)+' שיעורים, והתוקף יוארך כשנפשיר אותה.';
  else if(s==='done')body='ניצלת את כל '+c.total+' השיעורים בכרטיסייה. נשמח לחדש לך!';
  else if(s==='expired')body='תוקף הכרטיסייה הסתיים ב־'+fmt(c.expires)+'. נשמח לחדש לך!';
  else body='נותרו לך '+left(c)+' שיעורים מתוך '+c.total+', בתוקף עד '+fmt(effExpires(c))+'.';
  const text='היי '+first(p)+',\n'+body+'\nהכרטיסייה והלו״ז שלך (אפשר להירשם לשיעורים ולהתקין כאפליקציה):\n'+personalLink(p)+'\n\n'+S.studio.name;
  const phone='972'+p.phone.replace(/\D/g,'').replace(/^0/,'');
  sheet('<h3>שליחה ב־WhatsApp</h3><p class="lead">ההודעה מוכנה ל'+esc(p.name)+', כולל הקישור האישי '+G(p,'שלה','שלו')+'.</p>'+waText('https://wa.me/'+phone+'?text='+encodeURIComponent(text),text));
  bg.querySelector('#cp').onclick=e=>{e.stopPropagation();copyText(text,bg.querySelector('.msg'))};
}
function editSheet(){
  const p=findP(sel),c=cur(p);
  sheet('<h3>עריכת '+esc(first(p))+'</h3><p class="lead">פרטי המתרגלת והכרטיסייה הנוכחית.</p>'+
   '<div class="field"><label for="en">שם מלא</label><input id="en" value="'+esc(p.name)+'"></div>'+
   '<div class="field"><label for="ep">טלפון</label><input id="ep" inputmode="tel" dir="ltr" style="text-align:right" value="'+esc(p.phone)+'"></div>'+'<div class="field"><label for="eg">פנייה בהודעות ובאפליקציה</label><select id="eg"><option value="f"'+(p.gender!=='m'?' selected':'')+'>בלשון נקבה</option><option value="m"'+(p.gender==='m'?' selected':'')+'>בלשון זכר</option></select></div>'+
   (c.type==='punch'?'<div class="field"><label for="et">מספר שיעורים בכרטיסייה</label><input id="et" type="number" inputmode="numeric" min="1" max="100" value="'+c.total+'"></div><p class="lead" style="font-size:.85rem;margin-top:4px">כבר נוצלו '+c.used.length+' שיעורים.</p>':'')+
   '<div class="field"><label for="ex">בתוקף עד</label><input id="ex" type="date" value="'+iso(c.expires)+'"></div>'+
   '<p id="eerr" style="color:var(--bad);margin:8px 0 0" hidden></p><div class="sheet-actions"><button class="btn btn-primary" data-act="saveedit">שמירה</button><button class="btn btn-soft" data-act="close">ביטול</button></div>');
}
function linkSheet(){
  const p=findP(sel),l=personalLink(p);
  sheet('<h3>הקישור האישי של '+esc(first(p))+'</h3><p class="lead">דרך הקישור הזה '+esc(first(p))+' '+G(p,'רואה את הכרטיסייה שלה ונרשמת','רואה את הכרטיסייה שלו ונרשם')+' לשיעורים, בלי סיסמה. אל תשתפי אותו עם אחרים.</p><div class="msg" dir="ltr" style="word-break:break-all">'+esc(l)+'</div><div class="sheet-actions"><a class="btn btn-primary" target="_blank" rel="noopener" href="'+esc(l)+'">פתיחה בחלון חדש</a><button class="btn btn-soft" id="cp">העתקה</button></div>');
  bg.querySelector('#cp').onclick=e=>{e.stopPropagation();copyText(l,bg.querySelector('.msg'))};
}
function weekSheet(){
  const list=weekInst(wkOff).filter(i=>!getS(i.k).cancelled&&i.t>now());
  let lines='',last=-1;
  list.forEach(i=>{const d=new Date(i.t).getDay();lines+=(d!==last?'\n*יום '+DAYS[d]+' '+dm(i.t)+'*\n':'')+i.c.time+' · '+i.c.name+' ('+i.c.dur+' דק׳) · '+i.c.place+'\n';last=d});
  const text='שבוע טוב!\nהלו״ז לשבוע '+weekLabel(wkOff)+':\n'+(lines||'\nאין שיעורים פתוחים השבוע.\n')+'\nלהרשמה לשיעורים:\n'+appUrl()+'\n\nביטול חופשי עד '+S.studio.cutoff+' שעות לפני השיעור.\n'+S.studio.name;
  sheet('<h3>שליחת הלו״ז השבועי</h3><p class="lead">בוחרים ב־WhatsApp את קבוצת המתרגלות או רשימת התפוצה. מי שכבר פתח פעם אחת את הקישור האישי שלו, נכנס מהקישור הזה ישר לכרטיסייה ולהרשמה.</p>'+waText('https://wa.me/?text='+encodeURIComponent(text),text));
  bg.querySelector('#cp').onclick=e=>{e.stopPropagation();copyText(text,bg.querySelector('.msg'))};
  bg.querySelector('a.btn').addEventListener('click',()=>{sb.from('studio').update({last_sent:new Date().toISOString()}).eq('id',1).then(()=>{})});
}

/* ---------- practitioner actions ---------- */
async function pTap(k){
  const inst=INST[k],p=S.people[0],c=cur(p),s=getS(k),mine=s.regs.find(r=>r.pid===p.id),ms=inst.t-now();
  if(s.cancelled){toast('השיעור הזה בוטל');return}
  if(ms<=0){toast('השיעור כבר התחיל');return}
  if(!mine){
    let r;try{r=await act(()=>q(sb.rpc('p_register',{p_token:token,p_class:inst.c.id,p_date:inst.on})),null)}catch(e){return}
    if(r&&r.last){sheet('<h3>השיעור האחרון בכרטיסייה</h3><p class="lead">נרשמת ל'+esc(inst.c.name)+', '+dayTime(inst.t)+' · '+esc(inst.c.place)+'.</p><div class="banner"><div><b>זה השיעור האחרון שנשאר בכרטיסייה שלך.</b><small>כדי להמשיך להירשם אחריו צריך לחדש את הכרטיסייה אצל '+esc(S.studio.teacher)+'.</small></div></div><div class="sheet-actions"><button class="btn btn-primary" data-act="close">הבנתי</button></div>');return}
    const sid=getS(k).id;
    toast('נרשמת ל'+esc(inst.c.name)+', '+dayTime(inst.t),()=>act(()=>q(sb.rpc('p_cancel',{p_token:token,p_session:sid,p_mode:'free'})),'ההרשמה בוטלה'));
    return;
  }
  if(mine.status==='pending'){
    sheet('<h3>הבקשה ממתינה</h3><p class="lead">שלחת ל'+esc(S.studio.teacher)+' בקשה לבטל את '+esc(inst.c.name)+' ('+dayTime(inst.t)+') בלי ניקוב.</p><div class="msg">'+esc(mine.reason||'')+'</div><div class="stack"><button class="btn btn-soft" data-act="withdraw" data-k="'+k+'">'+G(p,'משיכת הבקשה. אני מגיעה','משיכת הבקשה. אני מגיע')+'</button><button class="btn btn-soft" data-act="close">סגירה</button></div>');
    return;
  }
  if(ms>=S.studio.cutoff*H){
    act(()=>q(sb.rpc('p_cancel',{p_token:token,p_session:s.id,p_mode:'free'})),'ההרשמה ל'+esc(inst.c.name)+' בוטלה').catch(()=>{});
    return;
  }
  sheet('<h3>ביטול מאוחר</h3><p class="lead">'+esc(inst.c.name)+' מתחיל בעוד '+inTxt(ms)+'. ביטול בפחות מ־'+S.studio.cutoff+' שעות לפני השיעור מנקב שיעור מהכרטיסייה.</p>'+
   '<div class="stack"><button class="btn btn-clay" data-act="latecancel" data-k="'+k+'">ביטול וניקוב שיעור</button>'+
   '<button class="btn btn-soft" data-act="showreq">בקשה מ'+esc(S.studio.teacher)+' לבטל בלי ניקוב</button>'+
   '<div id="reqbox" hidden><div class="field"><label for="rr">הסבר קצר ל'+esc(S.studio.teacher)+'</label><textarea id="rr" rows="3" placeholder="לדוגמה: חליתי הבוקר"></textarea></div><p id="rerr" style="color:var(--bad);margin:6px 0 0" hidden>'+G(p,'כתבי','כתוב')+' כמה מילים כדי ש'+esc(S.studio.teacher)+' תוכל להחליט.</p><button class="btn btn-primary full" style="margin-top:10px" data-act="sendreq" data-k="'+k+'">שליחת הבקשה</button></div>'+
   '<button class="btn btn-soft" data-act="close">השארת ההרשמה</button></div>');
}
async function addOpening(cardId,n){if(!n)return;const rows=[];for(let i=0;i<n;i++)rows.push({card_id:cardId,why:'ניצול קודם (לפני המעבר לאפליקציה)',kind:'opening'});await q(sb.from('punches').insert(rows))}
function aNotesSheet(){
  const list=S.anotes||[];
  if(list.some(n=>!n.read)){list.forEach(n=>n.read=true);sb.rpc('a_read_admin_notes').then(()=>{});render()}
  sheet('<h3>התראות ניהול</h3>'+(list.length?'<div>'+list.map(n=>'<div class="noteitem"><b>'+esc(n.title)+'</b><small>'+esc(n.body)+'</small><small>'+fmt(n.t)+' · '+hm(n.t)+'</small></div>').join('')+'</div>':'<p class="lead">אין התראות כרגע. כאן יופיעו עדכונים כמו הפשרת כרטיסייה על ידי מתרגל.</p>')+
   '<div class="sheet-actions"><button class="btn btn-soft" data-act="close">סגירה</button></div>');
}
function pUnfreezeSheet(){
  const p=S.people[0],c=cur(p),d=frozenDays(c);
  sheet('<h3>הפשרת הכרטיסייה</h3><p class="lead">'+G(p,'בטוחה','בטוח')+' '+G(p,'שאת רוצה','שאתה רוצה')+' להפשיר את הכרטיסייה עכשיו?</p>'+
   '<div class="note" style="margin-top:8px">התוקף יוארך ב־'+d+' ימים (ימי ההקפאה שעברו). אחרי ההפשרה '+G(p,'תוכלי','תוכל')+' שוב להירשם לשיעורים.<br><b>הקפאה נוספת אפשרית רק באישור '+esc(S.studio.teacher)+'.</b> '+esc(S.studio.teacher)+' '+G({gender:'f'},'תקבל','יקבל')+' הודעה על ההפשרה.</div>'+
   '<div class="sheet-actions"><button class="btn btn-primary" data-act="dopunfreeze">כן, להפשיר עכשיו</button><button class="btn btn-soft" data-act="close">ביטול</button></div>');
}
function notesSheet(){
  const p=S.people[0],list=myNotes(p);
  if(list.some(n=>!n.read)){list.forEach(n=>n.read=true);sb.rpc('p_read_notes',{p_token:token}).then(()=>{});render()}
  const perm=('Notification' in window)?Notification.permission:'none';
  const permTxt=perm==='granted'?'התראות בטלפון פעילות כשהאפליקציה פתוחה או ברקע.':perm==='denied'?'ההתראות חסומות. אפשר להפעיל אותן בהגדרות הטלפון עבור YoGis.':perm==='none'?'בדפדפן הזה אין התראות. ב־iPhone צריך קודם להתקין את YoGis למסך הבית.':'כדי לקבל תזכורת שעה לפני כל שיעור גם בטלפון, '+G(p,'הפעילי','הפעל')+' התראות.';
  sheet('<h3>התראות</h3>'+(list.length?'<div>'+list.map(n=>'<div class="noteitem"><b>'+esc(noteTitle(n))+'</b><small>'+esc(n.body)+'</small><small>'+fmt(n.t)+' · '+hm(n.t)+'</small></div>').join('')+'</div>':'<p class="lead">אין התראות עדיין. תזכורת תגיע שעה לפני כל שיעור שנרשמת אליו.</p>')+
   '<div class="note">'+permTxt+'</div><div class="sheet-actions">'+(perm==='default'?'<button class="btn btn-primary" data-act="perm">הפעלת התראות בטלפון</button>':'')+(perm==='granted'?'<button class="btn btn-soft" data-act="testnote">התראת בדיקה</button>':'')+'<button class="btn btn-soft" data-act="close">סגירה</button></div>');
}

/* ---------- clicks ---------- */
function onClick(e){
  const t=e.target.closest('[data-go],[data-open],[data-punch],[data-confirm],[data-act],[data-filter],[data-ses],[data-ptap],[data-wk],[data-pwk],[data-approve],[data-decline],[data-refund],[data-deltmpl],[data-edittmpl],[data-readnote],[data-delplace],[data-tile],[data-themeset]');if(!t)return;
  const d=t.dataset;
  if(d.go){close();view=d.go;render();window.scrollTo(0,0)}
  else if(d.open){sel=d.open;view='person';render();window.scrollTo(0,0)}
  else if(d.punch){askPunch(d.punch)}
  else if(d.confirm){doPunch(d.confirm).catch(()=>{})}
  else if(d.filter){filter=d.filter;render()}
  else if(d.ses){sesSheet(d.ses)}
  else if(d.ptap){pTap(d.ptap)}
  else if(d.wk){wkOff=+d.wk;render()}
  else if(d.pwk){pwkOff=+d.pwk;render()}
  else if(d.approve){act(()=>q(sb.rpc('a_resolve',{p_reg:d.approve,p_approve:true})),'הבקשה אושרה. לא ינוקב שיעור').catch(()=>{})}
  else if(d.decline){act(()=>q(sb.rpc('a_resolve',{p_reg:d.decline,p_approve:false})),'ההרשמה נשארת. השיעור ינוקב').catch(()=>{})}
  else if(d.refund){act(()=>q(sb.rpc('a_refund',{p_reg:d.refund})),'הניקוב הוחזר').catch(()=>{})}
  else if(d.tile){const m={active:['people','active'],frozen:['people','frozen'],money:['money'],regs:['regs']}[d.tile];view=m[0];if(m[1]){filter=m[1];q_=''}render();window.scrollTo(0,0)}
  else if(d.themeset!=null){store.set(THEME_KEY,d.themeset||null);applyTheme(d.themeset||null);render()}
  else if(d.edittmpl){tmplSheet(d.edittmpl)}
  else if(d.readnote){const n=S.notes.find(x=>x.id===d.readnote);if(n)n.read=true;render();sb.rpc('p_read_notes',{p_token:token,p_note:d.readnote}).then(()=>{})}
  else if(d.delplace){if(S.classes.some(c=>c.place===d.delplace)){toast('יש שיעורים קבועים במקום הזה. שני להם מקום קודם');return}if(S.places.length<2){toast('צריך להשאיר לפחות מקום אחד');return}
    act(()=>q(sb.from('studio').update({places:S.places.filter(x=>x!==d.delplace)}).eq('id',1)),'המקום הוסר').catch(()=>{})}
  else if(d.deltmpl){
    if(t.dataset.armed){act(()=>q(sb.from('classes').update({active:false}).eq('id',d.deltmpl)),'השיעור הוסר מהלו״ז הקבוע').catch(()=>{})}
    else{t.dataset.armed='1';t.textContent='הסרה?';t.style.width='auto';t.style.padding='0 10px';t.style.color='var(--bad)';setTimeout(()=>{if(t.isConnected){delete t.dataset.armed;t.textContent='×';t.removeAttribute('style')}},3000)}
  }
  else if(d.act)doAct(d.act,t,d);
}
async function doAct(a,t,d){
  const p=sel&&mode==='admin'&&findP(sel),c=p&&cur(p);
  try{switch(a){
    case'close':close();break;
    case'refresh':await reload();toast('עודכן');break;
    case'add':addSheet();break;
    case'renew':addSheet(sel);break;
    case'saveadd':{const n=bg.querySelector('#nn').value.trim(),ph=bg.querySelector('#np').value.trim(),err=bg.querySelector('#err');
      if(!n){err.textContent='צריך להזין שם.';err.hidden=false;return}
      if(ph.replace(/\D/g,'').length<9){err.textContent='מספר הטלפון קצר מדי. הזיני 10 ספרות.';err.hidden=false;return}
      const card=addSheet.make(null),nused=addSheet.used();
      const np=await act(async()=>{const pr=await q(sb.from('people').insert({name:n,phone:ph,gender:addSheet.gender()}).select().single());const cr=await q(sb.from('cards').insert(Object.assign(card,{person_id:pr.id})).select().single());await addOpening(cr.id,nused);return pr},'נוספה כרטיסייה ל'+esc(n.split(' ')[0]));
      sel=np.id;view='person';render();break}
    case'saverenew':{const nused=addSheet.used();await act(async()=>{const cr=await q(sb.from('cards').insert(addSheet.make(p.id)).select().single());await addOpening(cr.id,nused)},'כרטיסייה חדשה נפתחה');break}
    case'freeze':freezeSheet();break;
    case'dofreeze':{const nd=freezeSheet.days();if(!(nd>=1&&nd<=14)){const er=bg.querySelector('#ferr');er.textContent='אפשר להקפיא בין יום אחד ל־14 ימים.';er.hidden=false;return}
      await act(()=>q(sb.rpc('a_freeze',{p_card:c.id,p_reason:freezeSheet.reason(),p_days:nd,p_again:!!freezeSheet.again})),n=>'הכרטיסייה הוקפאה'+(n?' ו־'+n+' הרשמות בוטלו':''));break}
    case'unfreeze':await act(()=>q(sb.rpc('a_unfreeze',{p_card:c.id})),n=>'הופשרה. התוקף הוארך ב־'+n+' ימים');break;
    case'wa':waSheet();break;
    case'plink':linkSheet();break;
    case'editp':editSheet();break;
    case'saveedit':{const g=x=>bg.querySelector(x),err=g('#eerr'),n=g('#en').value.trim(),ph=g('#ep').value.trim(),ex=g('#ex').value,et=g('#et');
      if(!n){err.textContent='צריך להזין שם.';err.hidden=false;return}
      if(!ex){err.textContent='צריך לבחור תאריך תוקף.';err.hidden=false;return}
      const tot=et?Math.max(1,+et.value||c.total):c.total;
      if(et&&tot<c.used.length){err.textContent='כבר נוצלו '+c.used.length+' שיעורים, אי אפשר להגדיר פחות.';err.hidden=false;return}
      await act(async()=>{await q(sb.from('people').update({name:n,phone:ph,gender:g('#eg').value}).eq('id',p.id));await q(sb.from('cards').update({total:tot,expires:ex}).eq('id',c.id))},'הפרטים נשמרו');break}
    case'sendwk':weekSheet();break;
    case'addtmpl':tmplSheet();break;
    case'savetmpl':{const g=x=>bg.querySelector(x),err=g('#terr');let place=g('#tpl').value,newPlaces=null;
      if(place==='__new'){place=g('#tpn').value.trim();if(!place){err.textContent='כתבי את שם המקום החדש.';err.hidden=false;return}if(!S.places.includes(place))newPlaces=S.places.concat(place)}
      const unl=g('#tun').checked,v={name:g('#tnm').value.trim()||'יוגה',place,day:+g('#tdy').value,time:g('#ttm').value||'18:00',dur:Math.min(240,Math.max(15,+g('#tdu').value||60)),cap:unl?0:Math.max(1,+g('#tcp').value||12)};
      await act(async()=>{
        if(newPlaces)await q(sb.from('studio').update({places:newPlaces}).eq('id',1));
        if(d.id)return await q(sb.rpc('a_update_class',{p_id:d.id,p_day:v.day,p_time:v.time,p_name:v.name,p_dur:v.dur,p_cap:v.cap,p_place:v.place}));
        await q(sb.from('classes').insert({day:v.day,start_time:v.time,name:v.name,dur:v.dur,cap:v.cap,place:v.place}));return -1;
      },n=>n<0?'השיעור נוסף ללו״ז':'השיעור עודכן'+(n?'. '+n+' רשומות קיבלו הודעה':''));break}
    case'cancelses':{
      if(!t.dataset.armed){t.dataset.armed='1';t.textContent='לבטל? הרשומות יקבלו הודעה';return}
      const inst=INST[d.k];await act(()=>q(sb.rpc('a_cancel_session',{p_class:inst.c.id,p_date:inst.on})),'השיעור בוטל');break}
    case'addplace':{const el=document.getElementById('newplace'),v=el.value.trim();if(!v){el.focus();return}if(S.places.includes(v)){toast('המקום כבר קיים');return}
      await act(()=>q(sb.from('studio').update({places:S.places.concat(v)}).eq('id',1)),'המקום נוסף');break}
    case'usepl':{const v=(document.getElementById('plinkin').value||'').trim();const m=v.match(/[?&]t=([A-Za-z0-9]+)/)||v.match(/^([a-f0-9]{24,})$/);
      if(!m){toast('זה לא נראה כמו קישור אישי. העתיקו את כל הקישור מההודעה.');return}location.href=appUrl()+'?t='+m[1];break}
    case'backme':{const t=store.get(TOKEN_KEY);if(t){store.set(MODE_KEY,'p');await startP(t)}break}
    case'theme':{const t=isDark()?'light':'dark';store.set(THEME_KEY,t);applyTheme(t);render();break}
    case'tome':if(myTok){store.set(MODE_KEY,'p');await startP(myTok)}break;
    case'toadmin':await startAdmin();break;
    case'logout':await sb.auth.signOut();adminSess=false;myTok=null;store.set(MODE_KEY,null);mode='login';view='home';render();break;
    /* practitioner */
    case'notes':notesSheet();break;
    case'anotes':aNotesSheet();break;
    case'punfreeze':pUnfreezeSheet();break;
    case'dopunfreeze':await act(()=>q(sb.rpc('p_unfreeze',{p_token:token})),n=>'הכרטיסייה הופשרה. התוקף הוארך ב־'+n+' ימים');break;
    case'perm':try{const r=await Notification.requestPermission();toast(r==='granted'?'התראות הופעלו':'ההתראות לא הופעלו');close()}catch(e){toast('הדפדפן הזה לא תומך בהתראות')}break;
    case'testnote':sysNotify('בדיקת התראה','כך תיראה התזכורת שעה לפני השיעור.');close();break;
    case'doinstall':if(installEvt){installEvt.prompt();const r=await installEvt.userChoice;installEvt=null;render();if(r.outcome==='accepted')toast('YoGis הותקנה על מסך הבית')}break;
    case'pinstall':view='install';render();window.scrollTo(0,0);break;
    case'pback':view='p';render();break;
    case'forget':store.set(TOKEN_KEY,null);token=null;location.href=appUrl();break;
    case'showreq':bg.querySelector('#reqbox').hidden=false;t.hidden=true;bg.querySelector('#rr').focus();break;
    case'sendreq':{const txt=bg.querySelector('#rr').value.trim();if(txt.length<3){bg.querySelector('#rerr').hidden=false;return}
      await act(()=>q(sb.rpc('p_cancel',{p_token:token,p_session:getS(d.k).id,p_mode:'request',p_reason:txt})),'הבקשה נשלחה ל'+esc(S.studio.teacher));break}
    case'latecancel':await act(()=>q(sb.rpc('p_cancel',{p_token:token,p_session:getS(d.k).id,p_mode:'late'})),'ההרשמה בוטלה ונוקב שיעור');break;
    case'withdraw':await act(()=>q(sb.rpc('p_cancel',{p_token:token,p_session:getS(d.k).id,p_mode:'withdraw'})),'הבקשה נמשכה. נתראה בשיעור');break;
  }}catch(e){}
}
document.addEventListener('click',e=>{if(e.target.closest('.sheet-bg'))return;onClick(e)});
document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});

/* ---------- start ---------- */
async function startAdmin(){
  mode='loading';store.set(MODE_KEY,'admin');render();
  const {data}=await sb.auth.getSession();
  if(!data.session){mode='login';render();return}
  let ok=false;try{ok=await q(sb.rpc('is_admin'))}catch(e){}
  if(!ok){mode='noadmin';render();return}
  adminSess=true;try{myTok=await q(sb.rpc('a_my_token'))}catch(e){}
  mode='admin';view='home';await reload();
}
async function startP(tok){token=tok;store.set(TOKEN_KEY,tok);personalManifest(tok);mode='p';view='p';window.scrollTo(0,0);await reload()}
(async function boot(){
  const u=new URLSearchParams(location.search),ut=u.get('t'),saved=store.get(TOKEN_KEY),pref=store.get(MODE_KEY);
  render();
  setInterval(()=>{if(!bg&&mode==='p'&&document.visibilityState==='visible')reload()},60000);
  if(u.has('admin')||(pref==='admin'&&(!ut||ut===saved))){await startAdmin();return}
  token=ut||saved;
  if(token){if(ut)store.set(TOKEN_KEY,ut);store.set(MODE_KEY,'p');await startP(token);
    try{const {data}=await sb.auth.getSession();if(data.session&&await q(sb.rpc('is_admin'))){adminSess=true;render()}}catch(e){}}
  else await startAdmin();
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&!bg&&(mode==='p'||mode==='admin'))reload()});
})();
})();
