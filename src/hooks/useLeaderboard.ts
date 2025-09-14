import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

export interface Leader {
  user: { id: string; name: string };
  totalBookings?: number;
  totalStrength?: number;
}

export function useLeaderboard(type: 'bookings' | 'strength') {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ leaders: Leader[] }>(`/api/leaderboard/${type}`)
      .then(data => setLeaders(data.leaders))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [type]);

  return { leaders, loading, error };
}
