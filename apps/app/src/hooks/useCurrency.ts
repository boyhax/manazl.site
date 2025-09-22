import { store } from "src/state/Store";

export function useCurrency() {
  const currency = store((s) => s.currency);

  function setCurrency(value: "OMR" | "$") {
    store.setState({ currency: value });
  }
 function converted(
   value: number,
   from: string = '$',
   to: string = currency
 ): number |string{
   if (from === '$') {
     return to === '$' ? value.toFixed(2) : Currency.UsdToOmr(value).toFixed(2)
   } else if (from === 'OMR') {
     return to === '$' ? Currency.OmrToUsd(value).toFixed(2) : value.toFixed(2)
   } else {
     throw new Error("Unsupported 'from' currency")
   }
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
