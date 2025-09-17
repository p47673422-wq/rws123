import { useEffect, useState, useCallback } from "react";

export function useLocalProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get mobile from localStorage
  const getMobile = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("mkt_mobile") || "";
    }
    return "";
  };

  // Fetch profile by mobile
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    const mobile = getMobile();
    if (!mobile) {
      setProfile(null);
      setLoading(false);
      // Do not set error here, allow UI to render quiz form
      return;
    }
    try {
      const res = await fetch(`/api/holyname/profile?mobile=${encodeURIComponent(mobile)}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setProfile(null);
      } else {
        setProfile(data.user);
      }
    } catch (e) {
      setError("Failed to fetch profile.");
      setProfile(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Save mobile to localStorage
  const setMobile = (mobile: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mkt_mobile", mobile);
      fetchProfile();
    }
  };

  return { profile, loading, error, refresh: fetchProfile, setMobile };
}
