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

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll(cacheFiles);
    })
  );
});