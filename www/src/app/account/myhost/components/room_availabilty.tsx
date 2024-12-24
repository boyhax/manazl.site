import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isAfter,
  startOfDay,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useTranslate } from "@tolgee/react";
import supabase from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Toggle } from "@/components/ui/toggle";
import { toast } from "@/hooks/use-toast";
import { useUserContext } from "@/providers/userProvider";

interface RoomAvailability {
  id: string;
  date: string;
  is_available: boolean;
  cost: number;
}

export default function RoomAvailabilityCalendar({
  room_id,
}: {
  room_id: string;
}) {
  const { user } = useUserContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState<RoomAvailability[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bulkEditCost, setBulkEditCost] = useState<number | "">("");
  const [bulkEditAvailability, setBulkEditAvailability] = useState<
    boolean | null
  >(true);
  const { t } = useTranslate();
  const queryClient = useQueryClient();

  const fetchRoomAvailability = async (start: string, end: string) => {
    if (!user) throw Error('user sign in required')
    const { data, error } = await supabase
      .from("room_availability")
      .select("*,variants!inner(id,listings!inner(user_id))")
      .eq("variants.listings.user_id", user.id)
      .eq("variants.id", room_id)
      .gte("date", start)
      .lte("date", end);

    if (error) throw new Error(error.message);
    return data as RoomAvailability[];
  };

  const {
    data: availabilityData,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "roomAvailability",
      format(currentDate, "yyyy-MM"),
      user?.id,
      room_id,
    ],
    queryFn: () =>
      fetchRoomAvailability(
        format(startOfMonth(currentDate), "yyyy-MM-dd"),
        format(endOfMonth(currentDate), "yyyy-MM-dd")
      ),
    enabled: !!user && !!room_id,
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedDays: RoomAvailability[]) => {
      const update = await supabase
        .from("room_availability")
        .upsert(updatedDays.filter((d) => !!d.id));
      const insert = await supabase
        .from("room_availability")
        .upsert(updatedDays.filter((d) => !d.id));
      if (update.error || insert.error) throw update.error || insert.error;
      return update.data || insert.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "roomAvailability",
          format(currentDate, "yyyy-MM"),
          user?.id,
          room_id,
        ],
      });
      toast({
        title: t("Updated successfully"),
        description: t("Room availability has been updated."),
      });
    },
    onError: (error) => {
      toast({
        title: t("Update failed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from("room_availability")
        .delete()
        .in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          "roomAvailability",
          format(currentDate, "yyyy-MM"),
          user?.id,
          room_id,
        ],
      });
      toast({
        title: t("Deleted successfully"),
        description: t("Room availability has been deleted."),
      });
    },
    onError: (error) => {
      toast({
        title: t("Delete failed"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const handleDayClick = (day: Date, dayData: RoomAvailability | undefined) => {
    if (!isAfter(startOfDay(day), startOfDay(new Date()))) return;

    const isSelected = selectedDays.some((d) =>
      isSameDay(new Date(d.date), day)
    );
    if (isSelected) {
      setSelectedDays(
        selectedDays.filter((d) => !isSameDay(new Date(d.date), day))
      );
    } else if (dayData) {
      const { variants, ...cleanDayData } = dayData as any;
      setSelectedDays([...selectedDays, cleanDayData]);
    } else {
      const newDay: any = {
        room_id,
        date: format(day, "yyyy-MM-dd"),
        is_available: true,
        cost: 0,
      };
      setSelectedDays([...selectedDays, newDay]);
    }
  };

  const handleBulkUpdate = () => {
    const updatedDays = selectedDays.map((day) => ({
      ...day,
      cost: bulkEditCost !== "" ? Number(bulkEditCost) : day.cost,
      is_available:
        typeof bulkEditAvailability === "boolean"
          ? bulkEditAvailability
          : day.is_available,
    }));
    updateMutation.mutate(updatedDays);
    setIsDialogOpen(false);
    setSelectedDays([]);
    setBulkEditCost("");
    setBulkEditAvailability(null);
  };

  const handleBulkDelete = () => {
    const ids = selectedDays.filter((day) => day.id).map((day) => day.id);
    if (ids.length > 0) {
      deleteMutation.mutate(ids);
    }
    setIsDialogOpen(false);
    setSelectedDays([]);
  };

  const calendarDays = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  if (isLoading) return <Loader2 className="h-8 w-8 animate-spin" />;
  if (error)
    return (
      <div>
        {t("Error")}: {error.message}
      </div>
    );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-xs">
        <div className="flex items-center justify-between">
          <CardTitle>{t("Room Availability Calendar")}</CardTitle>
          <div dir={"ltr"} className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold">
              {format(currentDate, "MMMM yyyy")}
            </span>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center font-semibold p-2">
              {t(day)}
            </div>
          ))}
          <AnimatePresence>
            {calendarDays.map((day, index) => {
              const dayData = availabilityData?.find((d) =>
                isSameDay(new Date(d.date), day)
              );
              const isSelected = selectedDays.some((d) =>
                isSameDay(new Date(d.date), day)
              );
              const isPastDay = !isAfter(
                startOfDay(day),
                startOfDay(new Date())
              );
              return (
                <motion.div
                  key={day.toISOString()}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, delay: index * 0.01 }}
                  className={`px-2 py-1 w-10 h-10 rounded-lg ${isPastDay
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                    } ${isSameMonth(day, currentDate)
                      ? isSelected
                        ? "bg-primary text-primary-foreground"
                        : dayData
                          ? dayData.is_available
                            ? "bg-secondary"
                            : "bg-[blue]"
                          : "bg-inherit border-2 border-border"
                      : "bg-gray-100"
                    }`}
                  onClick={() => !isPastDay && handleDayClick(day, dayData)}
                >
                  <div className="flex flex-col gap-[2px] justify-between items-center">
                    <span className="text-sm font-semibold">
                      {format(day, "d")}
                    </span>
                    {dayData && (
                      <span className="text-xs font-medium">
                        ${dayData.cost}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        {selectedDays.length > 0 && (
          <div className="mt-4 flex justify-end">
            <Button onClick={() => setIsDialogOpen(true)}>
              {t("Edit Selected Days")}
            </Button>
          </div>
        )}
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Edit Selected Days")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="bulkEditCost"
                className="block text-sm font-medium text-gray-700"
              >
                {t("Cost")}
              </label>
              <Input
                type="number"
                id="bulkEditCost"
                value={bulkEditCost}
                onChange={(e) =>
                  setBulkEditCost(e.target.value ? Number(e.target.value) : "")
                }
                className="mt-1"
                placeholder={t("Leave blank to keep current values")}
              />
            </div>
            <div>
              <label
                htmlFor="bulkEditAvailability"
                className="block text-sm font-medium text-gray-700"
              >
                {t("Available")}
              </label>
              <Toggle
                pressed={bulkEditAvailability === true}
                onPressedChange={(pressed) =>
                  setBulkEditAvailability(pressed ? true : null)
                }
              >
                {bulkEditAvailability === true
                  ? t("Available")
                  : t("Not Available")}
              </Toggle>
            </div>
            <div className="flex justify-between">
              <Button onClick={handleBulkUpdate}>{t("Update")}</Button>
              <Button variant="destructive" onClick={handleBulkDelete}>
                {t("Delete")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
