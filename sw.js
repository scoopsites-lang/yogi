const C='yogi-v42';const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  const html=e.request.mode==='navigate'||u.pathname.endsWith('.html')||u.pathname.endsWith('/');
  const req=html?new Request(e.request.url,{cache:'no-store',credentials:'same-origin'}):e.request;
  e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))))});
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(x){d={title:'YoGis',body:e.data?e.data.text():''}}
  e.waitUntil(self.registration.showNotification(d.title||'YoGis',{body:d.body||'',icon:'/icon-192.png',badge:'/icon-192.png',lang:'he',dir:'rtl',tag:d.tag,data:{url:d.url||'/'}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=(e.notification.data&&e.notification.data.url)||'/';
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{const c=l.find(x=>new URL(x.url).origin===location.origin);if(c){c.focus();try{c.postMessage({type:'refresh'})}catch(x){}return}return self.clients.openWindow(url)}))});
