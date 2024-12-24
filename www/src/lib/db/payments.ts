import supabase from "../supabase";
import { Variant } from "./variants";

export async function create_variant(data:NewVariant){
  return await supabase.from('variants').insert(data).select()

}
export async function update_variant(data:variantupdate){
  return await supabase.from('variants').update(data).eq('id',data.id).select()

}
export async function delete_variant(id:string){
  return await supabase.from('variants').delete().eq("id",id).select()

}

export type variantupdate = Partial<Variant> &{id:string}

export type NewVariant =Omit<Variant,'id'>
