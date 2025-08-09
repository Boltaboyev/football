import { useEffect, useState } from 'react';
import { getBookingsForToday } from '../api/bookings';
import type { Booking } from '../types';

export function useTodayBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const refresh = async () => {
    setLoading(true);
    const data = await getBookingsForToday();
    setBookings(
      data.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    );
    setLoading(false);
  };

  useEffect(() => {
    void refresh();
  }, []);

  return { bookings, loading, refresh, setBookings };
}