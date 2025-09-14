import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

export interface RewardProgress {
  cordinatorId: string;
  points: number;
  level: number;
  totalBookings?: number;
  totalStrength?: number;
  lastRewardedAt?: string;
}

export function useRewards(userId: string) {
  const [progress, setProgress] = useState<RewardProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    apiFetch<{ progress: RewardProgress }>(`/api/rewards/progress?userId=${userId}`)
      .then(data => setProgress(data.progress))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [userId]);

  return { progress, loading, error };
}
