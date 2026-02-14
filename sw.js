const cacheName = 'subha-v1';
const assets = [
  './',
  './index.html',
  './manifest.json'
];

// تثبيت الخدمة وتخزين الملفات
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(cacheName).then(cache => {
      cache.addAll(assets);
    })
  );
});

// تشغيل التطبيق حتى بدون إنترنت
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(rec => {
      return rec || fetch(evt.request);
    })
  );
});
