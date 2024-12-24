import supabase from "../supabase";

export async function create_variant(data:NewVariant){
  return await supabase.from('variants').insert(data).select()

}
export async function update_variant(data:variantupdate){
  return await supabase.from('variants').update(data).eq('id',data.id).select()

}
export async function delete_variant(id:string){
  return await supabase.from('variants').delete().eq("id",id).select()

}
export interface Variant {

  title: string;
  description: string;
  id: string;
  rate: number;
  guests:number;
  active: boolean;
  slots: string[];

  thumbnail:string;
  listing_id:string
  rooms:number,
  beds:number
}
export type variantupdate = Partial<Variant>

export type NewVariant = Partial<Variant>