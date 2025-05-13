// @ts-nocheck // لتجنب أخطاء TypeScript إذا كنت تستخدم TypeScript مع sw.js

// --- كود PWA للتخزين المؤقت ---
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

// --- كود Firebase لإشعارات الدفع ---
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyDWANNVIpbojCSl-kS3OcWBCYF4-6Eolvk",
  authDomain: "examination-system-829b8.firebaseapp.com",
  projectId: "examination-system-829b8",
  storageBucket: "examination-system-829b8.firebasestorage.app",
  messagingSenderId: "1083210379552",
  appId: "1:1083210379552:web:5ee81f69baf6d04cabe745",
  measurementId: "G-33G2CPT88M"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

self.addEventListener("push", (event) => {
  console.log("Push event received:", event);
  let data;
  try {
    data = event.data?.json() || { title: "New Notification", body: "You have a new notification!" };
  } catch (e) {
    data = { title: "New Notification", body: "You have a new notification!" };
  }
  console.log("Push data:", data);

  const link = data.fcmOptions?.link || data.data?.link || `/dashboard_student?notification_id=${data.id || ''}`;

  const options = {
    body: data.notification?.body || data.body,
    icon: "/android-chrome-192x192.png",
    badge: "/android-chrome-192x192.png",
    sound: "/notification.mp3",
    vibrate: [200, 100, 200],
    data: { url: link },
    requireInteraction: true,
  };

  event.waitUntil(
    self.registration.showNotification(data.notification?.title || data.title, options)
  );

  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: "push-received" });
    });
  });
});

self.addEventListener("notificationclick", (event) => {
  console.log("Notification click received.");
  event.notification.close();

  const url = event.notification.data.url || "/dashboard_student";
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});