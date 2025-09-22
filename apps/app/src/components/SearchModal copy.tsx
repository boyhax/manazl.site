import { useState, useEffect } from "react";
import { useTranslate } from "@tolgee/react";
import { MapPin, ArrowRight, X, Search } from "lucide-react";
import { addDays, format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Dbsearch, { SearchItem } from "src/components/dbsearch";
import { formatDate } from "src/lib/utils/formatDate";
import propertyCategories from "src/lib/data/categories";
import { listingfilter } from "src/lib/db/listings";
import { getPopularDestinations, OmanDestination } from "src/lib/data/omanDestinations";
import { cn } from "src/lib/utils";

interface SearchModalProps {
  filter: listingfilter & { map; place_name: string };
  updateFilter: (param: Partial<listingfilter & { map; place_name: string }>) => void;
}

export default function SearchModal({ filter, updateFilter }: SearchModalProps) {
  const { t } = useTranslate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("location");
  const [popularDestinations, setPopularDestinations] = useState<OmanDestination[]>([]);
  const [dbSuggestions, setDbSuggestions] = useState<SearchItem[]>([]);

  // Track selections in state for a smooth UX
  const [location, setLocation] = useState<{ name: string; point: string }>({
    name: filter.place_name || "",
    point: filter.latlng ? JSON.stringify({ coordinates: [filter.latlng.lng, filter.latlng.lat] }) : ""
  });
  const [category, setCategory] = useState<string>(filter.type || "");
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: filter.checkin ? new Date(filter.checkin) : new Date(),
    to: filter.checkout ? new Date(filter.checkout) : addDays(new Date(), 1)
  });

  useEffect(() => {
    // Load popular destinations when component mounts
    setPopularDestinations(getPopularDestinations());
  }, []);

  // Reset to default tab each time modal opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setActiveTab("location");
    }
    setOpen(isOpen);
  };

  // Select a destination from the Oman suggestions
  const selectDestination = (destination: OmanDestination) => {
    setLocation({
      name: destination.name,
      point: JSON.stringify(destination.point)
    });

    // Automatically move to dates tab after selecting location
    setActiveTab("dates");
  };



  // Handle suggestions from Dbsearch
  const handleDbsearchChange = (suggestions: SearchItem[]) => {
    if (suggestions) {
      setDbSuggestions(suggestions);
    }
  };

  // Apply all filters when the search button is clicked
  const applySearch = () => {
    // Only apply if we have a location
    if (location.name && location.point) {
      try {
        // Parse the point data
        const pointData = typeof location.point === 'string'
          ? JSON.parse(location.point)
          : location.point;

        const coordinates = pointData.coordinates;
        const [lng, lat] = coordinates;

        updateFilter({
          place_name: location.name,
          latlng: { lat, lng },
          type: category || undefined,
          checkin: dateRange.from ? formatDate(dateRange.from) : undefined,
          checkout: dateRange.to ? formatDate(dateRange.to) : undefined
        });
      } catch (e) {
        console.error("Invalid point format", e);
      }
    }

    setOpen(false);
  };

  // Count active filters for badge
  const activeFiltersCount = [
    filter.place_name ? 1 : 0,
    filter.type ? 1 : 0,
    (filter.checkin && filter.checkout) ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  // Filter destinations based on search query
  const filteredDestinations = searchQuery
    ? popularDestinations.filter(dest =>
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.arabicName.includes(searchQuery))
    : popularDestinations;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div className="flex flex-row relative w-full mx-auto items-center gap-1 rounded-full border shadow-sm border-slate-300 px-4 py-2 cursor-pointer">
          <div className="flex grow items-center">
            <Search className="h-4 w-4 text-muted-foreground mr-2" />
            <div>
              <div className="text-sm font-medium">{filter.place_name || t("Where to?")}</div>
              <div className="text-xs text-muted-foreground flex flex-wrap gap-x-1">
                {filter.type && <span>{t(propertyCategories.find(c => c.slug === filter.type)?.label || "")}</span>}
                {filter.checkin && filter.checkout && <span>• {format(new Date(filter.checkin), "MMM d")} - {format(new Date(filter.checkout), "MMM d")}</span>}
                {!filter.type && !filter.checkin && <span>{t("Anywhere")} • {t("Any dates")}</span>}
              </div>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-auto h-5 py-0 px-2">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="text-lg">{t("Find your perfect place")}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="location"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              {t("Where")}
            </TabsTrigger>
            <TabsTrigger
              value="dates"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              {t("When")}
            </TabsTrigger>
            <TabsTrigger
              value="category"
              className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              {t("What")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="location" className="p-4 pt-2">
            <div className="space-y-4">


              {location.name && (
                <div className="p-2 bg-muted/50 rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{location.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLocation({ name: "", point: "" })}
                    className="h-8 px-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}


              <Dbsearch
                placeholder={t("Custom location search...")}
                className="w-full"
                onSuggetions={handleDbsearchChange}
              />
              <div className="space-y-3">
                <h3 className="text-sm font-medium">{t("Popular destinations in Oman")}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {dbSuggestions.map((destination) => (
                    <div
                      key={destination.name}
                      onClick={() => selectDestination(destination as any)}
                      className={cn(
                        "cursor-pointer rounded-md border p-2 transition-colors hover:bg-muted/50",
                        location.name === destination.name ? "border-primary bg-muted/50" : "border-border"
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{destination.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setActiveTab("dates")}
                disabled={!location.name || !location.point}
              >
                {t("Next")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="dates" className="p-4 pt-2">
            <div className="space-y-4">
              {dateRange.from && dateRange.to && (
                <div className="flex justify-between items-center">
                  <span className="font-medium text-sm">
                    {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDateRange({
                      from: new Date(),
                      to: addDays(new Date(), 1)
                    })}
                    className="h-8 px-2"
                  >
                    <X className="h-4 w-4 mr-1" /> {t("Clear")}
                  </Button>
                </div>
              )}

              <CalendarComponent
                mode="range"
                selected={dateRange}
                onSelect={(range) => setDateRange(range as { from: Date; to: Date })}
                className="rounded-md border"
              />
            </div>

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setActiveTab("location")}>
                {t("Back")}
              </Button>
              <Button onClick={() => setActiveTab("category")}>
                {t("Next")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="category" className="p-4 pt-2">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">{t("Property Type")}</h3>
                {category && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCategory("")}
                    className="h-8 px-2"
                  >
                    <X className="h-4 w-4 mr-1" /> {t("Clear")}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                {propertyCategories.map((type) => (
                  <Button
                    key={type.slug}
                    variant={category === type.slug ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setCategory(type.slug)}
                  >
                    <type.icon className="h-4 w-4 mr-2" />
                    <span>{t(type.label)}</span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setActiveTab("dates")}>
                {t("Back")}
              </Button>
              <Button onClick={applySearch}>
                {t("Search")}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}