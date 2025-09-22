import supabase from '../supabase'

export const BOOKINGSTATES = ['pending', 'confirmed', 'cancelled', 'completed']
export type BookingStates = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export interface Booking {
  title
  approved: boolean
  created_at: string
  start_date: string | Date
  end_date: string | Date
  id: string
  payment_id?: number
  total_pay: string
  updated_at: string
  user_id: string
  variant_id: string
  state: BookingStates
  cancel_reason?: string
}
interface NewBooking {
  variant_id: string
  start_date: Date
  end_date: Date
}
export async function create_booking(booking: NewBooking) {
  return await supabase
    .from('reservations')
    .insert({
      end_date: booking.end_date,
      start_date: booking.start_date,
      variant_id: booking.variant_id,
    })
    .select()
    .single()
}

export async function cancel_booking(id: string, cancel_reason?: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { data: null, error: { message: 'user not found' } }
  const { data: cancelRequest, error: cancelRequestError } = await supabase
    .from('reservation_cancel_request')
    .insert({ reservation_id: id, cancel_reason: cancel_reason || 'no reason' })
    .select()
    .single()

  return { data: cancelRequest, error: cancelRequestError }
}
export async function get_host_bookings() {
  const {
    data: {
      user: { id: userid },
    },
  } = await supabase.auth.getUser()

  return await supabase
    .from('reservations')
    .select(
      '*,variant:variants(*),user:profiles!inner(avatar_url,full_name,id)'
    )
    .neq('user_id', userid)
}
export async function get_self_bookings() {
  const {
    data: {
      user: { id: userid },
    },
  } = await supabase.auth.getUser()

  return await supabase
    .from('reservations')
    .select('*,variants(*)')
    .eq('user_id', userid)
}

export async function get_booking_sammary(id: string) {
  const { data: booking, error } = await supabase
    .from('reservations')
    .select('*,variants(*),payments')
    .eq('id', id)
    .single()
  const { data: listing, error: listError } = await supabase
    .from('listings')
    .select('title,thumbnail')
    .eq('id', booking.variant.listing_id)
  const { data: user, error: userError } = await supabase
    .from('profiles')
    .select('full_name,avatar_url')
    .eq('id', booking.user_id)
  return {
    data: { booking, listing, user },
    error: error || listError || userError,
  }
}
export async function get_booking_full_view(id: string) {
  const { data: sammary, error } = await get_booking_sammary(id)
}
export async function update_booking(id: string, data: any) {
  return await supabase
    .from('reservations')
    .update(data)
    .eq('id', id)
    .select()
    .single()
}
