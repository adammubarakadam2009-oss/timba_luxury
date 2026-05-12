self.addEventListener('install', (event) => {
  console.log('TIMBA LUXURY Service Worker installed');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});