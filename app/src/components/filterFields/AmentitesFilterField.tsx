import { IonContent, IonLabel } from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { FunctionComponent, useState } from "react";
import { useSearch } from "src/state/search";
import { AmenitiesSelect } from "../AmenitiesSelect";
import { CardSelect } from "../CategorieSelect";
import PlacesAutocomplete from "../PlacesAutocomplete";
import useSearchfilter from "src/hooks/useSearchFilter";
import alloptions from "@/lib/db/options";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "../ui/sheet";
import { Button } from "../ui/button";
import useDisclosore from "src/hooks/useDisclosore";
import { Swiper, SwiperSlide } from "swiper/react";
import SideScroll from "../sideScroll";
import options from "src/lib/db/options";
import IconifyIcon from "../iconifyIcon";


export const filtercardsClassName =
"flex flex-row items-center justify-between mx-2 p-2 border border-slate-300 rounded-md"


export function AmentitesFilterField() {
  const { updateFilter, filter } = useSearchfilter();
  const amenities = filter.amenities ?? [];
  const { t } = useTranslate();
  return (
    <Sheet key={"bottom"}>
      <SheetTrigger asChild>
      <div className={  "flex flex-col items-center  p-2 w-fit border border-slate-300 rounded-md"}>
          <p>{t("Amenities")}</p>
          <p
            onClick={() => {
              updateFilter({
                Amenities: undefined,
              });
            }}
            className={
              "font-semibold cursor-pointer truncate overflow-hidden text-wrap text-sm text-center"
            }
          >
            {amenities.length ? amenities!.join(", "):t("Select")}
          </p>
        </div>
      </SheetTrigger>
      <SheetContent side={"bottom"}>
        <SheetHeader>
          <SheetTitle>Select Amenities</SheetTitle>
        </SheetHeader>

        <p className={"font-medium"}>{t("what you are looking for?")}</p>

        <AmenitiesSelect
          className={"flex flex-row flex-wrap"}
          onChange={(values) => updateFilter({ amenities: values })}
          values={amenities}
        />
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">{t("Save changes")}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}