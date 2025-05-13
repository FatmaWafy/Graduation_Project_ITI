"use client";

import { useEffect, useRef, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { fetchToken, messaging } from "../../firebase";
import { toast } from "sonner";

async function getNotificationPermissionAndToken() {
  if (!("Notification" in window)) {
    console.info("This browser does not support desktop notification");
    return null;
  }

  if (Notification.permission === "granted") {
    return await fetchToken();
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      return await fetchToken();
    }
  }

  console.log("Notification permission not granted.");
  return null;
}

const useFcmToken = () => {
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState<NotificationPermission | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const retryLoadToken = useRef(0);
  const isLoading = useRef(false);

  const loadToken = async () => {
    if (isLoading.current) return;

    isLoading.current = true;
    const token = await getNotificationPermissionAndToken();

    if (Notification.permission === "denied") {
      setNotificationPermissionStatus("denied");
      isLoading.current = false;
      return;
    }

    if (!token) {
      if (retryLoadToken.current >= 3) {
        console.error("Unable to load token after 3 retries");
        isLoading.current = false;
        return;
      }

      retryLoadToken.current += 1;
      console.error("Retrying token fetch...");
      isLoading.current = false;
      await loadToken();
      return;
    }

    setNotificationPermissionStatus(Notification.permission);
    setToken(token);
    isLoading.current = false;

    // إرسال الـ token للباك إند
    try {
      await fetch("/api/save-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, userId: "USER_ID" }), // استبدلي USER_ID بمعرف الطالب
      });
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  useEffect(() => {
    if ("Notification" in window) {
      loadToken();
    }
  }, []);

  useEffect(() => {
    const setupListener = async () => {
      if (!token) return;

      const m = await messaging();
      if (!m) return;

      const unsubscribe = onMessage(m, (payload) => {
        if (Notification.permission !== "granted") return;

        console.log("Foreground push notification received:", payload);
        const link = payload.fcmOptions?.link || payload.data?.link;

        // إضافة الإشعار لقائمة الإشعارات في الداشبورد
        const notification = {
          id: payload.data?.id || Date.now().toString(),
          title: payload.notification?.title || "New Notification",
          body: payload.notification?.body || "You have a new notification",
          link: link || "/dashboard_student",
          timestamp: new Date().toISOString(),
        };

        // إرسال الإشعار للواجهة عبر postMessage أو طريقة تانية
        navigator.serviceWorker.controller?.postMessage({
          type: "NEW_NOTIFICATION",
          notification,
        });

        // عرض توست لو عايز
        toast.info(`${notification.title}: ${notification.body}`, {
          action: link
            ? {
                label: "Visit",
                onClick: () => window.location.href = link,
              }
            : undefined,
        });
      });

      return unsubscribe;
    };

    let unsubscribe: (() => void) | null = null;
    setupListener().then((unsub) => {
      if (unsub) unsubscribe = unsub;
    });

    return () => unsubscribe?.();
  }, [token]);

  return { token, notificationPermissionStatus };
};

export default useFcmToken;