import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { createBooking, deleteBooking, updateBooking } from '../api/bookings';
import { getUsersMap } from '../api/users';
import { useAuth } from '../context/AuthContext';
import { useTodayBookings } from '../hooks/useTodayBookings';
import { useEditWindow } from '../hooks/useEditWindow';
import { canPlaceInterval, generateSlots } from '../utils/time';
import type { Booking, TimeSlot } from '../types';
import Header from '../components/Header';
import Button from '../components/Button';
import TimeSlotGrid from '../components/TimeSlotGrid';
import BookingModal from '../components/BookingModal';
import EditBookingModal from '../components/EditBookingModal';
import BookingCard from '../components/BookingCard';
import uz from '../i18n/uz';

export default function Home() {
  const { user } = useAuth();
  const { bookings, loading, refresh } = useTodayBookings();
  const [userMap, setUserMap] = useState<Record<string, any>>({});
  const [bookingOpen, setBookingOpen] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; booking: Booking | null }>({ open: false, booking: null });

  const slots = useMemo(() => generateSlots(bookings), [bookings]);
  const freeSlots: TimeSlot[] = useMemo(() => slots.filter((s) => !s.isBooked), [slots]);

  const editable = useEditWindow(editModal.booking);

  const refreshUsers = async () => {
    const map = await getUsersMap();
    setUserMap(map);
  };

  const handleCreate = async (start: Date, end: Date) => {
    if (!user) return;
    if (!canPlaceInterval(bookings, start, end)) {
      toast.error(uz.errors.overlap);
      return;
    }
    await createBooking({
      userId: user.id,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      createdAt: new Date().toISOString(),
    });
    toast.success(uz.toast.bookingSuccess);
    await refresh();
    await refreshUsers();
  };

  const handleEdit = async (start: Date, end: Date) => {
    if (!user || !editModal.booking) return;
    const other = bookings.filter((b) => b.id !== editModal.booking!.id);
    if (!canPlaceInterval(other, start, end)) {
      toast.error(uz.errors.overlap);
      return;
    }
    await updateBooking(editModal.booking.id, { startTime: start.toISOString(), endTime: end.toISOString() });
    toast.success(uz.toast.bookingUpdated);
    setEditModal({ open: false, booking: null });
    await refresh();
    await refreshUsers();
  };

  const handleDelete = async (b: Booking) => {
    await deleteBooking(b.id);
    toast.success(uz.toast.bookingDeleted);
    await refresh();
    await refreshUsers();
  };

  useMemo(() => {
    void refreshUsers();
  }, []);

  return (
    <>
      <Header />
      <main className="container-page py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">{uz.home.title}</h1>
          <Button onClick={() => setBookingOpen(true)}>{uz.home.bookNow}</Button>
        </div>

        {loading ? (
          <div className="text-white/70">Yuklanmoqda...</div>
        ) : (
          <>
            <section className="space-y-2">
              <h2 className="text-lg font-semibold">{uz.home.freeSlots}</h2>
              <TimeSlotGrid slots={slots} onPickFree={() => setBookingOpen(true)} />
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-semibold">{uz.home.bookedSlots}</h2>
              <div className="space-y-2">
                {bookings.map((b) => (
                  <BookingCard
                    key={b.id}
                    booking={b}
                    userMap={userMap}
                    isOwn={user?.id === b.userId}
                    onEdit={(bk) => setEditModal({ open: true, booking: bk })}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </section>
          </>
        )}
      </main>

      {user && (
        <BookingModal
          open={bookingOpen}
          onClose={() => setBookingOpen(false)}
          user={user}
          freeSlots={freeSlots}
          onConfirm={handleCreate}
        />
      )}

      <EditBookingModal
        open={editModal.open}
        onClose={() => setEditModal({ open: false, booking: null })}
        booking={editModal.booking}
        freeSlots={freeSlots}
        onConfirm={handleEdit}
        editable={editable}
      />
    </>
  );
}