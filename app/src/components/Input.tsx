import { HTMLProps } from "react";
import { cn } from "src/lib/utils/cn";

type Size = "sm" | "md" | "lg" | "xs"
export default function (
  props: HTMLProps<HTMLInputElement> & {
    before?: any;
    after?: any;
    size?:Size;
  }
) {
  return (
    <label
      className={`input input-primary   text-text  input-bordered flex flex-row  gap-1 items-center ${ props.size?'input-'+props.size:''}`}
    >
      {props.before}
      <input {...props} className={cn(["grow bg-transparent", props?.className])} />
      {props.after}
    </label>
  );
}
