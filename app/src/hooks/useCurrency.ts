import { store } from "src/state/Store";

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
  OmrToUsd(value) {
    return value * 2.604;
  },
  UsdToOmr(value) {
    return value * 0.384;
  },
};
