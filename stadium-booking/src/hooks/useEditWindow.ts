import { useEffect, useState } from 'react';
import type { Booking } from '../types';
import { isBookingEditable } from '../utils/time';

export function useEditWindow(booking: Booking | null) {
  const [editable, setEditable] = useState<boolean>(booking ? isBookingEditable(booking) : false);

  useEffect(() => {
    if (!booking) return;
    setEditable(isBookingEditable(booking));
    const id = setInterval(() => setEditable(isBookingEditable(booking)), 15000);
    return () => clearInterval(id);
  }, [booking]);

  return editable;
}