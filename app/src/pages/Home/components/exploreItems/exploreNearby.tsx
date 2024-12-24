import { explore } from "src/state/explore";
import ListingPreview from "../HostCard";



 
const ExploreNearby = () => {
  const list = explore(s=>s.nearby);
  const loading = explore(s=>s.loading)
  if(!list)return null
  return list.map((v: any) => {
    return <ListingPreview key={v.id+'preview'} id={v.id} />;
  });
};

export default ExploreNearby;
