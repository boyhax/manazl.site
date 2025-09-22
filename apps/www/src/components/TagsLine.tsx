'use client'
import { MdClose } from "react-icons/md";
import { ScrollArea } from "./ui/scroll-area";

export function TagsLine({ values, onChange, getText }) {
  return (
    <ScrollArea >
      {values.map((value) => {

        return (
          <div
            key={value}
            className={
              "flex flex-row items-center gap-2 px-1 py-2 rounded-md shadow-md border border-gray-300 "
            }
          >
            {getText(value)}
            <MdClose
              onClick={() =>
                onChange([
                  ...values.filter(() => getText(value) != getText(value)),
                ])
              }
            />
          </div>
        );
      })}
    </ScrollArea>
  );
}