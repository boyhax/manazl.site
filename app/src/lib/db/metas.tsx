import supabase from "../supabase";
import { getCached, setCache } from "../utils/cacher";
function getTime(date1, date2) {
    return Math.abs(date1.getTime() - date2.getTime()) / 3600000;
  }
  
export const get_all_metas=async()=>await supabase.from('metas').select()
export const get_meta=async(meta:string)=>await supabase.from('metas').select().eq('key',meta).single()

