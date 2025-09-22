import { useTranslate } from "@tolgee/react";
import { filtercardsClassName } from "../filterViewV2";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from "../ui/sheet";
import options from "src/lib/db/options";
import useSearchfilter from "src/hooks/useSearchFilter";
import IconifyIcon from "../iconifyIcon";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export function CategoriesFilterField() {
  const { updateFilter, filter } = useSearchfilter();
  const categories = filter.categories ?? [];
  const { t } = useTranslate();
  var optionsList = options.filter((v) => v.type == "category");
  const categorie = categories.length
    ? options.find((v) => v.value == categories[0])
    : null;
  if (categorie) {
    optionsList = options.filter(
      (v) => v.type == "sub_category" && v.parent == categorie.value
    );
  }

  return (
    <Sheet key={"bottom"}>
      <SheetTrigger asChild>
      <div className={  "flex flex-col items-center  p-2 w-1/3 border border-slate-300 rounded-md"}>
          <label>{t("Categories")}</label>
          <p
            className={
              "font-semibold cursor-pointer truncate overflow-hidden text-wrap text-sm "
            }
          >
            {categories.length ? categories!.join(","):null}
     
          </p>
        </div>
      </SheetTrigger>
      <SheetContent side={"bottom"}>
        <SheetHeader>
          <SheetTitle>{t("Select Categories")}</SheetTitle>
        </SheetHeader>

        <p className={"font-medium"}>{t("what you are looking for?")}</p>
        <div className={"flex flex-wrap items-center justify-center"}>
          {categorie && (
            <a
              className={`flex flex-col  items-center justify-center cursor-pointer px-2 py-1  gap-1    h-24  w-max bg-background  hover:text-foreground hover:border-b-2  ${true ? "font-bold border-b-2 text-foreground border-foreground " : "text-foreground/70 "}`}
              key={categorie.value}
              onClick={() => updateFilter({ categories: undefined })}
            >
              <IconifyIcon size={"2rem"} name={categorie.icon} />
              <p>{t(categorie.name)}</p>
            </a>
          )}
          {optionsList.map((option) => {
            const active = categories.includes(option.value);
            return (
              <a
                className={`flex flex-col  items-center justify-center cursor-pointer px-2 py-1  gap-1    h-24  w-max bg-background  hover:text-foreground hover:border-b-2  ${active ? "font-bold border-b-2 text-foreground border-foreground " : "text-foreground/70 "}`}
                key={option.value}
                onClick={() =>
                  updateFilter({
                    categories: active
                      ? [categorie.value]
                      : [...categories, option.value],
                  })
                }
              >
                <IconifyIcon size={"2rem"} name={option.icon} />
                <p>{t(option.name)}</p>
              </a>
            );
          })}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">{t("Save changes")}</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}