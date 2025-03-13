import Page from "src/components/Page";
import { useTranslate } from "@tolgee/react";
import { BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import useSearchfilter from "src/hooks/useSearchFilter";
import MapToggleButton from "./components/mapToggleButton";
import MapSearchView from "./views/MapSearchView";
import ListingsList from "./views/listingsList";
import { useMediaQuery } from "usehooks-ts";
import { listingfilter } from "src/lib/db/listings";
import Dbsearch from "src/components/dbsearch";
import { CalendarIcon, Filter, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useState } from "react";
import { addDays, format } from "date-fns";
import { formatDate } from "src/lib/utils/formatDate";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger } from "src/components/ui/select";
import options from "src/lib/db/options";
import Nav from "src/layout/nav";
import { Button } from "src/components/ui/button";
import { cn } from "src/lib/utils";
import { Calendar } from "src/components/ui/calendar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "src/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "src/components/ui/sheet";
import { Badge } from "src/components/ui/badge";

export default function () {
  const scrrenlarge = useMediaQuery("(min-width: 768px)");
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { filter, setFilter, updateFilter } = useSearchfilter<
    listingfilter & { map; place_name: string }>();
  if (filter.map) {
    return (<MapSearchView />)
  }

  return (
    <Page>
      <div className={"flex flex-col items-center mt-4 w-full"}>
        <div className={"flex flex-row relative w-full mx-6 max-w-sm items-center gap-1 justify-between rounded-full border shadow-sm border-slate-500 p-2"}>
          <BiSearch size={"1.5rem"} />
          <div className={"flex grow h-full items-center flex-row"}>
            <Dbsearch
              placeholder={filter.place_name || t('Search city, hotel ..')}
              className={"w-full border-none ring-0 outline-none"}
              onChange={(value) => {
                const [lng, lat] = JSON.parse(value.point).coordinates;
                updateFilter({
                  place_name: value.name,
                  latlng: { lat, lng },
                });
              }}
            />
          </div>
          <FilterButtons />
        </div>
        <Nav />
      </div>
      <div className={"h-5"} />
      <div dir={"ltr"} className={"flex flex-row h-full"}>
        {scrrenlarge ? (
          <div className={"w-1/2 pb-20 rounded-lg overflow-hidden"}>
            {" "}
            <MapSearchView />
          </div>
        ) : null}
        <ListingsList />
      </div>

      <div className={"flex absolute bottom-0 w-full items-center justify-center"}>
        <MapToggleButton />
      </div>
    </Page>
  );
}

function FilterButtons() {
  const { t } = useTranslate()
  const { filter, updateFilter } = useSearchfilter<
    listingfilter & { map; place_name: string }>();
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  // Count active filters
  const activeFiltersCount = [
    filter.checkin && filter.checkout ? 1 : 0,
    filter.type ? 1 : 0,
    filter.order ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  return (
    <div className="ms-auto flex flex-row items-center gap-1">
      {/* Date Filter */}
      {isMobile ? (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <CalendarIcon className="h-5 w-5" />
              {(filter.checkin && filter.checkout) && (
                <Badge variant="secondary" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center rounded-full">•</Badge>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{t("Select Dates")}</DrawerTitle>
              <DrawerDescription>{t("Choose check-in and check-out dates")}</DrawerDescription>
            </DrawerHeader>
            <div className="px-4">
              <DateFilterContent />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">{t("Close")}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <CalendarIcon className="h-5 w-5" />
              {(filter.checkin && filter.checkout) && (
                <Badge variant="secondary" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center rounded-full">•</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>{t("Select Dates")}</SheetTitle>
              <SheetDescription>{t("Choose check-in and check-out dates")}</SheetDescription>
            </SheetHeader>
            <div className="py-4">
              <DateFilterContent />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">{t("Close")}</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}

      {/* Filters and Sort */}
      {isMobile ? (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <SlidersHorizontal className="h-5 w-5" />
              {(filter.type || filter.order) && (
                <Badge variant="secondary" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center rounded-full">
                  {filter.type && filter.order ? "2" : "1"}
                </Badge>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{t("Filters & Sort")}</DrawerTitle>
              <DrawerDescription>{t("Refine your search results")}</DrawerDescription>
            </DrawerHeader>
            <div className="px-4 space-y-6">
              <CategoryFilterContent />
              <OrderFilterContent />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline">{t("Close")}</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <SlidersHorizontal className="h-5 w-5" />
              {(filter.type || filter.order) && (
                <Badge variant="secondary" className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center rounded-full">
                  {filter.type && filter.order ? "2" : "1"}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>{t("Filters & Sort")}</SheetTitle>
              <SheetDescription>{t("Refine your search results")}</SheetDescription>
            </SheetHeader>
            <div className="py-4 space-y-6">
              <CategoryFilterContent />
              <OrderFilterContent />
            </div>
            <SheetFooter>
              <SheetClose asChild>
                <Button variant="outline">{t("Close")}</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

function DateFilterContent() {
  const { t } = useTranslate();
  const { filter, updateFilter } = useSearchfilter<listingfilter & { map; place_name: string }>();
  const [date, setDate] = useState({
    from: filter.checkin ? new Date(filter.checkin) : new Date(),
    to: filter.checkout ? new Date(filter.checkout) : addDays(new Date(), 1)
  });

  useEffect(() => {
    if (date.from && date.to) {
      let checkin = formatDate(date.from);
      let checkout = formatDate(date.to);

      updateFilter({
        checkin,
        checkout
      });
    }
  }, [date]);

  const clearDates = () => {
    updateFilter({
      checkin: undefined,
      checkout: undefined
    });
    setDate({
      from: new Date(),
      to: addDays(new Date(), 1)
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-sm">
        {date.from && date.to && (
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">
              {format(date.from, "MMM dd")} - {format(date.to, "MMM dd")}
            </span>
            <Button variant="ghost" size="sm" onClick={clearDates} className="h-8 px-2">
              <X className="h-4 w-4 mr-1" /> {t("Clear")}
            </Button>
          </div>
        )}
      </div>
      <Calendar
        mode="range"
        selected={date}
        onSelect={setDate as any}
        className="rounded-md border"
      />
    </div>
  );
}

function CategoryFilterContent() {
  const { t } = useTranslate();
  const { filter, updateFilter } = useSearchfilter<listingfilter & { map; place_name: string }>();
  const category = filter.type;
  const setCategory = (type) => updateFilter({ type });

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">{t("Property Type")}</h3>
        {category && (
          <Button variant="ghost" size="sm" onClick={() => setCategory(undefined)} className="h-8 px-2">
            <X className="h-4 w-4 mr-1" /> {t("Clear")}
          </Button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {["hotel", "apartment", "house", "room"].map((type) => (
          <Button
            key={type}
            variant={category === type ? "default" : "outline"}
            className="justify-start"
            onClick={() => setCategory(type)}
          >
            {t(type)}
          </Button>
        ))}
      </div>
    </div>
  );
}

function OrderFilterContent() {
  const { t } = useTranslate();
  const { filter, updateFilter } = useSearchfilter<listingfilter & { map; place_name: string }>();
  const order = filter.order;
  const setOrder = (order) => updateFilter({ order });

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">{t("Sort By")}</h3>
        {order && (
          <Button variant="ghost" size="sm" onClick={() => setOrder(undefined)} className="h-8 px-2">
            <X className="h-4 w-4 mr-1" /> {t("Clear")}
          </Button>
        )}
      </div>
      <div className="flex flex-col space-y-1">
        {["likes", "near", "rating"].map((name) => (
          <Button
            key={name}
            variant={order === name ? "default" : "outline"}
            className="justify-start"
            onClick={() => setOrder(name)}
          >
            {t(name)}
          </Button>
        ))}
      </div>
    </div>
  );
}


