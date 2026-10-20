// Per-studio web app manifest. Studios on the advanced plan with branding get their own
// installable app (name + icon); everyone else gets the standard YoGis manifest.
const SB='https://zyleeqmcixyhvuapneeo.supabase.co';
const KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5bGVlcW1jaXh5aHZ1YXBuZWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MzAwMzIsImV4cCI6MjEwNzMwNjAzMn0.WDYGqmy9cnp8nRYyr5ZkVxWcR-pI8o8TqDq-V1cJRlA';
const BASE={name:'YoGis',short_name:'YoGis',description:'כרטיסיות ולו״ז שיעורי יוגה',lang:'he',dir:'rtl',start_url:'/',scope:'/',display:'standalone',
  background_color:'#F7F3EC',theme_color:'#F7F3EC',id:'/?app=yogis',
  icons:[{src:'/icon-192.png',sizes:'192x192',type:'image/png'},{src:'/icon-512.png',sizes:'512x512',type:'image/png'},{src:'/icon-maskable.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]};
const out=(m,ttl)=>new Response(JSON.stringify(m),{headers:{'content-type':'application/manifest+json; charset=utf-8','cache-control':'public, max-age='+ttl}});
export async function onRequest({params}){
  const slug=String(params.slug||'').toLowerCase().replace(/\.webmanifest$/,'');
  if(!/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(slug))return out(BASE,3600);
  let st=null;
  try{const r=await fetch(SB+'/rest/v1/rpc/studio_public',{method:'POST',headers:{apikey:KEY,authorization:'Bearer '+KEY,'content-type':'application/json'},body:JSON.stringify({p_slug:slug})});
    if(r.ok)st=await r.json()}catch(e){}
  const b=st&&st.plan==='pro'&&st.brand?st.brand:null;
  if(!b||!(b.icons&&b.icons.i512))return out(BASE,300);
  const name=(b.app_name||st.name||'YoGis').slice(0,40);
  return out({name,short_name:name.slice(0,12),description:st.name,lang:'he',dir:'rtl',start_url:'/'+slug,scope:'/'+slug,display:'standalone',
    background_color:'#F7F3EC',theme_color:b.color||'#F7F3EC',id:'/'+slug+'?app=yogis',
    icons:[b.icons.i192&&{src:b.icons.i192,sizes:'192x192',type:'image/png'},{src:b.icons.i512,sizes:'512x512',type:'image/png'},b.icons.mask&&{src:b.icons.mask,sizes:'512x512',type:'image/png',purpose:'maskable'}].filter(Boolean)},300);
}
