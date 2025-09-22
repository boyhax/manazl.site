export const BOOKINGSTATES = ["pending", "confirmed", "cancelled", "completed"];
export type BookingStates = "pending" | "confirmed" | "cancelled" | "completed";
export interface Booking {
  title;
  approved: boolean;
  created_at: string;
  start_date: string | Date;
  end_date: string | Date;
  id: string;
  payment_id?: number;
  total_pay: string;
  updated_at: string;
  user_id: string;
  variant_id: string;
  state: BookingStates;
  cancel_reason?: string;
}
export interface NewBooking {
  variant_id: string;
  start_date: Date;
  end_date: Date;
}
