/* ================= EVENTS: workshops (live), courses (soon), retreats (design preview) ================= */
let EV={tab:'workshop',sel:null,edit:null,rtab:'list',rscreen:null,rstep:1,rbtab:'details',regTab:'registered',pub:null,pubDone:null,pevents:[]};
const EVST={draft:['טיוטה','expired'],published:['פורסם','active'],closed:['ההרשמה סגורה','soon'],cancelled:['בוטל','expired']};
const evUrl=e=>appUrl()+S.studio.slug+'/e/'+e.slug;
const dtLong=ts=>{const d=new Date(ts);return 'יום '+DAYS[d.getDay()]+', '+d.getDate()+'.'+(d.getMonth()+1)+'.'+d.getFullYear()+' · '+hm(ts)};
const evPriceNow=e=>e.early_price!=null&&e.early_until&&today()<=parseD(e.early_until)?e.early_price:e.price;
const I2={
 cal:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/></svg>',
 pin:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
 user:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/></svg>',
 seat:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5M16 4.5a3.5 3.5 0 0 1 0 7M18.5 14.8c1.6.8 2.6 2.6 3 5.2"/></svg>',
 share:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"/></svg>',
 img:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-9 9"/></svg>'
};

/* ---------- loading ---------- */
async function evLoadAdmin(){
  try{
    const ev=await q(sb.from('events').select('*').eq('studio_id',SID).order('starts_at',{ascending:false}));
    const ids=ev.map(e=>e.id);
    const rg=ids.length?await q(sb.from('event_regs').select('*').in('event_id',ids).order('created_at')):[];
    S.events=ev.map(e=>Object.assign(e,{regs:rg.filter(r=>r.event_id===e.id)}));
  }catch(e){S.events=S.events||[]}
}
async function evLoadP(){try{EV.pevents=await q(sb.rpc('p_events',{p_token:token}))||[]}catch(e){EV.pevents=[]}}
const evFind=id=>(S.events||[]).find(e=>e.id===id);
const regsOf=(e,st)=>e.regs.filter(r=>r.status===st);

/* ---------- admin: list ---------- */
function vEvents(){
  const tabs=[['workshop','סדנאות'],['course','קורסים'],['retreat','ריטריטים']];
  let body='';
  if(EV.tab==='workshop'){
    const all=(S.events||[]).filter(e=>e.kind==='workshop'),up=all.filter(e=>Date.parse(e.starts_at)>now()-DAY&&e.status!=='cancelled').sort((a,b)=>Date.parse(a.starts_at)-Date.parse(b.starts_at)),past=all.filter(e=>!up.includes(e));
    const card=e=>{const st=EVST[e.status],n=regsOf(e,'registered').length,w=regsOf(e,'waitlist').length,rev=regsOf(e,'registered').reduce((s,r)=>s+(r.price||0),0);
      return '<button class="evcard" data-ev="open" data-id="'+e.id+'">'+(e.image_url?'<span class="evthumb" style="background-image:url(\''+esc(e.image_url)+'\')"></span>':'<span class="evthumb ph">'+I2.img+'</span>')+
       '<span class="evinfo"><b>'+esc(e.title)+'</b><small>'+dtLong(Date.parse(e.starts_at))+(e.place?' · '+esc(e.place):'')+'</small>'+
       '<span class="evmeta"><i class="pill p-'+st[1]+'">'+st[0]+'</i><span>'+n+(e.capacity?' / '+e.capacity:'')+' נרשמו</span>'+(w?'<span>'+w+' בהמתנה</span>':'')+(rev?'<span>'+shekel(rev)+'</span>':'')+'</span></span></button>'};
    const can=S.studio.plan==='plus'||!all.some(e=>e.status!=='cancelled');
    body='<div class="evtop"><p class="lead" style="margin:0">סדנה עם עמוד הרשמה משלה, מקומות מוגבלים, רשימת המתנה ותזכורות.</p><button class="btn btn-primary" data-ev="new"'+(can?'':' data-locked="1"')+'>'+I.plus+'סדנה חדשה</button></div>'+
     (S.studio.plan!=='plus'?'<div class="note">בחבילה הנוכחית אפשר לפתוח סדנה אחת. סדנאות ללא הגבלה, קורסים וריטריטים בחבילת <b>מתקדם+</b>.</div>':'')+
     (up.length?'<div class="list" style="gap:10px;margin-top:14px">'+up.map(card).join('')+'</div>':'<div class="empty">עדיין אין סדנאות קרובות.<br>לוחצים על "סדנה חדשה" כדי להתחיל.</div>')+
     (past.length?'<h2>אירועים שעברו ומבוטלים</h2><div class="list" style="gap:10px">'+past.map(card).join('')+'</div>':'');
  }else if(EV.tab==='course'){
    body='<div class="card soonbox"><span class="soon-tag">בקרוב</span><h3>קורסים</h3><p class="lead">סדרת מפגשים בתאריכים קבועים, הרשמה לכל הסדרה.</p><ul class="pitch"><li>לוח מפגשים ונוכחות לכל מפגש</li><li>שיעור השלמה למי שהחסיר</li><li>הצטרפות באמצע במחיר יחסי</li><li>תנאי קדם ותעודת סיום אוטומטית</li><li>תשלום בכמה תשלומים</li></ul></div>';
  }else{
    const sc=[['builder','בניית ריטריט','פרטים, חדרים ומחירים, לו״ז, טופס, תשלומים ועלויות'],['dash','לוח הבקרה של הריטריט','תפוסת חדרים, תשלומים, תזונה, הגעה ורשימת משתתפים'],['public','עמוד הריטריט הציבורי','העמוד שמשתפים, כולל תהליך ההרשמה'],['mine','מסך המשתתף','מה שהמתרגל רואה אחרי ההרשמה']];
    body='<div class="banner" style="background:var(--lav-soft)"><div><b>תצוגת עיצוב</b><small>מסכי הריטריט מוצגים עם נתוני דוגמה כדי לעבוד על העיצוב. שום דבר כאן לא נשמר ולא נשלח.</small></div></div><div class="list" style="gap:10px;margin-top:12px">'+
     sc.map(x=>'<button class="row" data-ev="rscreen" data-s="'+x[0]+'"><span class="who"><b>'+x[1]+'</b><small>'+x[2]+'</small></span><span style="color:var(--muted)">'+I.back.replace('M9 6l6 6-6 6','M15 6l-6 6 6 6')+'</span></button>').join('')+'</div>';
  }
  return header()+'<h1>אירועים</h1><div class="seg seg3">'+tabs.map(t=>'<button data-ev="tab" data-t="'+t[0]+'" aria-pressed="'+(EV.tab===t[0])+'">'+t[1]+(t[0]==='course'?' <small class="soon-tag">בקרוב</small>':t[0]==='retreat'?' <small class="soon-tag">עיצוב</small>':'')+'</button>').join('')+'</div>'+body;
}

/* ---------- admin: event detail ---------- */
function vEvent(){
  const e=evFind(EV.sel);if(!e){view='events';return vEvents()}
  const st=EVST[e.status],reg=regsOf(e,'registered'),wl=regsOf(e,'waitlist'),cn=regsOf(e,'cancelled');
  const paid=reg.filter(r=>r.paid==='paid'||r.paid==='punch').length,rev=reg.reduce((s,r)=>s+(r.price||0),0),started=Date.parse(e.starts_at)<=now();
  const list={registered:reg,waitlist:wl,cancelled:cn}[EV.regTab]||reg;
  const PAID={unpaid:['לא שולם','expired'],paid:['שולם','active'],refunded:['הוחזר','soon'],punch:['ניקוב','active']};
  const rrow=r=>'<div class="regrow"><div class="who"><b>'+esc(r.name)+(r.person_id?' <span class="soon-tag">מתרגל/ת</span>':'')+'</b><small><a href="tel:'+esc(r.phone)+'" dir="ltr">'+esc(r.phone)+'</a>'+(r.email?' · <span dir="ltr">'+esc(r.email)+'</span>':'')+(r.price!=null?' · '+shekel(r.price):'')+(r.promoted_at?' · עבר מההמתנה':'')+'</small></div><div class="regact">'+
    (r.status==='registered'?'<button class="pill p-'+PAID[r.paid][1]+'" data-ev="paid" data-id="'+r.id+'">'+PAID[r.paid][0]+'</button>'+(started?'<button class="chip" data-ev="att" data-id="'+r.id+'" aria-pressed="'+r.attended+'">'+(r.attended?'הגיע/ה':'נוכחות')+'</button>':''):'')+
    (r.status==='waitlist'?'<button class="btn btn-soft btn-sm" data-ev="promote" data-id="'+r.id+'">העברה לנרשמים</button>':'')+
    '<button class="iconbtn sm" data-ev="regmore" data-id="'+r.id+'" aria-label="עוד">⋯</button></div></div>';
  return header()+'<button class="back" data-ev="back">'+I.back+'כל האירועים</button>'+
   (e.image_url?'<div class="evhero" style="background-image:url(\''+esc(e.image_url)+'\')"></div>':'')+
   '<div class="card-head" style="margin-top:8px"><div><h1 style="margin:0">'+esc(e.title)+'</h1><small class="lead">'+dtLong(Date.parse(e.starts_at))+(e.place?' · '+esc(e.place):'')+'</small></div><span class="pill p-'+st[1]+'">'+st[0]+'</span></div>'+
   '<div class="stats stats4"><div class="stat sage"><b>'+reg.length+(e.capacity?'<small>/'+e.capacity+'</small>':'')+'</b><span>נרשמו</span></div><div class="stat lav"><b>'+wl.length+'</b><span>בהמתנה</span></div><div class="stat"><b>'+paid+'</b><span>שילמו</span></div><div class="stat"><b>'+shekel(rev)+'</b><span>צפי הכנסה</span></div></div>'+
   (e.status==='draft'?'<div class="banner" style="background:var(--warn-soft)"><div><b>הסדנה עדיין טיוטה</b><small>עמוד ההרשמה לא פתוח לציבור עד שמפרסמים.</small></div><button class="btn btn-primary btn-sm" data-ev="status" data-s="published">פרסום</button></div>':
    '<div class="sharebox"><div class="msg" dir="ltr">'+esc(evUrl(e))+'</div><div class="sheet-actions" style="margin-top:8px"><button class="btn btn-primary" data-ev="share">'+I2.share+'שיתוף ב־WhatsApp</button><button class="btn btn-soft" data-ev="copy">העתקת קישור</button><a class="btn btn-soft" target="_blank" rel="noopener" href="'+esc(evUrl(e))+'">צפייה בעמוד</a></div></div>')+
   '<div class="sheet-actions" style="margin-top:12px"><button class="btn btn-soft" data-ev="edit">עריכת הסדנה</button>'+(reg.length?'<button class="btn btn-soft" data-ev="msgall">הודעה לנרשמים</button><button class="btn btn-soft" data-ev="csv">ייצוא לאקסל</button>':'')+
   (e.status==='published'?'<button class="btn btn-soft" data-ev="status" data-s="closed">סגירת ההרשמה</button>':e.status==='closed'?'<button class="btn btn-soft" data-ev="status" data-s="published">פתיחת ההרשמה מחדש</button>':'')+
   (e.status!=='cancelled'?'<button class="btn btn-soft" style="color:var(--bad)" data-ev="cancelev">ביטול הסדנה</button>':'')+'</div>'+
   '<div class="seg seg3" style="margin-top:18px">'+[['registered','נרשמו',reg.length],['waitlist','המתנה',wl.length],['cancelled','בוטלו',cn.length]].map(t=>'<button data-ev="regtab" data-t="'+t[0]+'" aria-pressed="'+(EV.regTab===t[0])+'">'+t[1]+' · '+t[2]+'</button>').join('')+'</div>'+
   '<div class="list reglist">'+(list.length?list.map(rrow).join(''):'<div class="empty">'+(EV.regTab==='registered'?'עדיין אין נרשמים. משתפים את הקישור כדי להתחיל.':'אין כאן אף אחד.')+'</div>')+'</div>';
}

/* ---------- admin: editor ---------- */
function slugify(s){const d=new Date();return 'w-'+d.getFullYear().toString().slice(2)+p2(d.getMonth()+1)+p2(d.getDate())+'-'+Math.random().toString(36).slice(2,6)}
function vEvEdit(){
  const e=EV.edit;if(!e){view='events';return vEvents()}
  const sd=new Date(Date.parse(e.starts_at)),ed=e.ends_at?new Date(Date.parse(e.ends_at)):null;
  const tog=(k,t,s)=>'<div class="switch"><div><b>'+t+'</b><small>'+s+'</small></div><input type="checkbox" class="tog" data-ef="'+k+'"'+(e[k]?' checked':'')+'></div>';
  return header()+'<button class="back" data-ev="'+(e.id?'open':'back')+'" data-id="'+(e.id||'')+'">'+I.back+(e.id?'חזרה לסדנה':'כל האירועים')+'</button><h1>'+(e.id?'עריכת סדנה':'סדנה חדשה')+'</h1>'+
   '<div class="card evform" style="box-shadow:none;border:1px solid var(--line)">'+
   '<div class="imgpick">'+(e.image_url?'<div class="evhero" style="background-image:url(\''+esc(e.image_url)+'\')"></div>':'<div class="evhero ph">'+I2.img+'<small>תמונת שער (לא חובה)</small></div>')+'<label class="btn btn-soft btn-sm">'+(e.image_url?'החלפת תמונה':'העלאת תמונה')+'<input type="file" id="evimg" accept="image/*" hidden></label>'+(e.image_url?'<button class="btn btn-soft btn-sm" data-ev="imgdel">הסרה</button>':'')+'</div>'+
   '<div class="field"><label for="ef-title">שם הסדנה</label><input id="ef-title" data-ef="title" maxlength="80" value="'+esc(e.title||'')+'" placeholder="לדוגמה: סדנת נשימה ומדיטציה"></div>'+
   '<div class="field"><label for="ef-sub">משפט קצר</label><input id="ef-sub" data-ef="subtitle" maxlength="140" value="'+esc(e.subtitle||'')+'" placeholder="מה מחכה למשתתפים, במשפט אחד"></div>'+
   '<div class="grid3"><div class="field"><label>תאריך</label><input type="date" data-ef="date" value="'+iso(sd.getTime())+'"></div><div class="field"><label>שעת התחלה</label><input type="time" data-ef="time" value="'+hm(sd.getTime())+'"></div><div class="field"><label>שעת סיום</label><input type="time" data-ef="etime" value="'+(ed?hm(ed.getTime()):'')+'"></div></div>'+
   '<div class="grid2"><div class="field"><label>מקום</label><input data-ef="place" list="evplaces" value="'+esc(e.place||'')+'" placeholder="'+esc(S.places[0]||'הסטודיו')+'"><datalist id="evplaces">'+S.places.map(p=>'<option value="'+esc(p)+'">').join('')+'</datalist></div><div class="field"><label>מנחה</label><input data-ef="teacher" value="'+esc(e.teacher||'')+'" placeholder="'+esc(S.studio.teacher)+'"></div></div>'+
   '<div class="field"><label>תיאור</label><textarea data-ef="description" rows="5" maxlength="4000" placeholder="מה נעשה בסדנה, למי היא מתאימה, מה להביא">'+esc(e.description||'')+'</textarea></div>'+
   '<h2>מקומות ומחיר</h2>'+
   '<div class="grid2"><div class="field"><label>מספר מקומות</label><input type="number" min="0" inputmode="numeric" data-ef="capacity" value="'+(e.capacity||'')+'" placeholder="ללא הגבלה"></div><div class="field"><label>מחיר (₪)</label><input type="number" min="0" inputmode="numeric" data-ef="price" value="'+(e.price!=null?e.price:'')+'" placeholder="חינם"></div></div>'+
   '<p class="lead" style="font-size:.82rem;margin:4px 0 0">כשהמקומות מתמלאים, נרשמים חדשים נכנסים לרשימת המתנה ועוברים אוטומטית כשמתפנה מקום.</p>'+
   '<div class="grid2"><div class="field"><label>מחיר מוקדם (₪)</label><input type="number" min="0" inputmode="numeric" data-ef="early_price" value="'+(e.early_price!=null?e.early_price:'')+'" placeholder="לא חובה"></div><div class="field"><label>עד תאריך</label><input type="date" data-ef="early_until" value="'+(e.early_until||'')+'"></div></div>'+
   '<div class="field"><label>מחיר למתרגלים עם כרטיסייה פעילה (₪)</label><input type="number" min="0" inputmode="numeric" data-ef="member_price" value="'+(e.member_price!=null?e.member_price:'')+'" placeholder="לא חובה · מזוהים אוטומטית לפי הטלפון"></div>'+
   '<h2>טופס ההרשמה</h2><p class="lead" style="font-size:.85rem;margin-top:-4px">שם וטלפון תמיד נדרשים. אימייל אופציונלי.</p>'+
   tog('ask_health','הצהרת בריאות','המשתתף מאשר שהוא כשיר להשתתף ומעדכן על מגבלות')+tog('ask_emergency','איש קשר לחירום','שם וטלפון של מי לפנות אליו במקרה הצורך')+
   '<div class="field"><label>שאלות נוספות</label><div class="qlist">'+(e.questions||[]).map((qq,i)=>'<div class="qrow"><input data-eq="'+i+'" value="'+esc(qq)+'" maxlength="120" placeholder="שאלה"><button class="iconbtn sm" data-ev="qdel" data-i="'+i+'" aria-label="הסרה">×</button></div>').join('')+'</div>'+((e.questions||[]).length<5?'<button class="btn btn-soft btn-sm" data-ev="qadd">'+I.plus+'הוספת שאלה</button>':'')+'</div>'+
   '<div class="field"><label>קישור לקבוצת WhatsApp של הסדנה</label><input data-ef="wa_group" dir="ltr" value="'+esc(e.wa_group||'')+'" placeholder="https://chat.whatsapp.com/…"><small class="lead" style="font-size:.8rem">יוצג לנרשמים במסך האישור.</small></div>'+
   '<div class="field"><label>כתובת העמוד</label><div class="slugin" dir="ltr"><span>/'+esc(S.studio.slug)+'/e/</span><input data-ef="slug" value="'+esc(e.slug)+'" maxlength="42" autocapitalize="off" spellcheck="false"></div></div>'+
   '<p id="everr" style="color:var(--bad);margin:10px 0 0" hidden></p>'+
   '<div class="sheet-actions" style="margin-top:16px">'+(e.status==='draft'||!e.id?'<button class="btn btn-primary" data-ev="save" data-pub="1">שמירה ופרסום</button><button class="btn btn-soft" data-ev="save">שמירה כטיוטה</button>':'<button class="btn btn-primary" data-ev="save">שמירת השינויים</button>')+'</div></div>';
}
function evCollect(){const e=EV.edit;
  document.querySelectorAll('[data-ef]').forEach(el=>{const k=el.dataset.ef;if(el.type==='checkbox')e[k]=el.checked;else e['_'+k]=el.value});
  document.querySelectorAll('[data-eq]').forEach(el=>{e.questions[+el.dataset.eq]=el.value});
  return e}
function evPayload(){const e=evCollect(),num=v=>v===''||v==null?null:Math.max(0,Math.round(+v));
  const title=(e._title||'').trim();if(title.length<2)throw new Error('צריך שם לסדנה');
  if(!e._date||!e._time)throw new Error('צריך תאריך ושעת התחלה');
  const st=new Date(e._date+'T'+e._time);let en=null;if(e._etime){en=new Date(e._date+'T'+e._etime);if(en<=st)en=new Date(en.getTime()+DAY)}
  const slug=(e._slug||'').toLowerCase().replace(/[^a-z0-9-]/g,'');if(!/^[a-z0-9][a-z0-9-]{1,40}[a-z0-9]$/.test(slug))throw new Error('כתובת העמוד: אותיות באנגלית, מספרים ומקף');
  const ep=num(e._early_price);if(ep!=null&&!e._early_until)throw new Error('למחיר המוקדם צריך תאריך סיום');
  return{studio_id:SID,kind:'workshop',title,subtitle:(e._subtitle||'').trim()||null,description:(e._description||'').trim()||null,image_url:e.image_url||null,
    teacher:(e._teacher||'').trim()||null,place:(e._place||'').trim()||null,starts_at:st.toISOString(),ends_at:en?en.toISOString():null,
    capacity:num(e._capacity)||0,price:num(e._price),early_price:ep,early_until:ep!=null?e._early_until:null,member_price:num(e._member_price),
    ask_health:!!e.ask_health,ask_emergency:!!e.ask_emergency,questions:(e.questions||[]).map(x=>(x||'').trim()).filter(Boolean).slice(0,5),wa_group:(e._wa_group||'').trim()||null,slug}}

/* ---------- admin: actions ---------- */
async function evAct(t){const d=t.dataset,a=d.ev;
  try{switch(a){
  case'tab':EV.tab=d.t;render();break;
  case'back':EV.sel=null;EV.edit=null;view='events';render();window.scrollTo(0,0);break;
  case'open':EV.sel=d.id;EV.edit=null;EV.regTab='registered';view='event';render();window.scrollTo(0,0);break;
  case'regtab':EV.regTab=d.t;render();break;
  case'new':if(d.locked){toast('בחבילה הנוכחית אפשר לפתוח סדנה אחת. אפשר לבקש שדרוג למתקדם+ בהגדרות.');break}
    {const s=new Date(today()+7*DAY);s.setHours(10,0,0,0);EV.edit={title:'',starts_at:s.toISOString(),ends_at:new Date(s.getTime()+2*H).toISOString(),capacity:12,price:null,ask_health:true,ask_emergency:false,questions:[],status:'draft',slug:slugify()}}
    view='evedit';render();window.scrollTo(0,0);break;
  case'edit':{const e=evFind(EV.sel);EV.edit=JSON.parse(JSON.stringify(e));view='evedit';render();window.scrollTo(0,0);break}
  case'qadd':evCollect();EV.edit.questions=(EV.edit.questions||[]).concat('');evRerender();break;
  case'qdel':evCollect();EV.edit.questions.splice(+d.i,1);evRerender();break;
  case'imgdel':evCollect();EV.edit.image_url=null;evRerender();break;
  case'save':{const er=document.getElementById('everr');er.hidden=true;let pl;try{pl=evPayload()}catch(x){er.textContent=x.message;er.hidden=false;return}
    if(d.pub)pl.status='published';else if(!EV.edit.id)pl.status='draft';
    const id=EV.edit.id;t.disabled=true;
    try{const r=await act(async()=>id?await q(sb.from('events').update(pl).eq('id',id).select().single()):await q(sb.from('events').insert(pl).select().single()),d.pub?'הסדנה פורסמה':'נשמר');
      await evLoadAdmin();EV.sel=r.id;EV.edit=null;view='event';render();window.scrollTo(0,0)}
    catch(x){t.disabled=false;if(/duplicate|unique/i.test(x.message||'')){er.textContent='הכתובת הזו כבר בשימוש באירוע אחר. אפשר לשנות אותה.';er.hidden=false}}break}
  case'status':{const e=evFind(EV.sel);await act(()=>q(sb.from('events').update({status:d.s}).eq('id',e.id)),{published:'ההרשמה פתוחה',closed:'ההרשמה נסגרה'}[d.s]);await evLoadAdmin();render();break}
  case'cancelev':{if(!t.dataset.armed){t.dataset.armed='1';t.textContent='לבטל את הסדנה? לחיצה נוספת לאישור';return}
    const e=evFind(EV.sel);await act(()=>q(sb.from('events').update({status:'cancelled'}).eq('id',e.id)),'הסדנה בוטלה. כדאי לעדכן את הנרשמים');await evLoadAdmin();render();break}
  case'share':{const e=evFind(EV.sel);const txt=e.title+'\n'+dtLong(Date.parse(e.starts_at))+(e.place?' · '+e.place:'')+(e.subtitle?'\n'+e.subtitle:'')+'\n\nלפרטים והרשמה:\n'+evUrl(e);window.open('https://wa.me/?text='+encodeURIComponent(txt),'_blank');break}
  case'copy':{const e=evFind(EV.sel);try{await navigator.clipboard.writeText(evUrl(e));toast('הקישור הועתק')}catch(x){toast('לא הצלחנו להעתיק')}break}
  case'paid':{const e=evFind(EV.sel),r=e.regs.find(x=>x.id===d.id);const nx={unpaid:'paid',paid:'refunded',refunded:'unpaid',punch:'unpaid'}[r.paid];
    await q(sb.from('event_regs').update({paid:nx}).eq('id',r.id));r.paid=nx;render();break}
  case'att':{const e=evFind(EV.sel),r=e.regs.find(x=>x.id===d.id);await q(sb.from('event_regs').update({attended:!r.attended}).eq('id',r.id));r.attended=!r.attended;render();break}
  case'promote':{const e=evFind(EV.sel);await act(()=>q(sb.from('event_regs').update({status:'registered',promoted_at:new Date().toISOString()}).eq('id',d.id)),'עבר/ה לרשימת הנרשמים');await evLoadAdmin();render();break}
  case'regmore':{const e=evFind(EV.sel),r=e.regs.find(x=>x.id===d.id);const ans=r.answers||{};
    sheet('<h3>'+esc(r.name)+'</h3><p class="lead"><a href="tel:'+esc(r.phone)+'" dir="ltr">'+esc(r.phone)+'</a>'+(r.email?' · <span dir="ltr">'+esc(r.email)+'</span>':'')+'<br>נרשם/ה ב־'+fmt(Date.parse(r.created_at))+' '+hm(Date.parse(r.created_at))+(r.price!=null?' · מחיר '+shekel(r.price):'')+'</p>'+
     (e.ask_health?'<div class="note">הצהרת בריאות: '+(r.health_ok?'אושרה':'לא אושרה')+'</div>':'')+
     (Object.keys(ans).length?'<div class="anslist">'+Object.keys(ans).map(k=>'<div><small>'+esc(k)+'</small><b>'+esc(ans[k]||'—')+'</b></div>').join('')+'</div>':'')+
     '<div class="sheet-actions"><a class="btn btn-soft" target="_blank" rel="noopener" href="https://wa.me/972'+esc(r.phone.replace(/\D/g,'').replace(/^0/,''))+'">WhatsApp</a>'+(r.status!=='cancelled'?'<button class="btn btn-soft" style="color:var(--bad)" data-ev="regcancel" data-id="'+r.id+'">ביטול ההרשמה</button>':'<button class="btn btn-soft" data-ev="regrestore" data-id="'+r.id+'">החזרה לרשימה</button>')+'<button class="btn btn-soft" data-act="close">סגירה</button></div>');break}
  case'regcancel':{const was=evFind(EV.sel).regs.find(x=>x.id===d.id).status;close();await act(()=>q(sb.from('event_regs').update({status:'cancelled'}).eq('id',d.id)),was==='registered'?'ההרשמה בוטלה. אם יש רשימת המתנה, הבא/ה בתור עבר/ה אוטומטית':'ההרשמה בוטלה');await evLoadAdmin();render();break}
  case'regrestore':{close();const e=evFind(EV.sel);const full=e.capacity&&regsOf(e,'registered').length>=e.capacity;await act(()=>q(sb.from('event_regs').update({status:full?'waitlist':'registered'}).eq('id',d.id)),full?'הוחזר/ה לרשימת ההמתנה (הסדנה מלאה)':'הוחזר/ה לרשימת הנרשמים');await evLoadAdmin();render();break}
  case'msgall':{const e=evFind(EV.sel),reg=regsOf(e,'registered');const def='היי, תזכורת ל'+e.title+' ב'+dtLong(Date.parse(e.starts_at))+(e.place?' · '+e.place:'')+'. מחכים לך!';
    sheet('<h3>הודעה לנרשמים</h3><div class="field"><label for="mtxt">נוסח ההודעה</label><textarea id="mtxt" rows="4">'+esc(def)+'</textarea></div><p class="lead" style="font-size:.85rem">לוחצים על כל שם כדי לפתוח WhatsApp עם ההודעה.</p><div class="chips" id="mlist">'+reg.map(r=>'<a class="chip" target="_blank" rel="noopener" data-ph="'+esc(r.phone.replace(/\D/g,'').replace(/^0/,''))+'" href="#">'+esc(r.name)+'</a>').join('')+'</div><div class="sheet-actions"><button class="btn btn-soft" data-act="close">סגירה</button></div>');
    bg.querySelectorAll('[data-ph]').forEach(x=>x.onclick=ev=>{ev.preventDefault();x.classList.add('sent');window.open('https://wa.me/972'+x.dataset.ph+'?text='+encodeURIComponent(bg.querySelector('#mtxt').value),'_blank')});break}
  case'csv':{const e=evFind(EV.sel);const qs=(e.questions||[]);const rows=[['שם','טלפון','אימייל','סטטוס','מחיר','תשלום','נוכחות','הצהרת בריאות','נרשם ב'].concat(qs)];
    e.regs.forEach(r=>rows.push([r.name,r.phone,r.email||'',{registered:'נרשם',waitlist:'המתנה',cancelled:'בוטל'}[r.status],r.price==null?'':r.price,{unpaid:'לא שולם',paid:'שולם',refunded:'הוחזר',punch:'ניקוב'}[r.paid],r.attended?'כן':'',r.health_ok?'כן':'',fmt(Date.parse(r.created_at))].concat(qs.map(k=>(r.answers||{})[k]||''))));
    const csv='﻿'+rows.map(r=>r.map(c=>'"'+String(c).replace(/"/g,'""')+'"').join(',')).join('\n');const a_=document.createElement('a');a_.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a_.download=e.slug+'.csv';a_.click();break}
  /* retreat design */
  case'rscreen':EV.rscreen=d.s;EV.rstep=1;view='rdesign';render();window.scrollTo(0,0);break;
  case'rback':EV.rscreen=null;view='events';EV.tab='retreat';render();window.scrollTo(0,0);break;
  case'rbtab':EV.rbtab=d.t;render();break;
  case'rstep':EV.rstep=+d.s;render();window.scrollTo(0,0);break;
  case'rdemo':toast('תצוגת עיצוב בלבד. הפעולה תופעל בשלב הבא');break;
  /* public page */
  case'pubreg':await pubSubmit(t);break;
  case'ics':pubIcs();break;
  case'pubopen':location.href=appUrl()+S.studio.slug+'/e/'+d.slug;break;
  }}catch(x){if(x&&x.message!=='readonly')toast(esc(errMsg(x)))}
}
function evRerender(){const y=window.scrollY;render();window.scrollTo(0,y)}
function evBind(){
  const im=document.getElementById('evimg');if(im)im.addEventListener('change',async ev=>{const f=ev.target.files&&ev.target.files[0];if(!f)return;evCollect();toast('מעלה תמונה…');
    try{const blob=await coverImage(f);const path=SID+'/ev-'+Date.now()+'.jpg';const up=await sb.storage.from('events').upload(path,blob,{contentType:'image/jpeg',upsert:true});if(up.error)throw up.error;
      EV.edit.image_url=sb.storage.from('events').getPublicUrl(path).data.publicUrl;evRerender();toast('התמונה עלתה')}catch(x){toast(esc(errMsg(x)))}});
  const pf=document.getElementById('pubf');if(pf)pf.addEventListener('submit',ev=>{ev.preventDefault();pubSubmit(pf.querySelector('[type=submit]'))});
}
async function coverImage(file){const url=URL.createObjectURL(file);try{const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=url});
  const W=1200,k=Math.min(1,W/img.width),c=document.createElement('canvas');c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);
  return await new Promise(r=>c.toBlob(r,'image/jpeg',.82))}finally{URL.revokeObjectURL(url)}}

/* ---------- practitioner: studio events ---------- */
function pEventsBlock(){const l=EV.pevents||[];if(!l.length)return'';
  return '<div class="eyebrow">סדנאות ואירועים</div><div class="list" style="gap:10px">'+l.map(e=>'<button class="evcard" data-ev="pubopen" data-slug="'+esc(e.slug)+'">'+(e.image?'<span class="evthumb" style="background-image:url(\''+esc(e.image)+'\')"></span>':'<span class="evthumb ph">'+I2.img+'</span>')+
   '<span class="evinfo"><b>'+esc(e.title)+'</b><small>'+dtLong(Date.parse(e.starts_at))+(e.place?' · '+esc(e.place):'')+'</small><span class="evmeta">'+(e.mine?'<i class="pill p-'+(e.mine==='registered'?'active':'soon')+'">'+(e.mine==='registered'?'נרשמת':'ברשימת המתנה')+'</i>':'')+(e.price_now!=null?'<span>'+shekel(e.price_now)+'</span>':'<span>ללא עלות</span>')+(e.left===0?'<span>מלא · רשימת המתנה</span>':e.left!=null?'<span>נותרו '+e.left+' מקומות</span>':'')+'</span></span></button>').join('')+'</div>'}

/* ---------- public event page ---------- */
const evRoute=(()=>{const m=location.pathname.toLowerCase().match(/^\/([a-z0-9][a-z0-9-]{1,28}[a-z0-9])\/e\/([a-z0-9][a-z0-9-]{1,40}[a-z0-9])\/?$/);return m?{studio:m[1],event:m[2]}:null})();
async function startPublicEvent(){mode='pubev';render();
  try{EV.pub=await q(sb.rpc('event_public',{p_studio:evRoute.studio,p_event:evRoute.event}))}catch(e){EV.pub=null}
  if(EV.pub&&EV.pub.studio){S.studio=Object.assign({},S.studio,{name:EV.pub.studio.name,teacher:EV.pub.studio.teacher,slug:EV.pub.studio.slug});applyBrand(brandOf(EV.pub.studio))}
  if(EV.pub&&EV.pub.event)try{document.title=EV.pub.event.title+' · '+(EV.pub.studio.name||'')}catch(e){}
  EV.prefill=null;const tk=store.get(TOKEN_KEY);if(tk)try{const v=await q(sb.rpc('p_view',{p_token:tk}));if(v&&v.studio&&v.studio.slug===evRoute.studio)EV.prefill={name:v.person.name,token:tk}}catch(e){}
  render()}
function vPublicEvent(){
  const P=EV.pub,st=P&&P.studio,e=P&&P.event;
  const head='<div class="top"><div class="brand">'+mark(40)+'<div style="min-width:0"><b>'+esc(appName())+'</b><small>'+esc(st?st.name:'')+'</small></div></div>'+themeBtn()+'</div>';
  if(!P)return head+'<p class="lead" style="margin-top:30px;text-align:center">טוען…</p>';
  if(!e)return head+'<h1>האירוע לא נמצא</h1><p class="lead">ייתכן שהקישור שגוי או שהאירוע עדיין לא פורסם.</p>';
  if(EV.pubDone)return head+pubDoneView(e);
  const t0=Date.parse(e.starts_at),early=e.early_price!=null&&e.early_until&&today()<=parseD(e.early_until);
  const priceTxt=e.price_now==null?'ללא עלות':shekel(e.price_now);
  return head+(e.image?'<div class="evhero big" style="background-image:url(\''+esc(e.image)+'\')"></div>':'')+
   '<h1 class="evtitle">'+esc(e.title)+'</h1>'+(e.subtitle?'<p class="lead" style="font-size:1.05rem">'+esc(e.subtitle)+'</p>':'')+
   (e.status==='cancelled'?'<div class="banner" style="background:var(--bad-soft)"><div><b>האירוע בוטל</b></div></div>':'')+
   '<div class="evfacts"><span>'+I2.cal+dtLong(t0)+(e.ends_at?'–'+hm(Date.parse(e.ends_at)):'')+'</span>'+(e.place?'<span>'+I2.pin+esc(e.place)+'</span>':'')+'<span>'+I2.user+esc(e.teacher||'')+'</span>'+
   (e.capacity?'<span>'+I2.seat+(e.left>0?'נותרו '+e.left+' מקומות':'הסדנה מלאה · אפשר להירשם לרשימת המתנה')+'</span>':'')+'</div>'+
   '<div class="pricebox"><b>'+priceTxt+'</b>'+(early?'<small>מחיר מוקדם עד '+fmt(parseD(e.early_until))+(e.price!=null?' · אחר כך '+shekel(e.price):'')+'</small>':'')+(e.member_price!=null?'<small>למתרגלים עם כרטיסייה פעילה: '+shekel(e.member_price)+' (מזוהים לפי הטלפון)</small>':'')+'</div>'+
   (e.description?'<div class="evdesc">'+esc(e.description)+'</div>':'')+
   (e.open?pubForm(e):'<div class="note">'+(e.status==='cancelled'?'האירוע בוטל.':t0<=now()?'האירוע כבר התקיים.':'ההרשמה לאירוע סגורה.')+'</div>')+
   '<div class="foot">'+esc(st.name)+(st.plan==='pro'||st.plan==='plus'?'':' · מופעל באמצעות YoGis')+'</div>';
}
function pubForm(e){const full=e.capacity&&e.left===0,pf=EV.prefill;
  return '<form id="pubf" class="card" style="box-shadow:none;border:1px solid var(--line);margin-top:18px"><h2 style="margin-top:0">'+(full?'הרשמה לרשימת ההמתנה':'הרשמה')+'</h2>'+
   '<div class="field"><label for="pn">שם מלא</label><input id="pn" required maxlength="80" autocomplete="name" value="'+esc(pf?pf.name:'')+'"></div>'+
   '<div class="field"><label for="pp">טלפון</label><input id="pp" required inputmode="tel" autocomplete="tel" dir="ltr" style="text-align:right" placeholder="050-0000000"></div>'+
   '<div class="field"><label for="pe">אימייל (לא חובה)</label><input id="pe" type="email" autocomplete="email" dir="ltr"></div>'+
   (e.questions||[]).map((qq,i)=>'<div class="field"><label for="pq'+i+'">'+esc(qq)+'</label><input id="pq'+i+'" data-pq="'+esc(qq)+'" maxlength="300"></div>').join('')+
   (e.ask_emergency?'<div class="grid2"><div class="field"><label for="pen">איש קשר לחירום</label><input id="pen" maxlength="60"></div><div class="field"><label for="pep">טלפון חירום</label><input id="pep" inputmode="tel" dir="ltr" style="text-align:right"></div></div>':'')+
   (e.ask_health?'<label class="checkline"><input type="checkbox" id="ph"> <span>אני מצהיר/ה שמצבי הבריאותי מאפשר השתתפות, ושעדכנתי את המנחה על כל מגבלה רלוונטית.</span></label>':'')+
   '<label class="checkline"><input type="checkbox" id="pc"> <span>קראתי ואני מסכים/ה לתנאי ההשתתפות ולמדיניות הביטול של הסטודיו.</span></label>'+
   '<p id="perr" style="color:var(--bad);margin:10px 0 0" hidden></p><button class="btn btn-primary full" type="submit" style="margin-top:14px">'+(full?'הצטרפות לרשימת ההמתנה':'הרשמה'+(e.price_now!=null?' · '+shekel(e.price_now):''))+'</button>'+
   (e.price_now!=null?'<p class="lead" style="font-size:.8rem;margin-top:8px;text-align:center">התשלום מתבצע מול הסטודיו. פרטים יישלחו אחרי ההרשמה.</p>':'')+'</form>'}
async function pubSubmit(btn){const e=EV.pub.event,g=id=>document.getElementById(id),er=g('perr');er.hidden=true;
  const ans={};document.querySelectorAll('[data-pq]').forEach(x=>{ans[x.dataset.pq]=x.value.trim()});
  if(e.ask_emergency){ans['איש קשר לחירום']=(g('pen').value||'').trim();ans['טלפון חירום']=(g('pep').value||'').trim()}
  btn.disabled=true;
  try{const r=await q(sb.rpc('event_register',{p_studio:evRoute.studio,p_event:evRoute.event,p_name:g('pn').value,p_phone:g('pp').value,p_email:g('pe').value||null,p_answers:ans,p_health:e.ask_health?g('ph').checked:true,p_consent:g('pc').checked,p_token:EV.prefill?EV.prefill.token:null}));
    EV.pubDone=Object.assign({name:g('pn').value.trim()},r);render();window.scrollTo(0,0)}
  catch(x){er.textContent=errMsg(x);er.hidden=false;btn.disabled=false}}
function pubDoneView(e){const r=EV.pubDone,wl=r.status==='waitlist';
  const gcal='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(e.title)+'&dates='+gIso(e.starts_at)+'/'+gIso(e.ends_at||new Date(Date.parse(e.starts_at)+2*H).toISOString())+'&location='+encodeURIComponent(e.place||'');
  return '<div class="donebox"><div class="donecheck">'+I.check+'</div><h1>'+(r.already?'כבר נרשמת':wl?'נכנסת לרשימת ההמתנה':'נרשמת!')+'</h1>'+
   '<p class="lead">'+(r.already?'מספר הטלפון הזה כבר רשום לאירוע.':wl?'את/ה במקום '+(r.position||'')+' בתור. אם יתפנה מקום, '+esc(EV.pub.studio.teacher)+' תעדכן אותך.':esc(r.name)+', מחכים לך ב'+esc(e.title)+'.')+'</p>'+
   '<div class="evfacts" style="justify-content:center"><span>'+I2.cal+dtLong(Date.parse(e.starts_at))+'</span>'+(e.place?'<span>'+I2.pin+esc(e.place)+'</span>':'')+'</div>'+
   (r.price!=null&&!wl&&!r.already?'<div class="note">מחיר: <b>'+shekel(r.price)+'</b>'+(r.member?' (מחיר למתרגלים)':'')+'. התשלום מתבצע מול הסטודיו.</div>':'')+
   (!wl?'<div class="sheet-actions" style="justify-content:center;margin-top:14px"><button class="btn btn-soft" data-ev="ics">הוספה ליומן</button><a class="btn btn-soft" target="_blank" rel="noopener" href="'+gcal+'">Google Calendar</a></div>':'')+'</div>'}
const gIso=s=>new Date(s).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
function pubIcs(){const e=EV.pub.event;const end=e.ends_at||new Date(Date.parse(e.starts_at)+2*H).toISOString();
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//YoGis//HE','BEGIN:VEVENT','UID:'+e.id+'@yogis.co.il','DTSTAMP:'+gIso(new Date().toISOString()),'DTSTART:'+gIso(e.starts_at),'DTEND:'+gIso(end),'SUMMARY:'+e.title.replace(/[,;]/g,' '),'LOCATION:'+(e.place||'').replace(/[,;]/g,' '),'URL:'+location.href.split('?')[0],'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));a.download=e.slug+'.ics';a.click()}
