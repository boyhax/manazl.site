import { useTranslate } from "@tolgee/react";
import { useNavigate } from "react-router";
import Page from "src/components/Page";
import useSearchfilter from "src/hooks/useSearchFilter";
import { listingfilter } from "src/lib/db/listings";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import MapToggleButton from "./components/mapToggleButton";
import MapSearchView from "./views/MapSearchView";
import ListingsList from "./views/listingsList";


export default function () {
  const scrrenlarge = useMediaQuery("(min-width: 768px)");
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { filter, setFilter, updateFilter } = useSearchfilter<
    listingfilter & { map; place_name: string }>();
  const [drawerOpen, setDrawerOpen] = useState(false);

  if (scrrenlarge) {
    // Large screen: show map and listings side by side
    return (
      <Page>

        <div className={"flex flex-row h-full"}>
          <div className={"w-1/2  p-4 rounded-lg overflow-hidden  flex flex-col items-center justify-center"}>
            <MapSearchView />
          </div>
          <ListingsList />
        </div>
        <div className={"flex absolute bottom-0 w-full items-center justify-center"}>
          <MapToggleButton />
        </div>
      </Page>
    );
  }

  // Small screen: map is default, listings in drawer
  return (
    <Page>
      <div className="relative h-[calc(100vh-80px)] w-full">
        <MapSearchView />
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <button
              className="fixed  sm:bottom-4  bottom-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-primary text-white rounded-full shadow-lg"
              onClick={() => setDrawerOpen(true)}
            >
              {t("Show Listings")}
            </button>
          </DrawerTrigger>
          <DrawerContent className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <ListingsList />
            </div>

          </DrawerContent>
        </Drawer>
      </div>
    </Page>
  );
}



