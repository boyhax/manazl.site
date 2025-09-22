// import { Store } from "pullstate";
// import { useEffect } from "react";

// const store = new Store({
//   value: 0,
// });
// export default function useHeaderHide() {
//   const { value:headerHideValue } = store.useState();
//   const setHeaderHideValue = (v: number) => {
//     store.update((s) => {
//       s.value = v;
//     });
//   };
//   useEffect(() => {
//     return ()=>setHeaderHideValue(0)
//   }, []);
//   return { headerHideValue, setHeaderHideValue };
// }
