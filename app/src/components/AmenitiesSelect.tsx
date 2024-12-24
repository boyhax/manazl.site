import { useTranslate } from "@tolgee/react";
import amenities, { AmentiesIcon } from "src/lib/db/amenities";
import IconifyIcon from "./iconifyIcon";

export function AmenitiesSelect({ values, onChange, ...props }) {
  const { t } = useTranslate();

  function hundlechange(values) {
    onChange(values);
    console.log("values from json schema :>> ", values);
  }

  return (
    <div {...props}>
      {amenities.map((option) => {
        const active = values.includes(option.value);
        return (
          <a
            className={`flex flex-col items-center justify-center cursor-pointer px-2 py-1  gap-1    h-24  w-max bg-background  hover:text-foreground hover:border-b-2  ${active ? "font-bold border-b-2 text-foreground border-foreground " : "text-foreground/70 "}`}
            key={option.value}
            onClick={() =>
              hundlechange(
                active
                  ? [...values.filter((value) => value != option.value)]
                  : [...values, option.value]
              )
            }
          >
            <IconifyIcon size={"2rem "} name={AmentiesIcon(option.value)} />
            <p>{t(option.name)}</p>
          </a>
        );
      })}
    </div>
  );
}
