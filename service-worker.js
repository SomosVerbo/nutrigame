const CACHE_NAME = "nutrigame-cache-v40";
const CLINIC = ["floor","floor_rose","floor_blue","wall","wall_base","wall_window","wall_v","wall_h","plant","desk","bed",
  "chair","cabinet","cooler","rug","screen","poster","clock",
  "ivstand","cart","sidetable","curtain","locker","bench","trash",
  "vending","wheelchair","examtable","skeleton","sign","wallmonitor","elevator","stairs","extinguisher",
  "ana","camila","thiago","npc_roberto","npc_clara","npc_lucas"].map(n => "assets2d/clinic/" + n + ".png");
const ASSETS = [
  "./",
  "index.html",
  "style.css",
  "world3d.css",
  "app.js",
  "data.js",
  "game2d.js",
  "manifest.json",
  "images/logo.png",
  "images/logo-white.png",
  "images/folha.png",
  "images/icon-192.png",
  "images/icon-512.png",
  "images/apple-touch-icon.png",
  "fonts/Merienda-VariableFont_wght.ttf",
  ...CLINIC
];

// Instalação do Service Worker e cache dos assets
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativação e limpeza de caches antigos
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptador de rede (Estratégia Cache First com Fallback para Rede)
self.addEventListener("fetch", (e) => {
  e.respondWith(
    // ignoreSearch: trata "app.js?v=1.0.5" como "app.js" (cache-busting + offline)
    caches.match(e.request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request);
    })
  );
});
