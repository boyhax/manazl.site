const supabase = require("@supabase/supabase-js");
const { fromLatLng } = require("react-geocode");

const VITE_APP_SUPABASE_URL = "https://api.manazl.site";
const VITE_APP_SUPABASE_ANON_KEY =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyMDcyNzQwMCwiZXhwIjo0ODc2NDAxMDAwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.F9bDVuOspKc2QfaJeXlBHRbuxWIlTwDwcAjqegaVbQM";
const VITE_APP_google_key = "AIzaSyALPQY1Ca6OBw7_oG6KC21X11bPKo_dPsw";

const client = supabase.createClient(
  VITE_APP_SUPABASE_URL,
  VITE_APP_SUPABASE_ANON_KEY
);

async function fetchData() {
  const { data, error } = await client.from("listings").select();

  if (error) {
    console.error("Error :>> ", error);
  } else {
    data.forEach((element) => {
      update_listing_address(element);
    });
    console.log("data :>> ", data);
  }
}
async function getaddress(result) {
  if (result) {
    const addressComponents = result.address_components;
    let city = "";
    let state = "";
    let country = "";
    // Loop through the address components to find city, state, and country
    addressComponents.forEach((component) => {
      const types = component.types;

      if (types.includes("locality")) {
        city = component.long_name;
      }

      if (types.includes("administrative_area_level_1")) {
        state = component.short_name;
      }

      if (types.includes("country")) {
        country = component.long_name;
      }
    });

    console.log("address ", { city, state, country });
    return { city, state, country };
  } else {
    console.error("No results found or invalid response");
  }
}
async function update_listing_address(listing) {
  const { results } = await fromLatLng(
    listing.lat,
    listing.lng,
    VITE_APP_google_key,
    "en"
  );
  if (results && results.length > 0) {
    const {address} = getaddress(results[0]);

    // Return or update the listing object if necessary
    const { error } = await client
      .from("listings")
      .update({ address: { city, state, country } })
      .eq("id", listing.id);

    console.log("updates :>> " + listing.id, ":address ", {
      city,
      state,
      country,
    });
    return { city, state, country };
  } else {
    console.error("No results found or invalid response");
  }
}

fetchData();
