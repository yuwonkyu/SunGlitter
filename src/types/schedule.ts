export type ReservationStatus = "available" | "pending" | "booked";

export type ScheduleItem = {
  id: string;
  date: string;
  time: string;
  guestName: string;
  status: ReservationStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
};
