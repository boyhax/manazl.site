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




export type LandSaleProperty = {
  id: number
  image?:string,
  title: string
  location: string
  price: number
  size: number
  user_id:string,
  type: 'Residential' | 'Commercial' | 'Agricultural'
  is_available: boolean
  features: string[]
}








