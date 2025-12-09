// public/sw.js
const CACHE_NAME = 'emeypedia-cache-v1';
const RUNTIME_CACHE = 'emeypedia-runtime-v1';

const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/offline.html',
  //'/favicon.ico',
    '/assets/Emeyce_SS_LOGO.png',
    '/css/navbar.css'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const failed = [];

    await Promise.all(PRECACHE_URLS.map(async (url) => {
        try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res && res.ok) {
            await cache.put(url, res.clone());
            console.log('[SW] precached:', url);
        } else {
            console.warn('[SW] precache bad response:', url, res && res.status);
            failed.push({ url, status: res && res.status });
        }
        } catch (err) {
        console.warn('[SW] precache fetch error:', url, err && err.message ? err.message : err);
        failed.push({ url, error: String(err) });
        }
    }));

    if (failed.length > 0) {
      console.warn('[SW] precache encountered failures:', failed);
      // opcional: informar a las páginas clientes mediante postMessage
        const clients = await self.clients.matchAll();
        clients.forEach(c => c.postMessage({ type: 'PRECACHE_FAILED', detail: failed }));
    }

    return;
  })());
});

self.addEventListener('activate', (event) => {
    self.clients.claim();
    event.waitUntil(
    caches.keys().then((keys) => Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== RUNTIME_CACHE).map(k => caches.delete(k))
    ))
    );
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    if (url.origin !== location.origin) return;

    if (request.mode === 'navigate') {
    event.respondWith(
        fetch(request)
        .then((res) => {
            const copy = res.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
            return res;
        })
        .catch(async () => {
            const cached = await caches.match(request);
            if (cached) return cached;
            return caches.match('/offline.html');
        })
    );
    return;
    }

    if (request.destination === 'style' || request.destination === 'script' || request.destination === 'image') {
    event.respondWith(
        caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
            return res;
        }).catch(() => caches.match(request));
        })
    );
    return;
    }

    event.respondWith(
    fetch(request)
        .then((res) => {
        if (request.method === 'GET') {
            const copy = res.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
        }
        return res;
        })
        .catch(() => caches.match(request))
    );
});

self.addEventListener('message', (event) => {
    if (!event.data) return;
    if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    }
});
