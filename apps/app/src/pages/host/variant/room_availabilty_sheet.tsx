import { Sheet, SheetContent, SheetTrigger } from "src/components/ui/sheet";
import RoomAvailabilityCalendar from "./room_availabilty";
import { ScrollArea, ScrollBar } from "src/components/ui/scroll-area";

export default function ({ room_id, children }) {
  return (
    <Sheet >
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent className="h-[96vh] " side="bottom">
        <ScrollArea className={" mt-4"}>
          <RoomAvailabilityCalendar room_id={room_id} />
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
