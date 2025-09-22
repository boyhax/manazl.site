import { isPlatform } from "@ionic/core";

export default function getPathTo(to: string = "") {
  return getOriginUrl() + to;
}
export function getOriginUrl() {
  const web = location.origin;
  const mobile = import.meta.env.VITE_APP_MOBILE_HOST;
  const url = isPlatform("hybrid") ? mobile : web;
  return url;
}
