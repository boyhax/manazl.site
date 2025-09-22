
import {
  BedDoubleIcon,
  BuildingIcon, HomeIcon, TentIcon
} from "lucide-react";
import * as Yup from 'yup';

export const hostTypes = [
  { icon: HomeIcon, label: "Suite", value: "suite" },
  { icon: BuildingIcon, label: "Villa", value: "villa" },
  { icon: BedDoubleIcon, label: "Room", value: "room" },
  { icon: TentIcon, label: "Camp", value: "camp" },
];

export const amenities = [
  "Wi-Fi",
  "TV",
  "Kitchen",
  "Washer",
  "Free parking",
  "Paid parking",
  "Air conditioning",
  "Dedicated workspace",
  "Pool",
  "Hot tub",
  "Patio",
  "BBQ grill",
  "Outdoor dining area",
  "Fire pit",
  "Gym",
  "Beach access",
  "Ski-in/Ski-out",
  "Smoke alarm",
  "First aid kit",
];
export const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required').min(10, 'Title must be at least 10 characters').max(100, 'Title must be max 500 characters'),
  description: Yup.string().required('Description is required').min(10, 'Description must be at least 10 characters').max(500, 'Description must be max 500 characters'),
  meta: Yup.object(),
  amenities: Yup.array().of(Yup.string()),
  type: Yup.string().required('Type is required'),
  images: Yup.array().of(Yup.string()).min(1, 'At least one image is required'),
  lat: Yup.number().required('Latitude is required'),
  lng: Yup.number().required('Longitude is required'),
  place_name: Yup.string(),
  tags: Yup.array().of(Yup.string()),
});
export type ListingformProps = {
  title: string;
  description: string;
  images: any[];
  address: { city: string, state: string, country: string },
  lat: number;
  lng: number;
  type: string;
  amenities: string[];
  tags: string[];
};
export const defaultValues: ListingformProps = {
  lat: 23.5,
  lng: 58.5,
  address: { city: "", country: "", state: "" },
  title: "",
  description: "",
  images: [],
  type: "villa",
  amenities: [],
  tags: [],
};
