import { useEffect } from "react";
import { create } from "zustand";

const store = create(() => ({
  visible: true,
}));
export default function () {
  const { visible } = store();

  const setVisible = (v: boolean) => {
    store.setState({
      visible: v,
    });
  };

  useEffect(() => {
    return () => setVisible(true);
  }, []);

  return { visible, setVisible };
}
