// Common coordinates for Oman regions

import { SearchItem } from "src/components/dbsearch";

// These are placeholder coordinates - replace with accurate ones for production use
const defaultCoords = {
  muscat: { lat: 23.5859, lng: 58.4059 },
  dhofar: { lat: 17.0151, lng: 54.0924 },
  musandam: { lat: 26.1920, lng: 56.2424 },
  sharqiyahSouth: { lat: 22.2302, lng: 59.2542 },
  sharqiyahNorth: { lat: 22.7053, lng: 58.5307 },
  batinah: { lat: 24.3456, lng: 56.7494 }
};

export interface OmanDestination extends SearchItem {
  name: string;
  arabicName: string;
  region: string;
  description: string;
  coordinates: { lat: number; lng: number };
  point: { coordinates: [number, number] };
  image?: string;
  isPopular: boolean;
}

// Popular destinations in Oman
const omanDestinations: OmanDestination[] = [
  {
    name: "Muscat",
    arabicName: "مسقط",
    region: "Muscat Governorate",
    description: "Capital city with a blend of traditional and modern architecture",
    coordinates: defaultCoords.muscat,
    point: {
      coordinates: [defaultCoords.muscat.lng, defaultCoords.muscat.lat],
    },
    image: "/assets/destinations/muscat.jpg",
    isPopular: true
  },
  {
    name: "Salalah",
    arabicName: "صلالة",
    region: "Dhofar",
    description: "Known for the Khareef season and beautiful beaches",
    coordinates: { lat: 17.0151, lng: 54.0924 },
    point: {
      coordinates: [54.0924, 17.0151],
    },
    image: "/assets/destinations/salalah.jpg",
    isPopular: true
  },
  {
    name: "Nizwa",
    arabicName: "نزوى",
    region: "Ad Dakhiliyah",
    description: "Historic city with the impressive Nizwa Fort",
    coordinates: { lat: 22.9332, lng: 57.5318 },
    point: {
      coordinates: [57.5318, 22.9332],
    },
    image: "/assets/destinations/nizwa.jpg",
    isPopular: true
  },
  {
    name: "Sur",
    arabicName: "صور",
    region: "Ash Sharqiyah South",
    description: "Coastal city famous for dhow building",
    coordinates: defaultCoords.sharqiyahSouth,
    point: {
      coordinates: [defaultCoords.sharqiyahSouth.lng, defaultCoords.sharqiyahSouth.lat],
    },
    image: "/assets/destinations/sur.jpg",
    isPopular: true
  },
  {
    name: "Khasab",
    arabicName: "خصب",
    region: "Musandam",
    description: "Known as the 'Norway of Arabia' for its fjord-like features",
    coordinates: defaultCoords.musandam,
    point: {
      coordinates: [defaultCoords.musandam.lng, defaultCoords.musandam.lat],
    },
    image: "/assets/destinations/khasab.jpg",
    isPopular: true
  },
  {
    name: "Jebel Shams",
    arabicName: "جبل شمس",
    region: "Ad Dakhiliyah",
    description: "The highest mountain in Oman, known as the Grand Canyon of Arabia",
    coordinates: { lat: 23.2378, lng: 57.2637 },
    point: {
      coordinates: [57.2637, 23.2378],
    },
    image: "/assets/destinations/jebel-shams.jpg",
    isPopular: true
  },
  {
    name: "Wadi Bani Khalid",
    arabicName: "وادي بني خالد",
    region: "Ash Sharqiyah North",
    description: "Popular wadi with natural pools and scenic landscapes",
    coordinates: defaultCoords.sharqiyahNorth,
    point: {
      coordinates: [defaultCoords.sharqiyahNorth.lng, defaultCoords.sharqiyahNorth.lat],
    },
    image: "/assets/destinations/wadi-bani-khalid.jpg",
    isPopular: true
  },
  {
    name: "Sohar",
    arabicName: "صحار",
    region: "Al Batinah North",
    description: "Historic port city and Oman's ancient capital",
    coordinates: defaultCoords.batinah,
    point: {
      coordinates: [defaultCoords.batinah.lng, defaultCoords.batinah.lat],
    },
    image: "/assets/destinations/sohar.jpg",
    isPopular: true
  }
];

// Get all destinations, combining popular ones with others from regions
export const getAllDestinations = (): OmanDestination[] => {
  return omanDestinations;
};

// Get only popular destinations
export const getPopularDestinations = (): OmanDestination[] => {
  return omanDestinations.filter(dest => dest.isPopular);
};

export default omanDestinations;