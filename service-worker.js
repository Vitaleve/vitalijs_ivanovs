const CACHE_NAME="bewerbung-v3";
const CORE_ASSETS=["./","./index.html","./styles.7f3c2.css","./script.b91a4.js","./favicon.ico","./favicon-16.png","./favicon-32.png","./apple-touch-icon.png","./assets/android-chrome-192.png","./assets/android-chrome-512.png","./assets/maskable-512.png","./print.css"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(CORE_ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME&&caches.delete(k)))))});
self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)))});
