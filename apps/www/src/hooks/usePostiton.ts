"use client";
import { useState, useEffect } from "react";

export default function usePosition() {
  const [position, setposition] = useState<[number, number]>();

  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition((loc) => {
      setposition([loc.coords.latitude, loc.coords.longitude]);
    });
  }, []);

  return { position, setposition };
}
