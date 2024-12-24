"use client";
import { createClient } from "@/app/lib/supabase/client";

const supabase = createClient();

export default supabase;

var qq = supabase.from("listings").select("*").single();
export type SupabaseBuilder = typeof qq;
var filterbuilder = supabase.from("listings").select("*");
export type SupabaseFilterBuilder = typeof filterbuilder;
var querybuilder = supabase.from("listings");
export type SupabaseQuerybuilder = typeof querybuilder;
