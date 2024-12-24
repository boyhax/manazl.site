import { createClient } from 'npm:@supabase/supabase-js@2'



interface Booking {
  id: string
  user_id: string
  variant_id: string,
  startDate:string
}
interface WebhookPayload {
  type: 'INSERT'
  table: string
  record: Booking
  schema: 'public'
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req) => {
  const payload: WebhookPayload = await req.json()

  const { data:user_id ,error} = await supabase.rpc('get_variant_owner',[payload.record.variant_id])
  const { data:a } = await supabase.from('notifications').insert({
    title:'Manazl New Booking',
    body:'New Booking for Your Host.',
    user_id,
    url:'https://manazl-web.vercel.app/host/bookings'
  })

  return new Response('notiifcation added')
})

