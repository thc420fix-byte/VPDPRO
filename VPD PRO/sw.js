const CACHE_VERSION = 'vpd-pro-v10';
const ASSETS = [
  './',
  './index.html',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
  './manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(c => c.addAll(ASSETS))
      .then(() => self.skipWaiting())
      .catch(err => console.error('SW install failed:', err))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('push', e => {
  let data;
  try {
    data = e.data ? e.data.json() : null;
  } catch (_) {
    data = null;
  }
  if (!data) data = { title: '💧 Water Time!', body: '給水の時間です' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: './icon-192.png',
      badge: './icon-192.png',
      tag: 'vpd-watering',
      renotify: true,
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      if (list.length) return list[0].focus();
      return clients.openWindow('./');
    })
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        if (!response || response.status !== 200) return response;
        if (response.type === 'opaque') return response;
        const clone = response.clone();
        caches.open(CACHE_VERSION).then(c => c.put(e.request, clone));
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
