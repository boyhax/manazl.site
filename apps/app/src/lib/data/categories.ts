import { BuildingIcon, HomeIcon, BedDoubleIcon, TentIcon } from "lucide-react";

export interface PropertyCategory {
  id: number;
  icon: any; // Lucide icon component
  iconifyIcon?: string; // Iconify icon identifier
  label: string;
  label_ar: string;
  value: string;
  slug: string;
  image?: string; // Optional image URL
}

export const propertyCategories: PropertyCategory[] = [
  { 
    id: 1, 
    icon: HomeIcon, 
    iconifyIcon: "mdi:home-outline", 
    label: "Suite", 
    label_ar: "جناح", 
    value: "suite", 
    slug: "suite",
    image: "/assets/categories/suite.jpg"
  },
  { 
    id: 2, 
    icon: BuildingIcon, 
    iconifyIcon: "mdi:building-outline", 
    label: "Villa", 
    label_ar: "فيلا", 
    value: "villa", 
    slug: "villa",
    image: "/assets/categories/villa.jpg"
  },
  { 
    id: 3, 
    icon: BedDoubleIcon, 
    iconifyIcon: "mdi:bed-outline", 
    label: "Room", 
    label_ar: "غرفة", 
    value: "room", 
    slug: "room",
    image: "/assets/categories/room.jpg"
  },
  { 
    id: 4, 
    icon: TentIcon, 
    iconifyIcon: "mdi:tent", 
    label: "Camp", 
    label_ar: "مخيم", 
    value: "camp", 
    slug: "camp",
    image: "/assets/categories/camp.jpg"
  },
  { 
    id: 5, 
    icon: HomeIcon, 
    iconifyIcon: "mdi:apartment", 
    label: "Apartment", 
    label_ar: "شقة", 
    value: "apartment", 
    slug: "apartment",
    image: "/assets/categories/apartment.jpg"
  },
  { 
    id: 6, 
    icon: HomeIcon, 
    iconifyIcon: "mdi:home", 
    label: "House", 
    label_ar: "منزل", 
    value: "house", 
    slug: "house",
    image: "/assets/categories/house.jpg"
  },
  { 
    id: 7, 
    icon: HomeIcon, 
    iconifyIcon: "mdi:home-modern", 
    label: "Chalet", 
    label_ar: "شاليه", 
    value: "chalet", 
    slug: "chalet",
    image: "/assets/categories/chalet.jpg"
  },
  { 
    id: 8, 
    icon: HomeIcon, 
    iconifyIcon: "mdi:cabin", 
    label: "Cabin", 
    label_ar: "كابينة", 
    value: "cabin", 
    slug: "cabin",
    image: "/assets/categories/cabin.jpg"
  },
];

export default propertyCategories;