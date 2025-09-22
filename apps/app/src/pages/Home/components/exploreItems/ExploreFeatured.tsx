import useFetch from "src/hooks/useFetch";
import { SearchListings } from "src/lib/db/listings";
import ListingPreview from "../HostCard";

export default function ()  {
  const {
    data,
    loading
  } = useFetch(
    async () => await SearchListings({ order: "likes" })
  );
  let featured = data?.data||[]
  if (!featured) return null;

  return featured?.map((v: any) => {
    return <ListingPreview key={v.id + "preview"} id={v.id} />;
  });
};


