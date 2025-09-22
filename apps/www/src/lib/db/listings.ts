import supabase from "src/lib/supabase";
import { Variant } from "./variants";
import { getuserid } from "./auth";
import { date } from "yup";
import { addDays } from "date-fns";
import queryString from "qs";

export const orderOptions = ["createdAt", "likes", "rating", "near", "costAsc"];
type OrderType = "createdAt" | "likes" | "rating" | "near" | "costAsc";

export function SearchParamsFromFilter(filter: listingfilter): string {
  return new URLSearchParams(filter as any).toString();
}

export function ListingFilterFromSearchParams(
  params: URLSearchParams
): listingfilter {
  var filter = queryString.parse(params.toString());
  console.log("p in filter from params :>> ", filter);
  return filter;
}

export async function createReport(report: {
  text: string;
  listing_id: string;
  reason: string;
}) {
  const { error, data } = await supabase
    .from("listings_reports")
    .upsert(report)
    .select();
  return { error, data };
}

export async function get_listing(id: string) {
  try {
    return await supabase
      .from("listings")
      .select(
        "id,place_name,categories,places,lat,lng,amenities,tags,title,images,cost,description,rating,user:listings_user_id_fkey!inner(avatar_url,full_name),likes"
      )
      .eq("id", id)
      .single();
  } catch (error) {
    console.trace(error);
  }
}
export async function create_listing(listing: NewListing) {
  try {
    const data = listing as any;

    data.thumbnail = listing.images[0];

    //images upload end

    const { data: inserted, error } = await supabase
      .from("listings")
      .insert(data)
      .select()
      .single();
    if (!error) {
      console.log("new listing created  :>> ", inserted);
    }

    return { data: inserted, error };
  } catch (error) {
    console.log("error from creating host :>> ", error);
    throw error;
  }
}

export async function update_listing(update: updateListing) {
  const values: updateListing = {
    amenities: update.amenities,
    categories: update.categories,
    cost: update.cost,
    description: update.description,
    images: update.images,
    lat: update.lat,
    lng: update.lng,
    meta: update.meta,
    tags: update.tags,
    thumbnail: update.images ? update.images[0] : "",
    title: update.title,
    place_name: update.place_name,
    type: update.type,
  };

  const userid = await getuserid();
  return supabase.from("listings").update(values).eq("user_id", userid);
}
export interface ListingPreviewProps {
  user: { full_name: string; avatar_url: string };
  description: string;
  thumbnail: string;
  id: string;
  title: string;
  rating: string;
  variants: any[];
  categories: string[];
  place_name: string;
  tags: string;
  lat: string;
  lng: string;
  distanceText: string;
  origin: string;
  short_id: string;
  places: string[];
  images: string[];
  featured: boolean;
  likes: any;
  reviews: any;
}
export type latlng = {
  lat: number | string;
  lng: number | string;
};
export interface listingfilter {
  amenities?: string[];
  type?: ListingType;
  categories?: string[];
  q?: string;
  limit?: number;
  startFrom?: number;
  page?: number;
  order?: OrderType;
  latlng?: latlng;
  view?: View;
  tags?: string[];
  host?: string;
  featured?: boolean;
  checkin?: string | Date;
  checkout?: string | Date;
  date?: null | { from: Date | string; to: Date | string };
}
export interface updateListing {
  id?: string;
  title?: string;
  description?: string;
  place_name?: string;
  lng?: number;
  lat?: number;
  meta?: ListingMeta;
  type?: string;
  categories?: string[];
  images?: string[];
  thumbnail?: string;
  cost?: number;
  tags?: string[];
  amenities?: string[];
}
export type NewListing = Pick<
  Listing,
  | "title"
  | "description"
  | "amenities"
  | "tags"
  | "place_name"
  | "lat"
  | "lng"
  | "type"
  | "thumbnail"
  | "cost"
  | "categories"
  | "images"
  | "address"
>;

export const listingsTypes = [
  "Apartment",
  "villa",
  "camp",
  "tents",
  "caravan",
  "room",
];
export type ListingType = (typeof listingsTypes)[number];
export interface Listing {
  id: string;
  address: { city: string; state: string; country: string };
  short_id: string;
  user_id: string;
  title: string;
  description: string;
  place_name: string;
  categories?: string[];
  lat: number;
  lng: number;
  meta: ListingMeta;
  type: ListingType;
  images: string[];
  thumbnail: string;
  cost?: number;
  tags: string[];
  amenities: string[];
  active: boolean;
  approved: boolean;
  likes: number;
  places: string[];
  rating: number;
  variants: Variant[];
}
export interface ListingMeta {
  guests?: number;
  pay_cycle?: "day" | "week" | "month" | "year" | "hour";
  beds?: number;
  rooms?: number;
  currency?: string;
  place_rules?: string;
  m2?: number;
  placepolicy?: string;
}
type View = {
  south: number | string;
  west: number | string;
  north: number | string;
  east: number | string;
};
export function FilterView(data: {
  east: string;
  west: string;
  north: string;
  south: string;
}) {
  return data;
}
//View
// max_lat: number;
//   max_lng: number;
//   min_lat: number;
//   min_lng: number;

export async function getListingRooms(
  id: string,
  start = new Date(),
  end = addDays(new Date(), 1)
) {
  console.log("start,end :>> ", start, end);
  const { data, error } = await supabase
    .rpc("get_listing_rooms", {
      p_listing_id: id,
      p_start: start,
      p_end: end,
    })
    .select();
  error && console.log(error.message);
  return { data, error };
}
