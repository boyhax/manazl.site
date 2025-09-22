import { Share } from "@capacitor/share";
import { id } from "date-fns/locale";
import getPathTo from "src/lib/utils/getPathTo";

export default function ({ text, url, children }) {
  async function hundler() {
    let can = await Share.canShare();
    can.value &&
      Share.share({
        text,
        url: getPathTo(url),
      });
  }

  return <a onClick={hundler}>{children}</a>;
}

export function shareHundler({text,url}) {
  return async () => {
    let can = await Share.canShare();
    can.value &&
      Share.share({
        text,
        url: getPathTo(url),
      });
  };
}
