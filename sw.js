const CACHE_VERSION = 'canopy-v157';
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

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const req = e.request;

  // GET 以外（LM Studio への POST など）は一切傍受しない。
  // SW が POST を再発行するとボディ（messages）が欠落し API が壊れるため。
  if (req.method !== 'GET') return;

  // クロスオリジン（ローカル AI / 外部 API など）は傍受しない。
  // 同一オリジンの静的アセットだけをキャッシュ対象にする。
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // ナビゲーション（HTML）は network-first：
  // オンライン時は常に最新の index.html を取得し、オフライン時のみキャッシュへ。
  // cache-first だと CACHE_VERSION を上げ忘れた瞬間に古い版へ固定されるため。
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(response => {
        if (response && response.status === 200 && response.type !== 'opaque') {
          const clone = response.clone();
          caches.open(CACHE_VERSION).then(c => c.put(req, clone));
        }
        return response;
      }).catch(() => caches.match(req).then(c => c || caches.match('./index.html')))
    );
    return;
  }

  // それ以外（アイコン・manifest 等の静的アセット）は cache-first。
  // 取得失敗時に index.html を返すと MIME 不一致になるため、ここでは握りつぶさない。
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(response => {
        if (!response || response.status !== 200) return response;
        if (response.type === 'opaque') return response;
        const clone = response.clone();
        caches.open(CACHE_VERSION).then(c => c.put(req, clone));
        return response;
      });
    })
  );
});
