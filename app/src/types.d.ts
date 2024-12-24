import { Photo } from "@capacitor/camera";
import { LatLng } from "leaflet";


export interface MessageProps {
  url: string;
  created_at: any;
  text: string;
  data: any;
  from_user_id: string;
  to_user_id: string;
  isRead?: boolean;
}












