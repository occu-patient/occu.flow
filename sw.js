/* 班好喬 occu.flow — Service Worker（離線快取）。改版時請更新 VER。 */
const VER="occu-flow-v1.1.0-7",CORE=["./","index.html","privacy.html","terms.html","manifest.webmanifest","vendor/xlsx.full.min.js","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png"];
const FONT=/^https:\/\/fonts\.(googleapis|gstatic)\.com\//;
self.addEventListener("install",e=>{e.waitUntil(caches.open(VER).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VER).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
 // 頁面：先連網（拿最新版），失敗才用快取
 if(r.mode==="navigate"){e.respondWith(fetch(r).then(x=>{const k=x.clone();caches.open(VER).then(c=>c.put(r,k));return x}).catch(()=>caches.match(r).then(m=>m||caches.match("index.html"))));return}
 // 本站檔案與字型：先用快取，背景更新
 if(u.origin===location.origin||FONT.test(r.url)){e.respondWith(caches.match(r).then(m=>{const n=fetch(r).then(x=>{if(x&&(x.ok||x.type==="opaque")){const k=x.clone();caches.open(VER).then(c=>c.put(r,k))}return x}).catch(()=>m);return m||n}));return}
 // 其他（Google 登入、雲端硬碟、行事曆、瀏覽人數）一律直接連網，不快取
});
