import { createClient } from '@supabase/supabase-js'
const VITE_APP_google_key = 'AIzaSyALPQY1Ca6OBw7_oG6KC21X11bPKo_dPsw'

const VITE_APP_SUPABASE_URL = 'https://api.manazl.site'
const VITE_APP_SUPABASE_ANON_KEY =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyMDcyNzQwMCwiZXhwIjo0ODc2NDAxMDAwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.F9bDVuOspKc2QfaJeXlBHRbuxWIlTwDwcAjqegaVbQM'
const supabase = createClient(VITE_APP_SUPABASE_URL, VITE_APP_SUPABASE_ANON_KEY)

async function migrateUsers() {
  const { error, data } = await supabase.auth.admin.listUsers()
  if (error) throw Error(error.message)
  if (data) {
    console.log('data users :>> ', data)
  }
}

migrateUsers()
