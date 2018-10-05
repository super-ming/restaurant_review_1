const cacheFiles = [
  '/',
  '/index.html',
  '/restaurant.html',
  '/css/styles.css',
  '/css/styles_medium.css',
  '/css/styles_big.css',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  '/data/restaurants.json',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg'
];

const staticCacheName = 'v1';

//add event listener to install service worker and add required files to the cache
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll(cacheFiles);
    })
    .then(() => self.skipWaiting())
  );
});

//add event listener activate service worker and remove unwanted cache
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName != staticCacheName;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// clone the request as response is a stream. Need both the browser and
// cache to consume the response, so need two streams
/*self.addEventListener('fetch', e => {
  console.log("fetching now!");
  e.respondWith(
    caches.match(e.request).then(response => {
      if (response) {
        console.log(e.request, "found in cache");
        return response;
      } else {
        console.log(e.request, "not found in cache, now fetching");
        return fetch(e.response)
        .then(response => {
          const clonedRes = response.clone();
          caches.open(staticCacheName).then(cache => {
            cache.put(e.request, clonedRes);
          });
          return response;
        })
        .catch(err => console.log("not working", err)
        );
      }
    })
  );
});*/

self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(response => {
      if (response) {
        return response;
      } else {
        return fetch(e.response).then(response => {
          const clonedResponse = response.clone();
          caches.open(staticCacheName).then(cache => {
              cache.put(e.request, clonedResponse);
          });
          return response;
        });
      }
    }).catch(err => caches.match(e.request).then(response => response))
  );
});
