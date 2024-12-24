import { useTranslate } from "@tolgee/react";
import options from "src/lib/db/options";
import { toggleValueInArray } from "src/lib/utils";
import IconifyIcon from "./iconifyIcon";
import SideScroll from "./sideScroll";

export default function ({ value, onChange }) {
  const { t } = useTranslate();
  var optionsList = options.filter((v) => v.type == "category");

  function hundlechange(value) {
    onChange(value);
  }

  return (
    <SideScroll>
      {optionsList.map((option) => {
        const active = value == option.value;
        return (
          <a
            className={`flex flex-col  items-center justify-center cursor-pointer px-2 py-1  gap-1    h-24  w-max bg-background  hover:text-foreground hover:border-b-2  ${active ? "font-bold border-b-2 text-foreground border-foreground " : "text-foreground/70 "}`}
            key={option.value}
            onClick={() => hundlechange(active ? null : option.value)}
          >
            <IconifyIcon size={"2rem"} name={option.icon} />
            <p>{t(option.value)}</p>
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
  values: string | string[];
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
      const newvalues = toggleValueInArray(value, values);
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
