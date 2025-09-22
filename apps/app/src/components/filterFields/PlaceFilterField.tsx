import { IonLabel } from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { useState } from "react";
import useSearchfilter from "src/hooks/useSearchFilter";
import PlacesAutocomplete from "../PlacesAutocomplete";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Input } from "../ui/input";

export const filtercardsClassName =
  "flex flex-row items-center justify-between mx-2 p-2 border border-slate-300 rounded-md";

export function PlaceFilterField() {
  const { updateFilter, filter } = useSearchfilter();
  const [edit, setedit] = useState(false);
  const place_name = filter.place_name!;
  const { t } = useTranslate();
  return (
    <Sheet key={"placesheet"}>
      <SheetTrigger asChild>
     
      <div className={  "flex flex-col items-center  p-2 w-1/3 border border-slate-300 rounded-md"}>
          <label>{t("Location")}</label>
          <p className={"font-semibold cursor-pointer text-center max-w-full  truncate overflow-hidden  text-sm"}>
            <IonLabel> {place_name}</IonLabel>
          </p>
        </div>
        
      </SheetTrigger>
      <SheetContent side={"top"} key={"placesheetcontent"}>
        <SheetHeader>
          <SheetTitle>{t("Location")}</SheetTitle>
        </SheetHeader>

        <p className={"font-medium"}>{t("Where to?")}</p>
        <PlacesAutocomplete
          key={"filterfiledplace"}
          placeholder="travel to"
          defaultValue={place_name}
          onChange={(v) => {
            const { lat, lng } = v.geometry.location;
            updateFilter({
              latlng: { lat: lat(), lng: lng() },
              place_name: v.description,
            });
            setedit(false);
          }}
          onClear={() =>
            updateFilter({
              latlng: null,
              place_name: null,
            })
          }
        />

        <div className={"h-12 w-full"} />

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">{t("Save changes")}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
