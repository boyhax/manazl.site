import { IonIcon } from "@ionic/react";
import { useTranslate } from "@tolgee/react";
import { closeOutline } from "ionicons/icons";
import { useState } from "react";

export default function  ({ ...props }) {
  const {t} = useTranslate()

  const [value, setvalue] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props?.onChange(value);
      }}
      className="search search__input w-full flex justify-between items-center "
    >
      <input
        type="text"
        className=" w-full bg-inherit outline-none caret-blue-300 "
        placeholder={t("Search  Places camps, villa ..")}
        onChange={(e) => setvalue(e.currentTarget.value)}
        value={value}
      />
      <div className={"flex items-center gap-3"}>
        {value && (
          <IonIcon
            icon={closeOutline}
            onClick={() => {
              setvalue("");
              props?.onChange("");
            }}
          />
        )}

        <button type={"submit"} className="search__button">
          <svg className="search__icon" aria-hidden="true" viewBox="0 0 24 24">
            <g>
              <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
            </g>
          </svg>
        </button>
      </div>
    </form>
  );
};