"use client";

import React, { useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PWAInstallPrompt() {
  useEffect(() => {
    let deferredPrompt: BeforeInstallPromptEvent | null = null;
    
    window.addEventListener('beforeinstallprompt', (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      const promptDiv = document.getElementById('pwa-install-prompt');
      if (promptDiv) promptDiv.style.display = 'block';
    });

    const handleInstall = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(({ outcome }) => {
          const promptDiv = document.getElementById('pwa-install-prompt');
          if (promptDiv) promptDiv.style.display = 'none';
          deferredPrompt = null;
        });
      }
    };

    window.addEventListener('pwa-install', handleInstall);
  }, []);
  return null;
}
