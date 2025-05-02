// @ts-nocheck // لتجنب أخطاء TypeScript إذا كنت تستخدمين TypeScript مع sw.js
const CACHE_NAME = "exam-system-cache-v8";
const CACHE_EXPIRATION_TIME = 60 * 60 * 1000;

const urlsToCache = [
  "/",
  "/signin",
  "/signup",
  "/dashboard_student",
  "/dashboard_instructor",
  "/manifest.json",
  "/favicon.ico",
  "/logo2.png",
  "/apple-touch-icon.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
  "/_next/static/chunks/main-app-f2ab8f5a96aa974a9.js",
  "/_next/static/chunks/main-5488f16c6226a992.js",
  "/_next/static/chunks/framework-8286f7646cddd02b.js",
  "/_next/static/chunks/polyfills-42372ed13043180a.js",
  "/_next/static/chunks/webpack-b9124abce5844a78b.js",
  "/_next/static/css/layout.css",
  "/images/dashboard-bg.jpg",
];

self.addEventListener("install", (event) => {
  console.log("Service Worker installed");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching files");
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
  self.clients.claim();
});

const isCacheExpired = (cachedResponse) => {
  if (!cachedResponse) return true;
  const cachedDate = new Date(cachedResponse.headers.get("date"));
  const now = new Date();
  return now - cachedDate > CACHE_EXPIRATION_TIME;
};

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  if (
    urlsToCache.some((url) => requestUrl.pathname.includes(url)) ||
    requestUrl.pathname.startsWith("/_next/static/chunks/") ||
    requestUrl.pathname.startsWith("/_next/static/css/") ||
    requestUrl.pathname.startsWith("/images/")
  ) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((res) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, res.clone());
            return res;
          });
        });
      })
    );
  } else if (
    requestUrl.pathname.startsWith("/api/exams") ||
    requestUrl.pathname.startsWith("/api/labs") ||
    requestUrl.pathname.startsWith("/api/grades")
  ) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          return caches.match(event.request).then((response) => {
            if (response && !isCacheExpired(response)) {
              return response;
            }
            return new Response(
              JSON.stringify({ error: "غير متصل - لا توجد بيانات متاحة حاليًا" }),
              {
                headers: { "Content-Type": "application/json" },
              }
            );
          });
        })
    );
  } else if (
    requestUrl.pathname.startsWith("/dashboard_student") ||
    requestUrl.pathname.startsWith("/dashboard_instructor")
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });

        return cachedResponse || fetchPromise.catch(() => {
          return new Response(
            "<h1>غير متصل</h1><p>الصفحة غير متاحة حاليًا. آخر نسخة مخزنة غير متوفرة.</p>",
            {
              headers: { "Content-Type": "text/html" },
            }
          );
        });
      })
    );
  } else {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  }
});

// إعداد Firebase لـ FCM
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

self.addEventListener("push", (event) => {
  console.log("Push event received:", event);
  const data = event.data?.json() || { title: "New Notification", body: "You have a new notification!" };
  console.log("Push data:", data);

  const options = {
    body: data.body,
    icon: "/android-chrome-192x192.png",
    badge: "/android-chrome-192x192.png",
    sound: "/notification.mp3",
    vibrate: [200, 100, 200],
    data: {
      url: `/dashboard_student?notification_id=${data.id}`,
    },
    requireInteraction: true,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );

  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: "push-received" });
    });
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});