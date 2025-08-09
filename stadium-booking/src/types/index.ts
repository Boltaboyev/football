export type User = {
  id: string;
  firstName: string;
  lastName: string;
  teamName: string;
  phoneNumber: string;
  password: string;
};

export type Booking = {
  id: string;
  userId: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  createdAt: string; // ISO string
};

export type TimeSlot = {
  start: Date;
  end: Date;
  isBooked: boolean;
  booking?: Booking;
};