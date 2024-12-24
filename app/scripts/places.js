const { fromLatLng, fromAddress } = require("react-geocode");

const VITE_APP_google_key = "AIzaSyALPQY1Ca6OBw7_oG6KC21X11bPKo_dPsw";
const { createClient } = require("@supabase/supabase-js");
const VITE_APP_SUPABASE_URL = "https://api.manazl.site";
const VITE_APP_SUPABASE_ANON_KEY =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTcyMDcyNzQwMCwiZXhwIjo0ODc2NDAxMDAwLCJyb2xlIjoic2VydmljZV9yb2xlIn0.F9bDVuOspKc2QfaJeXlBHRbuxWIlTwDwcAjqegaVbQM";
const supabase = createClient(
  VITE_APP_SUPABASE_URL,
  VITE_APP_SUPABASE_ANON_KEY
);

// const fetch = require("node-fetch");

async function downloadImageAsBlob(imageUrl) {
  try {
    // Fetch the image from the URL
    const response = await fetch(imageUrl);

    // Check if the response is ok
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Convert the response to a Blob
    const blob = await response.blob();

    // Do something with the Blob (e.g., display or store it)
    console.log("Image Blob:", blob);
    return blob;
  } catch (error) {
    console.error("Error downloading image:", error);
  }
}
async function getPlacePhoto(placeId) {
  try {
    // Get Place Details
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${VITE_APP_google_key}`;
    const detailsResponse = await fetch(detailsUrl);
    const detailsData = await detailsResponse.json();

    if (detailsData.result.photos && detailsData.result.photos.length > 0) {
      // Get the first photo_reference
      const photoReference = detailsData.result.photos[0].photo_reference;

      // Build Place Photo API URL
      const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${VITE_APP_google_key}`;

      return photoUrl;
    } else {
      console.error("No photos available for this place.");
    }
  } catch (error) {
    console.error("Error fetching place details or photos:", error);
  }
}

// type Place = {
//   types text[] null,
//     short_name text not null,
//     image text null,
//     bounds jsonb null,
//     latlng jsonb null,
//     viewport jsonb null,
//     name json null,
//     geo_point geography null,
// }
function getplace(georesult) {
  let newplace = {
    short_name: georesult.description.trim().replace(" ", "-"),
    name: place.name,
    types: georesult.types,
    latlng: georesult.geometry.location,
    bounds: georesult.geometry.bounds,
    viewport: georesult.geometry.viewport,
    geo_point: `point(${georesult.geometry.location.lng} ${georesult.geometry.location.lat})`,
  };
  return newplace;
}
function newplace(place) {
  let newplace = {
    short_name: place.short_name,
    name: place.name,
  };
  return newplace;
}
async function fetchData() {
  const { error, data } = await supabase.from("places").select();
  data.forEach(async (place) => {
    let address = await geocode(place.name.en);
    let image = await getPlacePhoto(address.place_id);
    let blob = await downloadImageAsBlob(image);

    const { error } = await supabase
      .from("places")
      .update({ image: blob })
      .eq("id", place.id);
    console.log("upaated :>> error ", place, error);
  });

  // add && searchListings(add)
}
async function searchListings(address) {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .contains("address", { city: address.city });

  if (error) {
    console.error("Error :>> ", error);
  } else {
    console.log("search results data :>> ", data);
  }
}

async function geocode(keyward) {
  const { results } = await fromAddress(keyward, VITE_APP_google_key, "en");

  if (results && results.length > 0) {
    return results[0];
  } else {
    console.error("No results found or invalid response");
  }
}
async function getaddress(keyward) {
  const { results } = await fromAddress(keyward, VITE_APP_google_key, "en");
  if (results && results.length > 0) {
    const addressComponents = results[0].address_components;
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

fetchData();
