import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_APP_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_APP_SUPABASE_ANON_KEY as string;

// const local_url = "http://127.0.0.1:54321";
// const local_anon = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

const supabase = createClient(supabaseUrl, supabaseAnonKey, {});

export default supabase;

export const get_path_from_url = (url: string) => {
  return url.replace(get_project_url(), "");
};
export const get_project_url = () => {
  return supabaseUrl;
};
export function load() {}

var qq = supabase.from("listings").select("*").single();
export type SupabaseBuilder = typeof qq;
var filterbuilder = supabase.from("listings").select("*");
export type SupabaseFilterBuilder = typeof filterbuilder;
var querybuilder = supabase.from("listings");
export type SupabaseQuerybuilder = typeof querybuilder;
