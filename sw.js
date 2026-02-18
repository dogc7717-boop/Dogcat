const cacheName = 'iskar-v2'; // قمت بتغيير النسخة للتحديث
const assets = [
  './',
  './index.html',
  './manifest.json',
  './Egypt.mp3',
  './Egypt_1.mp3',
  './Egypt_2.mp3',
  './Egypt_3.mp3',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&display=swap',
  'https://assets.mixkit.co/active_storage/sfx/3005/3005-preview.mp3'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res || fetch(e.request);
    })
  );
});
