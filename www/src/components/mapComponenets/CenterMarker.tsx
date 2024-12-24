
import { MapPin } from "lucide-react";

export default function CenterMarker() {
  return (
    <div
      className={
        "flex absolute w-full h-full items-center justify-center z-[1000] pointer-events-none"
      }
    >
      <MapPin fill='black' color='white' className="drop-shadow-md -translate-y-[50%]" size={'2.5rem'} />
    </div>
  );
}
