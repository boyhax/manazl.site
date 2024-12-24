import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
} from "@ionic/react";
import { addDays } from "date-fns";
import { menuOutline } from "ionicons/icons";
import Page, { Header, HeaderBackButton, HeaderTitle } from "src/components/Page";
import ThemeToggle from "src/components/ThemeToggle";
import Toolbar from "src/components/Toolbar";
import supabase from "src/lib/supabase";
import { auth } from "src/state/auth";
import { googleapi } from "src/App";
import PhoneAuth from "./auth/PhoneAuth";
import { Card, CardContent, CardHeader, CardTitle } from "src/components/ui/card";
import PlacePicker from "src/components/PlacePicker";
import { Button } from "src/components/ui/button";
import PlacePicker2 from "src/components/ListingPlacePicker";

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
  function getDaysBetweenDates(date1: Date, date2: Date): number {
    const oneDayInMs = 24 * 60 * 60 * 1000; // Hours * Minutes * Seconds * Milliseconds
    const differenceInTime = date2.getTime() - date1.getTime(); // Difference in milliseconds
    const differenceInDays = differenceInTime / oneDayInMs; // Convert milliseconds to days
    return Math.round(differenceInDays); // Rounding to nearest whole number
  }
  return query
    .gte(`${key}.date`, formatDate(start))
    .lte(`${key}.date`, formatDate(end))
    .eq(`${key}.is_available`, true);
  // .eq(`${key}.count`, getDaysBetweenDates(start, end));
}

async function searchListings(value: [number, number]) {
  // const address = await getaddress(value);
  const [p_lng, p_lat] = value;

  // let type = getType(value.types);
  // console.log("type :>> ", type);
  let query = supabase.rpc(
    "nearby_listings",
    { p_lat, p_lng, p_radius: 200000 },
    {}
  );
  check_available(query, new Date(), addDays(new Date(), 2));
  query.select(
    "title,user:profiles(full_name,avatar_url),rooms:variants!inner(title,available:room_availability!inner(room_id,count(),cost.sum()))"
  );

  const { data, error } = await query;

  if (error) {
    console.error("Error :>> ", error);
  } else {
    console.log("search results data :>> ", data);
  }
}
function getType(types): "" | "city" | "state" | "country" {
  let type: any = "";

  if (types.includes("locality")) {
    type = "city";
  }

  if (types.includes("administrative_area_level_1")) {
    type = "state";
  }

  if (types.includes("country")) {
    type = "country";
  }

  return type;
}
function getaddress(result) {
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
async function getPlacesSuggetions(input) {

  googleapi.importLibrary('places').then(library => {
    const service = new library.AutocompleteService()
    service.getPlacePredictions({ input, componentRestrictions: { country: 'om' } }, sugetions => {

      return sugetions
    })
  })
}
export default function () {
  const { user } = auth();


  return (
    <Page key={"playground"}>
      <Header>
        <HeaderTitle>
          Playground
        </HeaderTitle>
        <HeaderBackButton />
      </Header>

      <IonContent className={"flex  "}>
        {/* <PlacesAutocomplete
          options={{ types: ["locality", "administrative_area_level_1"] }}
          onChange={console.log}
        />
        <Dbsearch
          onChange={(value) => {
            console.log("value :>> ", JSON.parse(value.point).coordinates);
            searchListings(JSON.parse(value.point).coordinates);
          }}
        /> */}

        {/* <RoomAvailabilityCalendar room_id={'8'}/> */}
        {/* <PlacesAutocomplete2
          options={{
            fields: ['geometry'],
            componentRestrictions: { country: "om" },
          }}
          onChange={place =>
            console.log(place)}
        /> */}
        {/* <Card className="m-4">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
          </CardHeader>
          <CardContent>
            <PhoneAuth />
          </CardContent>
        </Card> */}

        {/* <PlacePicker2 onChange={value => console.log(value)} placeholder="location" /> */}

        <div className="h-16"></div>
      </IonContent>
    </Page >
  );
}
