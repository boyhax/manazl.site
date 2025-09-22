import { isPlatform } from "@ionic/core";

export default function log(...props) {
  let hyprid = isPlatform("hybrid");
  console.log("log=>", hyprid ? JSON.stringify(props) : {...props});
}

log("asas", "asas",{
    hello:'world'
});
