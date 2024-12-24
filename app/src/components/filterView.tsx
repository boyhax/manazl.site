import { useTranslate } from "@tolgee/react";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from 'react';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetFooter, SheetTrigger
} from "@/components/ui/sheet";
import 'react-nice-dates/build/style.css';
import useSearchfilter from "src/hooks/useSearchFilter";
import { listingfilter } from "src/lib/db/listings";
import options from "src/lib/db/options";
import { useSearchParams } from "react-router-dom";
import { formatDate } from "src/lib/utils/formatDate";
import { cn } from "src/lib/utils";

const categories = options.filter((o) => o.type === "category");

export const FilterButton = ({ children, ...props }) => {
  const { t } = useTranslate();
  const { filter, updateFilter, setFilter } = useSearchfilter<
    listingfilter & { place_name: string }
  >();
  // const [date, setdate] = useState<{ from, to }>();
  let date: any = {
    from: filter.checkin || new Date(), to: filter.checkout || addDays(new Date(), 1)
  }
  const [params, set] = useSearchParams();
  const [updated, setupdated] = useState<any>(filter || {});


  const handleDateChange = (newDate: { from, to } | undefined) => {
    // setdate(newDate)
    console.log('newDate :>> ', newDate);
    if (newDate.from && newDate.to) {
      set(prev => {
        prev.set('checkin', formatDate(new Date(newDate.from)))
        prev.set('checkout', formatDate(new Date(newDate.to)))
        return prev
      })

    }

  };

  function update(values: Partial<listingfilter> & { place_name?}) {
    updateFilter({ ...updated, ...values });
  }
  function onClear() {
    setFilter({});
    setupdated({});
  }
  function onSet() {
    setFilter({ ...updated, date: date || undefined });
  }
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-3/4 sm:max-w-md bg-card">
        <div className="space-y-10 py-4 bg-background">
          <div className="space-y-2  ">
            <Label className="text-2xl">{t("Pick a date")}</Label>
            {/* <div className="w-96 relative bg-background text-foreground">
              <FilterDateRangePicker value={date} onChange={handleDateChange} />
            </div> */}
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    selected={date}
                    onSelect={handleDateChange}

                  />
                </PopoverContent>
              </Popover>
            </div>

          </div>

          <div className="space-y-2">
            <Label className="text-2xl">{t("Order")}</Label>
            <div className="flex flex-wrap gap-2 ">
              {["likes", "near", "rating", "costDesc"].map((name) => (
                <div
                  key={name}
                  className={`cursor-pointer rounded-md p-2 ${filter.order === name ? "bg-foreground text-background" : " border border-foreground"}`}
                  onClick={() =>
                    update({
                      order: updated.order === name ? undefined : (name as any),
                    })
                  }
                >
                  {t(name)}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-2xl">{t("Property Type")}</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <div
                  key={cat.name}
                  className={`cursor-pointer rounded-md p-2 ${filter.type === cat.value ? "bg-foreground text-background" : " border border-foreground"}`}
                  onClick={() =>
                    update({
                      type: updated.type === cat.value ? undefined : cat.value,
                    })
                  }
                >
                  {t(cat.name)}
                </div>
              ))}
            </div>
          </div>
        </div>
        <SheetFooter>
          <div className={"flex flex-row items-center gap-2"}>

            <Button
              variant={"outline"}

              onClick={onClear}
            >
              {t("Clear All Filters")}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

// function FilterDateRangePicker({ value, onChange }: { value?: { from, to }, onChange?: (value: { from, to }) => void }) {
//   const [startDate, setStartDate] = useState<any>(value?.from)
//   const [endDate, setEndDate] = useState<any>(value?.to)
//   const [searchparams, set] = useSearchParams()

//   useEffect(() => {
//     if (!startDate || !endDate) return
//     onChange && onChange({
//       from: startDate, to: endDate
//     })

//   }, [endDate]);

//   return (
//     <DateRangePicker
//       startDate={startDate}
//       endDate={endDate}
//       onStartDateChange={setStartDate}
//       onEndDateChange={setEndDate}
//       minimumDate={new Date()}
//       minimumLength={1}
//       format='dd MMM yyyy'
//       locale={enGB}

//     >
//       {({ startDateInputProps, endDateInputProps, focus }) => {
//         console.log('focus :>> ', focus);
//         return (
//           <div className='date-range flex flex-row space-x-2 '>
//             <Input
//               className={''}
//               {...startDateInputProps}
//               placeholder='Start date'
//             />
//             <span className='date-range_arrow' />
//             <Input
//               className={''}
//               {...endDateInputProps}
//               placeholder='End date'
//             />
//           </div>
//         )
//       }}
//     </DateRangePicker>
//   )
// }
