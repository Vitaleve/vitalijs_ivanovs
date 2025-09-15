const CACHE_NAME="bewerbung-v2";
const CORE_ASSETS=["./","./index.html","./styles.css","./script.js","./favicon.ico","./assets/favicon-16.png","./assets/favicon-32.png","./assets/apple-touch-icon.png","./assets/safari-pinned-tab.svg","./assets/android-chrome-192.png","./assets/android-chrome-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE_ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME&&caches.delete(k)))))});
self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
