import { useTranslate } from "@tolgee/react";
import { filtercardsClassName } from "../filterViewV2";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "../ui/sheet";
import options from "src/lib/db/options";
import useSearchfilter from "src/hooks/useSearchFilter";
import IconifyIcon from "../iconifyIcon";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { cn } from "src/lib/utils";

export default function () {
  const { updateFilter, filter,setFilter } = useSearchfilter();
  const guests = filter.guests ?? undefined;
  const { t } = useTranslate();
  function optionHundler(value){

    return ()=>updateFilter({guests:value})
  }
  function hundleClear(){
    setFilter({})
  }
  return (
    <Sheet key={"bottom"}>
      <SheetTrigger asChild>
        <div
          className={
            "flex flex-col items-center  p-2 w-1/3 border border-slate-300 rounded-md"
          }
        >
          <label>{t("Guests")}</label>
          <p
            className={
              "font-semibold cursor-pointer truncate overflow-hidden text-wrap text-sm "
            }
          >
            {guests || null}
          </p>
        </div>
      </SheetTrigger>
      <SheetContent side={"bottom"}>
        <SheetHeader>
          <SheetTitle>{t("Select Number of Guests")}</SheetTitle>
        </SheetHeader>

        <p className={"font-medium"}>{t("what you are looking for?")}</p>
        <div
          className={"flex flex-wrap items-center justify-center gap-1 my-1"}
        >
          <OptionRect active={guests=="single"} onClick={optionHundler('single')} className={"text-center border rounded-md p-4 "}>
            <label>{t("Single")}</label>
            <IconifyIcon name={"icon-park-outline:single-bed"} />
          </OptionRect>
          <OptionRect active={guests=="double"}onClick={optionHundler('double')}   className={"text-center border rounded-md p-4"}>
            <label>{t("Double")}</label>
            <IconifyIcon name={"icon-park-outline:double-bed"} />
          </OptionRect>
          <OptionRect active={guests=="three"} onClick={optionHundler('three')}  className={"text-center border rounded-md p-4"}>
            <label>{t("Three")}</label>
            <IconifyIcon name={"ph:users-three-thin"} />
          </OptionRect>
          <OptionRect active={guests=="family"} onClick={optionHundler('family')}  className={"text-center border rounded-md p-4"}>
            <label>{t("Family")}</label>
            <IconifyIcon name={"icon-park-outline:family"} />
          </OptionRect>
          <OptionRect active={guests=="more"} onClick={optionHundler('more')}  className={"text-center border rounded-md p-4"}>
            <label>{t("More")}</label>
            <IconifyIcon name={"material-symbols:family-star-outline"} />
          </OptionRect>
        </div>
        <SheetFooter>
          {/* <SheetClose asChild>
            <Button type="submit">{t("Save changes")}</Button>
          </SheetClose> */}
          <SheetClose asChild>
            <Button type="submit" onClick={hundleClear}>{t("Delete")}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function OptionRect({  children, className, active, ...props }: any) {
  return (
    <div
      {...props}
      className={cn([
        ` ${active ? "border-foreground text-foreground" : "border-foreground/60 hover:border-foreground text-foreground/60 hover:text-foreground"}`,
        className,
      ])}
    >
      {children}
    </div>
  );
}
