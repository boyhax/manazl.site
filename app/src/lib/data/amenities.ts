export interface Amenity {
  id: string;
  label: string;
  label_ar: string;
  icon: string; // Material icon name
  iconifyIcon?: string; // Iconify icon identifier
  slug: string;
  image?: string; // Optional image URL
}

export const amenities: Amenity[] = [
  {
    id: '1',
    label: "Wi-Fi",
    label_ar: "واي فاي",
    icon: "wifi",
    iconifyIcon: "mdi:wifi",
    slug: "wifi",
    image: "/assets/amenities/wifi.jpg"
  },
  {
    id: '2',
    label: "TV",
    label_ar: "تلفزيون",
    icon: "tv",
    iconifyIcon: "mdi:television",
    slug: "tv",
    image: "/assets/amenities/tv.jpg"
  },
  {
    id: '3',
    label: "Kitchen",
    label_ar: "مطبخ",
    icon: "kitchen",
    iconifyIcon: "mdi:fridge-outline",
    slug: "kitchen",
    image: "/assets/amenities/kitchen.jpg"
  },
  {
    id: '4',
    label: "Washer",
    label_ar: "غسالة",
    icon: "washer",
    iconifyIcon: "mdi:washing-machine",
    slug: "washer",
    image: "/assets/amenities/washer.jpg"
  },
  {
    id: '5',
    label: "Free parking",
    label_ar: "موقف سيارات مجاني",
    icon: "parking",
    iconifyIcon: "mdi:parking",
    slug: "free-parking",
    image: "/assets/amenities/parking.jpg"
  },
  {
    id: '6',
    label: "Paid parking",
    label_ar: "موقف سيارات بأجر",
    icon: "parking",
    iconifyIcon: "mdi:parking-box",
    slug: "paid-parking",
    image: "/assets/amenities/paid-parking.jpg"
  },
  {
    id: '7',
    label: "Air conditioning",
    label_ar: "تكييف الهواء",
    icon: "ac",
    iconifyIcon: "mdi:air-conditioner",
    slug: "air-conditioning",
    image: "/assets/amenities/ac.jpg"
  },
  {
    id: '8',
    label: "Dedicated workspace",
    label_ar: "مساحة عمل مخصصة",
    icon: "workspace",
    iconifyIcon: "mdi:desk",
    slug: "dedicated-workspace",
    image: "/assets/amenities/workspace.jpg"
  },
  {
    id: '9',
    label: "Pool",
    label_ar: "مسبح",
    icon: "pool",
    iconifyIcon: "mdi:pool",
    slug: "pool",
    image: "/assets/amenities/pool.jpg"
  },
  {
    id: '10',
    label: "Hot tub",
    label_ar: "جاكوزي",
    icon: "hot_tub",
    iconifyIcon: "mdi:hot-tub",
    slug: "hot-tub",
    image: "/assets/amenities/hot-tub.jpg"
  },
  {
    id: '11',
    label: "Patio",
    label_ar: "فناء",
    icon: "patio",
    iconifyIcon: "mdi:balcony",
    slug: "patio",
    image: "/assets/amenities/patio.jpg"
  },
  {
    id: '12',
    label: "BBQ grill",
    label_ar: "شواية",
    icon: "bbq_grill",
    iconifyIcon: "mdi:grill",
    slug: "bbq-grill",
    image: "/assets/amenities/bbq-grill.jpg"
  },
  {
    id: '13',
    label: "Outdoor dining area",
    label_ar: "منطقة طعام خارجية",
    icon: "outdoor_dining",
    iconifyIcon: "mdi:table-chair",
    slug: "outdoor-dining",
    image: "/assets/amenities/outdoor-dining.jpg"
  },
  {
    id: '14',
    label: "Fire pit",
    label_ar: "موقد النار",
    icon: "fire_pit",
    iconifyIcon: "mdi:fire",
    slug: "fire-pit",
    image: "/assets/amenities/fire-pit.jpg"
  },
  {
    id: '15',
    label: "Gym",
    label_ar: "صالة رياضية",
    icon: "gym",
    iconifyIcon: "mdi:dumbbell",
    slug: "gym",
    image: "/assets/amenities/gym.jpg"
  },
  {
    id: '16',
    label: "Spa",
    label_ar: "سبا",
    icon: "spa",
    iconifyIcon: "mdi:spa",
    slug: "spa",
    image: "/assets/amenities/spa.jpg"
  },
  {
    id: '17',
    label: "Pet friendly",
    label_ar: "صديق للحيوانات الأليفة",
    icon: "pet_friendly",
    iconifyIcon: "mdi:paw",
    slug: "pet-friendly",
    image: "/assets/amenities/pet-friendly.jpg"
  },
  {
    id: '18',
    label: "Breakfast included",
    label_ar: "إفطار مشمول",
    icon: "breakfast_included",
    iconifyIcon: "mdi:food-croissant",
    slug: "breakfast-included",
    image: "/assets/amenities/breakfast.jpg"
  },
  {
    id: '19',
    label: "Family friendly",
    label_ar: "مناسب للعائلات",
    icon: "family_friendly",
    iconifyIcon: "mdi:human-male-female-child",
    slug: "family-friendly",
    image: "/assets/amenities/family-friendly.jpg"
  },
];

export default amenities;