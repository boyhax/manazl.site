import {
  Listing,
  ListingPreviewProps,
  latlng,
  listingfilter,
} from "src/lib/db/listings";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import supabase, { SupabaseFilterBuilder } from "src/lib/supabase";
import { googleapi } from "src/App";

const searchRange = 30000;


interface Props {
  loading: boolean;
  query: Promise<{ data: null | any; error: { message: string } }>;
  error: any;
  data: ListingPreviewProps[];
  mapdata: ListingPreviewProps[];
  count: number;
  hasMore: boolean;
  filter: listingfilter;
  requiredResult: boolean;
  setfilter: (filter: listingfilter) => void;
  updatefilter: (filter: listingfilter) => void;
  updateDistanceTexts: (data: ListingPreviewProps[]) => void;
  getExtra;
}
const dt = (p: any) =>
  persist(devtools(p, { name: "searchState" }), { name: "searchstate" }) as any;
export const useSearch = create<Props>(
  dt((set, get) => ({
    loading: false,
    query: null,
    error: null,
    data: [],
    mapdata: [],
    count: 0,
    hasMore: false,
    filter: {},
    place: null,
    requiredResult: true,




    async updateDistanceTexts(data: ListingPreviewProps[]) {
      //function fetch bulk origin and distance values using google matrix api (single fetch is more costly)

      if (get()?.filter?.latlng && data?.length) {
        const { lat, lng } = get().place?.geometry?.location;
        const routes = await googleapi.importLibrary("routes");
        const service = new routes.DistanceMatrixService();
        service
          .getDistanceMatrix({
            destinations: [{ lat, lng }],
            origins: data.map((value) => ({
              lat: value.lat,
              lng: value.lng,
            })),
            travelMode: routes.TravelMode.DRIVING,
          })
          .then((result) => {
            console.log("distance result :>> ", result);
            const { destinationAddresses, originAddresses, rows } = result;
            let listings = data.map((listing, index) => {
              if (!originAddresses.length && originAddresses[index])
                return listing; //retun same if no result

              listing.distanceText =
                rows[index]?.elements[0]?.distance?.text || ""; //update distance text to result value

              listing.distanceText
                ? listing.distanceText + " to " + destinationAddresses[0]
                : ""; //add to origin text

              listing.origin = originAddresses[index]; //add origin value
              return listing;
            });
            let newddata = useSearch.getState().data.map((old) => {
              let newdata = listings.find((newl) => newl.id == old.id);
              return newdata || old; //if new available return the new
            });
            useSearch.setState({ data: newddata });
          });
      }
    },
    setfilter: (filter: listingfilter) => {
      set({ filter });
    },
    updatefilter: (filter: listingfilter) => {
      set({ ...get().filter, ...filter });
    },
  }))
);

export async function getNearbyListings(
  point: latlng,
  filter: listingfilter = {},
  select = "*"
) {
  const { lat, lng: long } = point;

  if (typeof lat != "number" || typeof long != "number")
    return { data: null, error: { message: "place latlng required" } };

  const query = supabase.rpc(
    "nearby_listings",
    {
      lat,
      long,
      radius: searchRange,
    },
    { count: "estimated" }
  );

  applyFilter(query, filter);

  const { from, to } = getPagination(filter.startFrom, filter.limit);
  query.range(from, to);
  query.select(select);

  return await query;
}
type View = {
  north: number | string;
  south: number | string;
  west: number | string;
  east: number | string;
};
export async function getViewListings(
  view: View,
  filter: listingfilter = {},
  select = "*"
) {
  //    North (N) → max_lat
  //    East (E) → max_long
  //    West (W) → min_long
  //    South (S) → min_lat
  let { north: min_lat, south: max_lat, west: min_lng, east: max_lng } = view;
  const query = supabase.rpc(
    "listings_in_view",
    {
      max_lat,
      max_lng,
      min_lat,
      min_lng,
    },
    { count: "estimated" }
  );
  applyFilter(query, filter);

  const { from, to } = getPagination(filter.startFrom, filter.limit);
  query.range(from, to);
  query.select(select);
  return await query;
}

const getPagination = (startfrom = 0, limit = 20) => {
  const from = startfrom;
  const to = startfrom + limit;
  return { from, to };
};


function applyFilter(query: SupabaseFilterBuilder, filter: listingfilter) {
  if (filter.categories) {
    query.overlaps("categories", filter.categories);
  }
  if (filter.type) {
    query.eq("type", filter.type);
  }
  if (filter.amenities) {
    query.overlaps("amenities", filter.amenities);
  }
  if (filter?.featured == true) {
    query.eq("featured", true);
  }
  if (filter.tags) {
    query.overlaps("tags", filter.tags);
  }
  if (filter.order) {
    switch (filter.order) {
      case "likes":
        query.order("likes", { ascending: false });
        break;
      case "createdAt":
        query.order("created_at", { ascending: false });
        break;
      case "costAsc":
        // query.order("cost", { nullsFirst: false, referencedTable: 'rooms.available' });
        break;
      case "rating":
        query.order("rating", { ascending: false, });
        break;
    }
  }
  if (filter.q) {
    query.ilike("fts", `%${filter.q}%`);
  }

  return query;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
function check_available(
  query,
  start = new Date(),
  end = addDays(new Date(), 1),
  key = "rooms.available"
) {
  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  function getDays(date1: Date, date2: Date): number {
    const oneDayInMs = 24 * 60 * 60 * 1000; // Hours * Minutes * Seconds * Milliseconds
    const differenceInTime = date2.getTime() - date1.getTime(); // Difference in milliseconds
    const differenceInDays = differenceInTime / oneDayInMs; // Convert milliseconds to days
    return Math.round(differenceInDays); // Rounding to nearest whole number
  }
  console.log('checking dates :>> ', formatDate(start), formatDate(end));
  return query
    .gte(`${key}.date`, formatDate(start))
    .lt(`${key}.date`, formatDate(end))
    .eq(`${key}.is_available`, true);
  // .eq(`${key}.count`, getDaysBetweenDates(start, end));
}
const select = `images,type,featured,address,title,likes,short_id,rating,id,description,likes!inner(count),user:profiles!inner(full_name,avatar_url),reviews(count(),rating.avg()),rooms:variants(id,type,available:room_availability(cost:cost.sum(),count()))`;

export async function getListings(filter: listingfilter) {
  let query: SupabaseFilterBuilder;

  if (filter.latlng) {
    query = supabase.rpc(
      "nearby_listings",
      {
        p_lat: filter.latlng.lat,
        p_lng: filter.latlng.lng,
        p_radius: searchRange,
      },
      { count: "exact" }
    );
    console.log("nearby search");
  } else if (filter.view) {
    let {
      north: min_lat,
      south: max_lat,
      west: min_lng,
      east: max_lng,
    } = filter.view;

    query = supabase.rpc(
      "listings_in_view",
      {
        max_lat,
        max_lng,
        min_lat,
        min_lng,
      },
      { count: "exact" }
    );
    console.log("view search");
  } else {
    query = supabase.from("listings").select(select, { count: "exact" });
    console.log("listing search");
  }
  function getRange(page: number, limit: number) {
    const from = page * limit;
    const to = from + limit - 1;

    return [from, to];
  }
  query.select(select);
  applyFilter(query, filter);
  if (filter.checkin && filter.checkout) {
    check_available(query, new Date(filter.checkin), new Date(filter.checkout));
  } else {
    check_available(query)
  }
  const [from, to] = getRange(filter.page, filter.limit);
  query.range(from, to);
  const res = await query;
  console.log('res :>> ', res);
  if (res.error) throw new Error(res.error.message)

  return res.data;
}
