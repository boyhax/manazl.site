import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://api.manazl.site",
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyMDcyNzQwMCwiZXhwIjo0ODc2NDAxMDAwLCJyb2xlIjoiYW5vbiJ9.yQ-1J_L0WxGoeclgmzWGLGNLloWMiovTzaRucHbCcM4"
);
