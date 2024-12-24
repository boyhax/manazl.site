import {divIcon, icon} from "leaflet";
import "./iconsstyle.css";

export const greenIcon = icon({
  iconUrl: "../../assets/icons8-user-location-100.png",
  

  iconSize: [50, 50], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [0, 50], // point from which the popup should open relative to the iconAnchor
});
import pin2 from "src/assets/pin2.png";
export const pinblue = icon({
  iconUrl: pin2,
  iconSize: [25, 25], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [12.5, 25], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [0, 50], // point from which the popup should open relative to the iconAnchor
});
export const PenIcon = divIcon({
  html: `
  <svg xmlns="http://www.w3.org/2000/svg" width="39" height="43" stroke="#000" stroke-linecap="round" stroke-linejoin="round" fill="#fff" fill-rule="evenodd"><path fill="#000" d="M.5377 17.6679L.5 18.8419c0 8.7891 6.3067 16.0966 14.7848 17.9092l4.1129 5.3237 4.1129-5.3234c8.4784-1.8129 14.7847-9.1204 14.7847-17.9095a18.294 18.294 0 0 0-.0377-1.1745C37.6384 8.0575 29.4607.5 19.3977.5S1.1577 8.0575.5377 17.6679z"/></svg>`,
  className:'mapicon',
  iconSize: [10, 10], // size of the icon
  shadowSize: [50, 64], // size of the shadow
  iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62], // the same for the shadow
  popupAnchor: [0, 50], // point from which the popup should open relative to the iconAnchor
});
export const DotIcon =(zoom)=> divIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11.5" cy="8.5" r="5.5"/><path d="M11.5 14v7"/></svg>`,
  className: "pinsvg",

  iconSize: [24+zoom, 24+zoom],
  iconAnchor: [12, 24],
});
export const PlaceIcon = divIcon({
  html: `<svg class="svg-icon" viewBox="0 0 20 20">
  <path fill="none" d="M10.292,4.229c-1.487,0-2.691,1.205-2.691,2.691s1.205,2.691,2.691,2.691s2.69-1.205,2.69-2.691
    S11.779,4.229,10.292,4.229z M10.292,8.535c-0.892,0-1.615-0.723-1.615-1.615S9.4,5.306,10.292,5.306
    c0.891,0,1.614,0.722,1.614,1.614S11.184,8.535,10.292,8.535z M10.292,1C6.725,1,3.834,3.892,3.834,7.458
    c0,3.567,6.458,10.764,6.458,10.764s6.458-7.196,6.458-10.764C16.75,3.892,13.859,1,10.292,1z M4.91,7.525
    c0-3.009,2.41-5.449,5.382-5.449c2.971,0,5.381,2.44,5.381,5.449s-5.381,9.082-5.381,9.082S4.91,10.535,4.91,7.525z"></path>
</svg>`,
  className: "pinsvg",

  iconSize: [24, 24],
  iconAnchor: [12, 24],
});


