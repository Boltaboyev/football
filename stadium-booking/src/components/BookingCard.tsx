import { format } from 'date-fns';
import type { Booking, User } from '../types';
import Button from './Button';

type Props = {
  booking: Booking;
  userMap: Record<string, User>;
  isOwn: boolean;
  onEdit: (booking: Booking) => void;
  onDelete: (booking: Booking) => void;
};

export default function BookingCard({ booking, userMap, isOwn, onEdit, onDelete }: Props) {
  const start = new Date(booking.startTime);
  const end = new Date(booking.endTime);
  const who = userMap[booking.userId];

  return (
    <div className="card p-3 flex items-center justify-between">
      <div>
        <div className="font-semibold">{who ? who.teamName || `${who.firstName} ${who.lastName}` : '—'}</div>
        <div className="text-white/70 text-sm">{format(start, 'HH:mm')} — {format(end, 'HH:mm')}</div>
      </div>
      {isOwn && (
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => onEdit(booking)}>Tahrirlash</Button>
          <Button variant="ghost" onClick={() => onDelete(booking)}>O‘chirish</Button>
        </div>
      )}
    </div>
  );
}