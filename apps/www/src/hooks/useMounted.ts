import * as React from "react";
import { useState } from "react";

export default function useMounted() {
  const [mounted, setMounted] = useState(true);
  const onDisMounted = () => {};
  React.useEffect(() => {
    return () => {
      onDisMounted();
      setMounted(false);
    };
  }, []);

  return { mounted, onDisMounted };
}
