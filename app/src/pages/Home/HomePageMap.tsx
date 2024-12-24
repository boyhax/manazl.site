import Page from "src/components/Page";

import { IonContent, IonModal } from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { useNavigate } from "react-router-dom";
import useSearchfilter from "src/hooks/useSearchFilter";
import MapSearchView from "./views/MapSearchView";
import ListingsList from "./views/listingsList";
import { useMediaQuery } from "usehooks-ts";
import { listingfilter } from "src/lib/db/listings";
import { Menu, Search, SearchIcon } from "lucide-react";
import MapControlContainer from "src/components/mapComponenets/mapControlContainer";
import { MapButton } from "src/components/mapComponenets/mapButton";
import Dbsearch from "src/components/dbsearch";

export default function () {
  const scrrenlarge = useMediaQuery("(min-width: 768px)");
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { filter, setFilter, updateFilter } = useSearchfilter<
    listingfilter & { map; place_name: string }>();

  return (<Page>
    <MapControlContainer vertical="bottom">
      <MapButton id="content-trigger">
        <Search />
      </MapButton>
    </MapControlContainer>

    <MapSearchView />;
    <IonModal
      canDismiss={true}
      initialBreakpoint={0.5}
      breakpoints={[0, 0.5, 0.9]}
      trigger="content-trigger"
      backdropDismiss={true}
      backdropBreakpoint={0.9} >
      <div className="bg-background w-full h-full pb-32 ">
        <div className="bg-background h-full relative">
          <div
            className={
              "flex mt-6 flex-row  relative  w-fit  mx-6     items-center gap-1 justify-between rounded-full border-2 border-slate-500  p-2"
            }
          >
            <SearchIcon size={"1.5rem"} />
            <Dbsearch
              placeholder={filter.place_name || t('Search city, hotel ..')}
              className={"    w-full border-none ring-0 outline-none"}
              onChange={(value) => {
                const [lng, lat] = JSON.parse(value.point).coordinates;
                updateFilter({
                  place_name: value.name,
                  latlng: { lat, lng },
                });
              }}
            />
          </div>
          <div className="h-5" />
          <ListingsList />
        </div>

      </div>

    </IonModal>
  </Page>);

}
