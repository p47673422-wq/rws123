
"use client";

import React, { useEffect } from "react";

interface NotificationProviderProps {
  children: React.ReactNode;
}

export default function NotificationProvider({ children }: NotificationProviderProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    }
    // Listen for notification clicks
    navigator.serviceWorker?.addEventListener("notificationclick", (event) => {
      const notification = (event as any).notification;
      notification.close();
      if ((event as any).action === "view") {
        const data = notification.data as { url?: string } | undefined;
        window.location.href = data?.url || "/";
      }
    });
  }, []);
  return <>{children}</>;
}
