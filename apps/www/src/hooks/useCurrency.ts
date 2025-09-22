"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = {
  currency: "$" | "OMR";
};

const store = create<Store>()(
  persist(
    (set, get) => ({
      currency: "$",
    }),
    {
      name: "currency-storage", // name of the item in the storage (must be unique)
    }
  )
);
export function useCurrency() {
  const currency = store((s) => s.currency);

  function setCurrency(value: "OMR" | "$") {
    store.setState({ currency: value });
  }
  function converted(value: number, from = "$") {
    if (from === "$") {
      return currency === "$" ? value : Currency.UsdToOmr(value);
    } else if (from === "OMR") {
      return currency === "$" ? Currency.OmrToUsd(value) : value;
    } else throw Error("bad from currency");
  }

  return { currency, setCurrency, converted };
}

const Currency = {
  OmrToUsd(value: number) {
    return value * 2.604;
  },
  UsdToOmr(value: number) {
    return value * 0.384;
  },
};
