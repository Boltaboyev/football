import { addMinutes, areIntervalsOverlapping, isSameDay } from 'date-fns';
import type { Booking, TimeSlot } from '../types';

export const OPEN_HOUR = 8; // 08:00
export const CLOSE_HOUR = 24; // 24:00
export const SLOT_MINUTES = 60;
export const EDIT_WINDOW_MINUTES = 30;

export function getTodayRange(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), OPEN_HOUR, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), CLOSE_HOUR, 0, 0, 0);
  return { start, end };
}

export function generateSlots(bookings: Booking[]): TimeSlot[] {
  const { start, end } = getTodayRange();
  const slots: TimeSlot[] = [];
  let cursor = start;
  while (cursor < end) {
    const next = addMinutes(cursor, SLOT_MINUTES);
    const overlap = bookings.find((b) =>
      areIntervalsOverlapping(
        { start: cursor, end: next },
        { start: new Date(b.startTime), end: new Date(b.endTime) },
        { inclusive: false },
      ),
    );
    slots.push({ start: new Date(cursor), end: new Date(next), isBooked: Boolean(overlap), booking: overlap });
    cursor = next;
  }
  return slots;
}

export function isBookingEditable(booking: Booking): boolean {
  const created = new Date(booking.createdAt);
  const deadline = addMinutes(created, EDIT_WINDOW_MINUTES);
  const now = new Date();
  return now < deadline && isSameDay(created, now);
}

export function canPlaceInterval(bookings: Booking[], candidateStart: Date, candidateEnd: Date): boolean {
  return !bookings.some((b) =>
    areIntervalsOverlapping(
      { start: candidateStart, end: candidateEnd },
      { start: new Date(b.startTime), end: new Date(b.endTime) },
      { inclusive: false },
    ),
  );
}