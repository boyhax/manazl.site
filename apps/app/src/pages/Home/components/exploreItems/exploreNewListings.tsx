import { useNavigate } from "react-router-dom";
import { explore } from "src/state/explore";
import { SmallPreview } from "./components/exploreListings";
import ListingPreview from "../HostCard";

const ExploreNewListings = () => {
  const newest = explore(s=>s.newest);
  const loading = explore(s=>s.loading)
  const navigate = useNavigate();
  if(!newest)return null
  return newest.map((v: any) => {
    return <ListingPreview key={v.id+'preview'} id={v.id} />;
  });
};

export default ExploreNewListings;
