import { cn } from "src/lib/utils/cn";


  export default function ({ children,...props }) {

    return (
      <div
        className={
          cn([`flex flex-row  touch-pan-x overflow-x-auto scroll-smooth whitespace-nowrap`,props.className])
        }
        {...props}
      >
        {children}
      </div>
    );
  }