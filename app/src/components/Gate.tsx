import { useFetch } from "src/hooks/useSupabaseQuery";

export default function ({
    isOpen,
    children,
  }: {
    isOpen;
    children: (data: { }) => JSX.Element;
  }) {
  
    return isOpen?children({  }):null;
  }