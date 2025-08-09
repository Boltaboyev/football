import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import type { Booking, TimeSlot } from '../types';
import Button from './Button';
import uz from '../i18n/uz';

type Props = {
  open: boolean;
  onClose: () => void;
  booking: Booking | null;
  freeSlots: TimeSlot[];
  onConfirm: (start: Date, end: Date) => Promise<void>;
  editable: boolean;
};

export default function EditBookingModal({ open, onClose, booking, freeSlots, onConfirm, editable }: Props) {
  const [startIdx, setStartIdx] = useState<number | null>(null);
  const [endIdx, setEndIdx] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => editable && startIdx !== null && endIdx !== null && (endIdx as number) > (startIdx as number), [editable, startIdx, endIdx]);

  if (!open || !booking) return null;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      const start = freeSlots[startIdx as number].start;
      const end = freeSlots[endIdx as number].end;
      await onConfirm(start, end);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
      <div className="card w-full max-w-md p-4">
        <div className="text-lg font-semibold mb-2">{uz.booking.edit}</div>
        {!editable && (
          <div className="text-sm text-red-300 mb-2">{uz.errors.editWindowPassed}</div>
        )}
        <div className="space-y-3">
          <div>
            <div className="label mb-1">{uz.booking.startTime}</div>
            <select className="input" value={startIdx ?? ''} onChange={(e) => setStartIdx(e.target.value === '' ? null : Number(e.target.value))} disabled={!editable}>
              <option value="">Tanlang</option>
              {freeSlots.map((s, i) => (
                <option key={i} value={i}>{format(s.start, 'HH:mm')}</option>
              ))}
            </select>
          </div>
          <div>
            <div className="label mb-1">{uz.booking.endTime}</div>
            <select className="input" value={endIdx ?? ''} onChange={(e) => setEndIdx(e.target.value === '' ? null : Number(e.target.value))} disabled={!editable || startIdx === null}>
              <option value="">Tanlang</option>
              {freeSlots.map((s, i) => (
                <option key={i} value={i} disabled={startIdx === null ? true : i <= (startIdx as number)}>{format(s.end, 'HH:mm')}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>{uz.booking.cancel}</Button>
            <Button disabled={!canSubmit || submitting} onClick={handleSubmit}>{uz.booking.confirm}</Button>
          </div>
        </div>
      </div>
    </div>
  );
}