"use client";
import { useEffect, useState } from 'react';

export default function PWARegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        console.log('Service worker registered', reg);
        setSwRegistration(reg);
        if (reg.waiting) setUpdateAvailable(true);
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') setUpdateAvailable(true);
            });
          }
        });
      }).catch(err => console.warn('SW register failed', err));
    }

    // Poll version endpoint every 60s to detect new deploys
    let stopped = false;
    const poll = async () => {
      try {
        const r = await fetch('/api/version');
        if (!r.ok) return;
        const json = await r.json();
        const remoteVersion = json.version;
        const local = window.localStorage.getItem('app_version');
        if (local && local !== remoteVersion) {
          // new deploy detected
          setUpdateAvailable(true);
        }
        window.localStorage.setItem('app_version', remoteVersion);
      } catch (e) {}
      if (!stopped) setTimeout(poll, 60000);
    };
    poll();

    const beforeInstallListener = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', beforeInstallListener);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallListener);
    };
  }, []);

  const promptInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    if (choice.outcome === 'accepted') setIsInstalled(true);
    setDeferredPrompt(null);
  };

  // call this to activate waiting worker (apply update)
  const applyUpdate = async () => {
    if (!swRegistration?.waiting) return;
    swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
  };

  // After install, show a thank-you notification and optionally subscribe for push
  useEffect(() => {
    const onInstalled = async () => {
      try {
        if (navigator.serviceWorker.controller) {
          // ask permission for notifications
          const perm = await Notification.requestPermission();
          if (perm === 'granted') {
            // show thank you notification
            navigator.serviceWorker.getRegistration().then(async reg => {
              reg?.showNotification('Thanks for installing', { body: 'Welcome to MyKrishnaTouch!', icon: '/icon.png' });
            });
          }
        }
      } catch (e) { console.warn(e); }
    };
    window.addEventListener('appinstalled', onInstalled);
    return () => window.removeEventListener('appinstalled', onInstalled);
  }, []);

  // If user accepts install prompt, auto-subscribe for push and send to backend
  useEffect(() => {
    const maybeSubscribe = async () => {
      if (!isInstalled) return;
      try {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
        const reg = await navigator.serviceWorker.ready;
        // ask for permission
        const perm = await Notification.requestPermission();
        if (perm !== 'granted') return;
        // fetch VAPID public key from env endpoint (you can inline or serve from server)
        const resp = await fetch('/api/push/vapid');
        if (!resp.ok) return;
        const { publicKey } = await resp.json();
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey)
        });
        // send subscription to server
        await fetch('/api/push/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sub) });
      } catch (e) { console.warn(e); }
    };
    maybeSubscribe();
  }, [isInstalled]);

  return (
    <div>
      {/* Top-right small install icon */}
      <div className="fixed top-4 right-4 z-50">
        {deferredPrompt && !isInstalled && (
          <button onClick={promptInstall} className="px-3 py-2 bg-pink-600 text-white rounded-full shadow">Install</button>
        )}
      </div>
      <div className="fixed bottom-6 right-6 z-50">
        {updateAvailable && (
          <button onClick={applyUpdate} className="px-3 py-2 bg-yellow-400 text-black rounded-lg mr-2">Update</button>
        )}
        {deferredPrompt && !isInstalled && (
          <button onClick={promptInstall} className="px-4 py-2 bg-pink-600 text-white rounded-lg">Install App</button>
        )}
      </div>
    </div>
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}