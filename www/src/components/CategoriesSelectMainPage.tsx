'use client'
import { useTranslate } from "@tolgee/react";
import { useState, useEffect } from "react";
import SideScroll from "./sideScroll";
import options from "src/lib/db/options";
import useSearchFilter from "src/hooks/useSearchFilter";
import { toggleArrayValue } from "@/app/utils/toggleArrayValue";



export default function CategorySelect() {
  const { updateFilter, filter } = useSearchFilter<any>();
  const filtervalues = filter.categories ?? [];
  const { t } = useTranslate();
  var optionsList = options.filter((v) => v.type == "category");

  const categorie = filtervalues.length
    ? options.find((v) => v.value == filtervalues[0])
    : null;
  if (categorie) {
    optionsList = options.filter(
      (v) => v.type == "sub_category" && v.parent == categorie.value
    );
  }
  function hundlechange(values) {
    updateFilter({ categories: values })
  }

  return (
    <SideScroll>
      {categorie && (
        <a
          className={`flex flex-col  items-center justify-center cursor-pointer px-2 py-1  gap-1    h-24  w-max bg-background  hover:text-foreground hover:border-b-2  ${true ? "font-bold border-b-2 text-foreground border-foreground " : "text-foreground/70 "}`}
          key={categorie.value}
          onClick={() => updateFilter({ categories: undefined })}
        >
          {/* <IconifyIcon size={"2rem"} name={categorie.icon} /> */}
          <p>{t(categorie.name)}</p>
        </a>
      )}
      {optionsList.map((option) => {
        const active = filtervalues.includes(option.value);
        return (
          <a
            className={`flex flex-col  items-center justify-center cursor-pointer px-2 py-1  gap-1    h-24  w-max bg-background  hover:text-foreground hover:border-b-2  ${active ? "font-bold border-b-2 text-foreground border-foreground " : "text-foreground/70 "}`}
            key={option.value}
            onClick={() =>
              hundlechange(
                active
                  ? [...filtervalues.filter((value) => value != option.value)]
                  : [...filtervalues, option.value]
              )
            }
          >
            {/* <IconifyIcon size={"2rem"} name={option.icon} /> */}
            <p>{t(option.name)}</p>
          </a>
        );
      })}
    </SideScroll>
  );
}

type CardSelectOption = {
  value: string;
  name: string;
  url?: string;
};
interface Props {
  options: CardSelectOption[];
  multi?: boolean;
  onChange;
  values: string[];
  className?: any;
}
export function CardSelect({
  values,
  options,
  multi = true,
  onChange,
  className = "",
}: Props) {
  const { t } = useTranslate();

  function hundlechange(values) {
    onChange(values);
  }
  function hundleValue(value: string) {

    return () => {
      const newvalues = toggleArrayValue(values, value
      );
      hundlechange(newvalues);
    };
  }
  return (
    <SideScroll className={className}>
      {options.map((option, i) => {
        const active = values.includes(option.value);
        return (
          <a
            className={` p-3 overflow-hidden flex flex-col items-center justify-center cursor-pointer px-2 py-1  gap-1      w-max bg-background  hover:text-foreground hover:border-b-2  ${active ? "font-bold border-b-2 text-foreground border-foreground " : "text-foreground/70 "}`}
            key={option.value + i}
            onClick={hundleValue(option.value)}
          >
            <p>{t(option.name)}</p>
          </a>
        );
      })}
    </SideScroll>
  );
}
