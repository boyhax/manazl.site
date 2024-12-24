import { Share } from "@capacitor/share";
import { BiShare } from "react-icons/bi";
import getPathTo from "src/lib/utils/getPathTo";

export default function ShareButton({ id, ...props }) {
    return (
      <button
        className={
          "flex items-center justify-center  backdrop-blur-lg rounded-full  text-foreground p-1  active:scale-75 transition-all hover:text-foreground/80 bg-white/70 dark:bg-slate-900/70"
        }
        {...props}
        onClick={async function () {
          let can = await Share.canShare();
          can.value &&
            Share.share({
              text: `Find Your Next Amazing Travel Places Here
  
                check here ${getPathTo(`listing/${id}`)}
                `,
              url: getPathTo(`listing/${id}`),
            });
        }}
      >
        <BiShare className={""} size={"1.5rem"} />
      </button>
    );
  }
  