"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function getRole() {
  return localStorage.getItem("role") || "store";
}

export default function RouteHandler() {
  const router = useRouter();

  useEffect(() => {
    const role = getRole();
    if (window.location.pathname === "/" || window.location.pathname === "/login") {
      if (role === "store") router.replace("/store");
      else if (role === "captain") router.replace("/captain");
      else if (role === "distributor") router.replace("/distributor");
    }

    // Service worker registration for PWA
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, [router]);

  return null;
}