import "../globals.css";
import type { Metadata } from "next";
import '../tailwind.css';
import { Inter } from "next/font/google";
import AppShell from "./AppShell";
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ margin: 0, padding: 0 }}>
        <AppShell>{children}</AppShell>
        <Analytics />
<SpeedInsights />

      </body>
    </html>
  );
}
