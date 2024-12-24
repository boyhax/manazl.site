import { MdClose } from "react-icons/md";
import { SideScroll } from "./sideScroll";

export function TagsLine({ values, onChange, getText }) {
    return (
      <SideScroll >
        {values.map((value) => {
          
          return (
            <div
              className={
                "flex flex-row items-center gap-2 px-1 py-2 rounded-md shadow-md border border-gray-300 "
              }
            >
              {getText(value)}
              <MdClose
                onClick={() =>
                  onChange([
                    ...values.filter((v) => getText(value) != getText(value)),
                  ])
                }
              />
            </div>
          );
        })}
      </SideScroll>
    );
  }