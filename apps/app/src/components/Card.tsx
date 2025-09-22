import { HTMLProps } from "react";
import { cn } from "src/lib/utils/cn";

export default function Card(props: HTMLProps<HTMLDivElement>) {
  return (
    <div
      className={cn([
        "m-4 rounded-xl flex flex-col items-start first:rounded-t-xl last:rounded-b-xl shadow-sm  bg-light opacity-90 backdrop-blur-sm ",
        props.className,
      ])}
      {...props}
    ></div>
  );
}
