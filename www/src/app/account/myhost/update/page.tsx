
import { MainContent } from "src/components/Page";
import ListingForm from "../components/listingForm";
import { } from "@tolgee/react";
import { createClient } from "@/app/lib/supabase/server";
import { Card } from "@/components/ui/card";

async function getUserListing() {
  const client = createClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) throw Error('user Sign in Required to Edit Listing')
  const { data, error } = await client.from("listings").select("address,id,title,images,description,tags,amenities,lat,lng,type,categories").eq('user_id', user.id).single()
  if (error) throw Error(error.message)
  return data
}
export default async function UpdateListingPage() {
  const values = await getUserListing()

  return (
    <MainContent className={" w-full "}>
     
        <ListingForm initialValues={values} />
     
    </MainContent>

  );
}
