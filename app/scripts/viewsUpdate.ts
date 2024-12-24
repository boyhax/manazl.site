import { createClient } from "@supabase/supabase-js";

const VITE_APP_SUPABASE_URL = "https://api.manazl.site";
const VITE_APP_SUPABASE_ANON_KEY = true
  ? "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyMDcyNzQwMCwiZXhwIjo0ODc2NDAxMDAwLCJyb2xlIjoiYW5vbiJ9.yQ-1J_L0WxGoeclgmzWGLGNLloWMiovTzaRucHbCcM4"
  : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyMDcyNzQwMCwiZXhwIjo0ODc2NDAxMDAwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.F9bDVuOspKc2QfaJeXlBHRbuxWIlTwDwcAjqegaVbQM";
const VITE_APP_google_key = "AIzaSyALPQY1Ca6OBw7_oG6KC21X11bPKo_dPsw";

const supabase = createClient(
  VITE_APP_SUPABASE_URL,
  VITE_APP_SUPABASE_ANON_KEY
);

async function start() {
  const res = await supabase
    .from("listings_view")
    .update({ title: "hero" })
    .eq("id", 7);
  console.log("res :>> ", res);
}

start();
