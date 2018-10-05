//Used https://matthewcranford.com/restaurant-reviews-app-walkthrough-part-4-service-workers/
//and https://www.youtube.com/watch?v=92dtrNU1GQc for help with service worker.

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

//add event listener to activate service worker and remove unwanted cache
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
// cache to consume the response, so need two streams.
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request).then(response => {
      //if items already in cache, use cache. Otherwise, fetch items and store in cache.
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
