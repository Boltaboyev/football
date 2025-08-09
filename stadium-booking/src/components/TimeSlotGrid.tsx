import { format } from 'date-fns';
import type { TimeSlot } from '../types';

type Props = {
  slots: TimeSlot[];
  onPickFree: (slot: TimeSlot) => void;
};

export default function TimeSlotGrid({ slots, onPickFree }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {slots.map((slot, idx) => (
        <button
          key={idx}
          onClick={() => !slot.isBooked && onPickFree(slot)}
          className={
            slot.isBooked
              ? 'card p-3 opacity-60 cursor-not-allowed'
              : 'card p-3 hover:bg-white/20'
          }
        >
          <div className="font-semibold">{format(slot.start, 'HH:mm')} — {format(slot.end, 'HH:mm')}</div>
          <div className="text-xs text-white/70">{slot.isBooked ? 'Band' : 'Bo‘sh'}</div>
        </button>
      ))}
    </div>
  );
}