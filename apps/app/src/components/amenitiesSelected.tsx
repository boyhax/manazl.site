import { useTranslate } from "@tolgee/react";
import amenities, { AmentiesIcon } from "src/lib/db/amenities";

export function AmenitiesSelected({ values, ...props }) {
  const { t } = useTranslate();

  return (
    <div {...props}>
      {amenities
        .filter((name) => values.includes(name))
        .map((option) => {
          const active = values.includes(option);
          return (
            <a
              className={`flex flex-col items-center justify-center cursor-pointer px-2 py-1  gap-1    h-24  w-max bg-background  hover:text-foreground hover:border-b-2  ${active ? "font-bold border-b-2 text-foreground border-foreground " : "text-foreground/70 "}`}
              key={option.value}
            >
              <img
                className={"h-6 w-6 ms-2"}
                src={AmentiesIcon(option.value)}
              />
              <p>{t(option.value)}</p>
            </a>
          );
        })}
    </div>
  );
}
