import "../globals.css";
import type { Metadata } from "next";
import '../tailwind.css';
import { Inter } from "next/font/google";
import AppShell from "./AppShell";
import NotificationProvider from "./components/NotificationProvider";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ISKCON Radha Madan Mohan",
  description: "Welcome to ISKCON Hyderabad interactive portal.",
  icons: {
    apple: "https://iskconhyderabad.com/wp-content/uploads/2020/11/Iskcon-logo-black-300x300.png",
    other: [
      { rel: "icon", url: "https://iskconhyderabad.com/wp-content/uploads/2020/11/Iskcon-logo-black-100x100.png", sizes: "32x32" },
      { rel: "icon", url: "https://iskconhyderabad.com/wp-content/uploads/2020/11/Iskcon-logo-black-300x300.png", sizes: "192x192" },
    ],
  },
};

{/* <link rel="icon" href="https://iskconhyderabad.com/wp-content/uploads/2020/11/Iskcon-logo-black-100x100.png" sizes="32x32" />
<link rel="icon" href="https://iskconhyderabad.com/wp-content/uploads/2020/11/Iskcon-logo-black-300x300.png" sizes="192x192" />
<link rel="apple-touch-icon" href="https://iskconhyderabad.com/wp-content/uploads/2020/11/Iskcon-logo-black-300x300.png" /> */}

import RouteHandler from "./components/RouteHandler";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#FF9933" />
        <meta name="background-color" content="#FEF3C7" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/krishna-192.png" sizes="192x192" />
        <link rel="icon" href="/icons/krishna-512.png" sizes="512x512" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/krishna-192.png" />
        <meta name="description" content="Welcome to My Krishna Touch - ISKCON Hyderabad interactive portal." />
      </head>
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        <NotificationProvider>
          <AppShell>
            <RouteHandler />
            {children}
          </AppShell>
          <PWAInstallPrompt />
        </NotificationProvider>
        <Analytics />
        <SpeedInsights />
        {/* Install Prompt Component */}
        <div id="pwa-install-prompt" style={{ display: 'none', position: 'fixed', bottom: 24, right: 24, background: '#FF9933', color: '#fff', padding: 16, borderRadius: 8, zIndex: 9999 }}>
          <span>Add Krishna Touch to your device!</span>
          <button style={{ marginLeft: 12, background: '#fff', color: '#FF9933', border: 'none', padding: '4px 12px', borderRadius: 4 }} onClick={() => window.dispatchEvent(new Event('pwa-install'))}>Install</button>
        </div>
      </body>
    </html>
  );
}
