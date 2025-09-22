'use client'
import { BiShare } from "react-icons/bi";


export default function ShareButton({ id, ...props }) {
  let origin = window.location.origin
  return (
    <button
      className={
        "flex items-center justify-center  backdrop-blur-lg rounded-full  text-foreground p-1  active:scale-75 transition-all hover:text-foreground/80 bg-white/70 dark:bg-slate-900/70"
      }
      {...props}
      onClick={() => share({
        text: `Find Your Next Amazing Travel Places With Manazl`,
        url: origin + `listing/${id}`,
      })}
    >
      <BiShare className={""} size={"1.5rem"} />
    </button>
  );
}

type ShareProps = {
  text?, url?, file?
}
export async function share(props: ShareProps) {
  if (!window.navigator?.share || !window.navigator?.canShare(props)) return
  return await window.navigator.share(props);

}