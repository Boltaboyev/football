import { api } from './client';
import type { Booking } from '../types';

const resource = '/bookings';

export async function getBookingsForToday(): Promise<Booking[]> {
  const { data } = await api.get<Booking[]>(resource);
  const today = new Date();
  return data.filter((b) => {
    const start = new Date(b.startTime);
    return (
      start.getFullYear() === today.getFullYear() &&
      start.getMonth() === today.getMonth() &&
      start.getDate() === today.getDate()
    );
  });
}

export async function createBooking(payload: Omit<Booking, 'id'>): Promise<Booking> {
  const { data } = await api.post<Booking>(resource, payload);
  return data;
}

export async function updateBooking(id: string, partial: Partial<Booking>): Promise<Booking> {
  const { data } = await api.put<Booking>(`${resource}/${id}`, partial);
  return data;
}

export async function deleteBooking(id: string): Promise<void> {
  await api.delete(`${resource}/${id}`);
}