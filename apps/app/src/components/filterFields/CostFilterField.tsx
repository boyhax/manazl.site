import { useTranslate } from "@tolgee/react";
import useSearchfilter from "src/hooks/useSearchFilter";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "../ui/sheet";
import { Slider } from "../ui/slider";


export function CostFilterField() {
  const { updateFilter, filter } = useSearchfilter();
  const amenities = filter.amenities ?? [];
  const { t } = useTranslate();
  const costRange = filter.costrange||[0,1000];
  return (
    <Sheet key={"bottom"}>
      <SheetTrigger asChild>
        
      <div className={  "flex flex-col items-center  p-2 w-1/3 border border-slate-300 rounded-md"}>
          <label>{t("Cost")}</label>
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

            <p>{costRange[0]! + " - " + costRange[1]! } </p>
            {costRange ? <span className={"px-2"}>{t("OMR")}</span> : null}

          </p>
        </div>
      </SheetTrigger>
      <SheetContent side={"top"}>
        <SheetHeader>
          <SheetTitle>{t("Select Cost")}</SheetTitle>
        </SheetHeader>

        <p className={"font-medium"}>{t("what you are looking for?")}</p>
        <div className={"h-5"}></div>
        <div className={"flex flex-row justify-between items-center gap-2"}>
          <div>
            <p>{costRange[0]!}</p>
          </div>
          <Slider
            defaultValue={[0, 1000]}
            value={costRange}
            onValueChange={(value) => {
              updateFilter({
                costrange: value,
              });
            }}
            max={1000}
            step={1}
          />
          <div>
            <p>{costRange[1]!}</p>
          </div>
        </div>
        <div className={"h-5"}></div>
        {/* <Slider  value={costRange} max={1000} min={0} /> */}
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">{t("Save changes")}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
