import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  type: string;
}

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ user: User }>('/api/ram/auth/me')
      .then(data => setUser(data.user))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, error };
}
