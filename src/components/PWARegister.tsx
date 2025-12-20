"use client";
import { useEffect, useState } from "react";
import PWASnackbar from "./PWASnackbar";

export default function PWARegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [swReg, setSwReg] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { updateViaCache: "none" })
        .then((reg) => {
          setSwReg(reg);
          if (reg.waiting) setShowUpdate(true);

          reg.addEventListener("updatefound", () => {
            const worker = reg.installing;
            if (!worker) return;
            worker.addEventListener("statechange", () => {
              if (
                worker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                setShowUpdate(true);
              }
            });
          });
        });
    }

    const beforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener("beforeinstallprompt", beforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstall);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const applyUpdate = () => {
    if (!swReg?.waiting) return;
    swReg.waiting.postMessage({ type: "SKIP_WAITING" });
    navigator.serviceWorker.addEventListener("controllerchange", () =>
      window.location.reload()
    );
  };

  const enableThankYouNotification = async () => {
    if (localStorage.getItem("install_thanked")) return;

    const perm = await Notification.requestPermission();
    if (perm !== "granted") return;

    const reg = await navigator.serviceWorker.ready;
    reg.active?.postMessage({ type: "THANK_INSTALL" });

    localStorage.setItem("install_thanked", "1");
  };

  // Trigger thank-you after install
  useEffect(() => {
    window.addEventListener("appinstalled", enableThankYouNotification);
    return () =>
      window.removeEventListener("appinstalled", enableThankYouNotification);
  }, []);

  return (
    <>
      {showInstall && (
        <PWASnackbar
          type="install"
          onAction={installApp}
          onClose={() => setShowInstall(false)}
        />
      )}

      {showUpdate && (
        <PWASnackbar
          type="update"
          onAction={applyUpdate}
          onClose={() => setShowUpdate(false)}
        />
      )}
    </>
  );
}
