"use client";

import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";

export const store = create(
  devtools(
    persist(
      combine(
        {
          placesloaded: false,
          cities: [],
          default_place_point: [23, 58],
          host_types: [],
          app_name: "manazl",
          default_language: "ar",
          current_version: 0.9,
          latest_version: 0.9,
          max_variants: 5,
          locals: { language: "ar" },
          min_version: 1,
          local: {
            lang: "ar",
            transulation: {},
          },
        },
        (set, get) => ({})
      ),
      { name: "storeState" }
    ),
    { name: "store" }
  )
);
