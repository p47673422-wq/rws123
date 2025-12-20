"use client";

import { useEffect, useState } from "react";
import PWASnackbar from "./PWASnackbar";

/* ---------------- HELPERS ---------------- */
const isInstalled = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as any).standalone === true ||
  localStorage.getItem("pwa_installed") === "1";

/* ---------------- COMPONENT ---------------- */
export default function PWARegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [swReg, setSwReg] = useState<ServiceWorkerRegistration | null>(null);

  /* ---------- SERVICE WORKER REGISTRATION ---------- */
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { updateViaCache: "none" })
      .then((reg) => {
        setSwReg(reg);

        // Show update ONLY if app is installed
        if (reg.waiting && isInstalled()) {
          setShowUpdate(true);
        }

        reg.addEventListener("updatefound", () => {
          const worker = reg.installing;
          if (!worker) return;

          worker.addEventListener("statechange", () => {
            if (
              worker.state === "installed" &&
              navigator.serviceWorker.controller &&
              isInstalled()
            ) {
              setShowUpdate(true);
            }
          });
        });
      });
  }, []);

  /* ---------- INSTALL PROMPT ---------- */
  useEffect(() => {
    const beforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
      setShowUpdate(false); // Install has priority
    };

    const onInstalled = () => {
      localStorage.setItem("pwa_installed", "1");
      setShowInstall(false);
    };

    window.addEventListener("beforeinstallprompt", beforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  /* ---------- INSTALL ACTION ---------- */
  const installApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  /* ---------- UPDATE ACTION ---------- */
  const applyUpdate = () => {
    if (!swReg?.waiting) return;
    swReg.waiting.postMessage({ type: "SKIP_WAITING" });
    navigator.serviceWorker.addEventListener("controllerchange", () =>
      window.location.reload()
    );
  };

  /* ---------- ONE-TIME THANK YOU NOTIFICATION ---------- */
  const sendThankYouNotification = async () => {
    if (localStorage.getItem("install_thanked")) return;

    const perm = await Notification.requestPermission();
    if (perm !== "granted") return;

    const reg = await navigator.serviceWorker.ready;
    reg.active?.postMessage({ type: "THANK_INSTALL" });

    localStorage.setItem("install_thanked", "1");
  };

  useEffect(() => {
    window.addEventListener("appinstalled", sendThankYouNotification);
    return () =>
      window.removeEventListener("appinstalled", sendThankYouNotification);
  }, []);

  /* ---------- RENDER ---------- */
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
