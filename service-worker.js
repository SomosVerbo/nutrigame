// O jogo mudou para nutrianaluisarocha.com/nutrigame. Este SW só existe para tirar o jogo
// antigo do cache de quem já jogava e recarregar a aba na ponte (index.html) que leva o save.
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: "window" }))
      .then((abas) => abas.forEach((aba) => aba.navigate(aba.url)))
  );
});
