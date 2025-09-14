import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

export interface Booking {
  id: string;
  placeName: string;
  date: string;
  strength: number;
  duration: string;
  resources: string[];
  comment?: string;
}

export function useMyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ bookings: Booking[] }>('/api/bookings/mine')
      .then(data => setBookings(data.bookings))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { bookings, loading, error };
}
