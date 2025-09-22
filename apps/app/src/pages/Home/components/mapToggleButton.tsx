import { useTranslate } from "@tolgee/react";
import { BiListUl } from "react-icons/bi";
import { CiMap } from "react-icons/ci";
import { useNavigate } from "react-router";
import { Button } from "src/components/ui/button";
import useScrollY from "src/hooks/useScrollY";
import useSearchfilter from "src/hooks/useSearchFilter";

export default function () {
  const { visible } = useScrollY();
  const { t } = useTranslate();
  const { filter, updateFilter } = useSearchfilter<any>();
  if (filter.map) return null;
  return (
    <div
      className={`absolute md:hidden  bottom-10 flex justify-center items-center transition-all duration-500  ${visible ? "" : "translate-y-[500%] block opacity-0 scale-0"}`}
    >
      <Button
        size="sm"
        onClick={() =>
          updateFilter(filter.map ? { map: undefined } : { map: true })
        }
        className={`rounded-lg  border-foreground border shadow-md   flex flex-row items-center gap-3 py-1 px-4 `}
      >
        {filter.map ? <BiListUl size="1.5rem" /> : <CiMap size="1.5rem" />}
        {/* {filter.map ? t("list") : t("Map")} */}
      </Button>
    </div>
  );
}
