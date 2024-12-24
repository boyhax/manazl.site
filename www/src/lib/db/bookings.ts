"use server";

import { createClient } from "@/app/lib/supabase/server";
import { NewBooking } from "./bookings.types";

export async function create_booking(booking: NewBooking) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw Error("user_not_found");
  return await supabase
    .from("reservations")
    .insert({
      ...booking,
      user_id: user.id,
    })
    .select()
    .single();
}

export async function cancel_booking(id: string, cancel_reason?: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: null, error: { message: "user not found" } };
  const { data: cancelRequest, error: cancelRequestError } = await supabase
    .from("reservation_cancel_request")
    .insert({ reservation_id: id, cancel_reason: cancel_reason || "no reason" })
    .select()
    .single();

  return { data: cancelRequest, error: cancelRequestError };
}
export async function get_host_bookings() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw Error("user_not_found");
  return await supabase
    .from("reservations")
    .select(
      "*,variant:variants(*),user:profiles!inner(avatar_url,full_name,id)"
    )
    .neq("user_id", user.id);
}
export async function get_self_bookings() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw Error("user_not_found");
  return await supabase
    .from("reservations")
    .select("*,variants(*)")
    .eq("user_id", user.id);
}

export async function get_booking_sammary(id: string) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return await supabase
    .from("reservations")
    .select("*,variants(*),payments(count),user:profiles(full_name,avatar_url)")
    .eq("id", id)
    .single();
}
export async function get_booking_full_view(id: string) {
  const { data: sammary, error } = await get_booking_sammary(id);
}
export async function update_booking(id: string, data: any) {
  const supabase = createClient();

  return await supabase
    .from("reservations")
    .update(data)
    .eq("id", id)
    .select()
    .single();
}
