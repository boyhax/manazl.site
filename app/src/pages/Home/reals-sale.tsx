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
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { addDays, format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "src/components/ui/popover";
import { cn } from "src/lib/utils";
import { Button } from "src/components/ui/button";
import { Calendar } from "src/components/ui/calendar";
import { formatDate } from "src/lib/utils/formatDate";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger } from "src/components/ui/select";
import options from "src/lib/db/options";
import Nav from "src/layout/nav";


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
      <div className={"flex flex-col  items-center mt-4 w-full "}>
        <div
          className={
            "flex flex-row relative   w-full  mx-6  max-w-sm   items-center gap-1 justify-between rounded-full border shadow-sm border-slate-500  p-2"
          }
        >
          <BiSearch size={"1.5rem"} />
          <div className={"flex grow h-full items-center flex-row "}>
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

        </div>
        <Nav />
        <FilterBar />


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

      <div
        className={"flex absolute bottom-0 w-full items-center justify-center"}
      >
        <MapToggleButton />
      </div>
    </Page>
  );
}

function FilterBar() {
  const { t } = useTranslate()
  const { filter, setFilter, updateFilter } = useSearchfilter<
    listingfilter & { map; place_name: string }>();
  const [date, setDate] = useState({
    from: filter.checkin ? new Date(filter.checkin) : new Date(),
    to: filter.checkout ? new Date(filter.checkout) : addDays(new Date(), 1)
  });
  const category = filter.type;
  function setcategory(type) { updateFilter({ type }) }
  const order = filter.order;
  function setorder(order) { updateFilter({ order }) }

  useEffect(() => {
    if (date.from && date.to) {
      let checkin = formatDate(date.from);
      let checkout = formatDate(date.to)

      updateFilter({
        checkin,
        checkout
      })
    }
  }, [date]);

  return (<div className=" ms-auto flex flex-row items-center justify-start gap-3 p-2">
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "w-fit justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <div className="flex flex-col">
                {format(date.from, "MMM dd")} -{" "}
                {format(date.to, "MMM dd")}
              </div>
            ) : (
              format(date.from, "MMM dd")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={date}
          onSelect={setDate as any}

        />
      </PopoverContent>
    </Popover>

    <Select value={order} onValueChange={setorder} defaultValue={t('Order')}>
      <SelectTrigger>
        <Button
          id="ordertrigger"
          variant={"outline"}
          style={{ width: 'auto' }}
          className={
            "w-auto justify-start text-left font-normal"
          }
        >
          {order ? t(order) : t("Order")}
        </Button>
      </SelectTrigger>
      <SelectContent>
        {["likes", "near", "rating"].map((name) => (
          <SelectItem
            key={name}
            value={name}
          >
            {t(name)}
          </SelectItem>
        ))}
        <SelectSeparator />
        <Button
          className="w-full px-2"
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setorder(undefined)
          }}
        >
          {t("Clear")}
        </Button>
      </SelectContent>
    </Select>

    {/* <Select onValueChange={setcategory} value={category} defaultValue={t("category")}>
      <SelectTrigger>
        <Button
          id="date"
          variant={"outline"}
          className={cn(
            "w-fit justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          {category ? t(category) : t("category")}

        </Button>
      </SelectTrigger>
      <SelectContent>
        {
          categories.map((cat) => (
            <SelectItem
              key={cat.name}
              value={cat.value}
            >
              {t(cat.name)}
            </SelectItem>
          ))
        }
        <SelectSeparator />
        <Button
          className="w-full px-2"
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            setcategory(undefined)
          }}
        >
          {t("clear")}
        </Button>
      </SelectContent>
    </Select> */}
  </div>)
}

const categories = options.filter((o) => o.type === "category");

