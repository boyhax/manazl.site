

'use client'
import { useState, useRef } from "react";
import { MapContainer, useMapEvents, Marker, TileLayer } from "react-leaflet";
import { Map as LeafletMap, icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, MapPin, X } from "lucide-react";
import { useTranslate } from "@tolgee/react";
import MapIcon from '@/assets/icons/mapicon.png';
import CenterMarker from "./mapComponenets/CenterMarker";
interface Place {
  place_point: [number, number];
  place_name: string;
  country?: string;
  city?: string;
  state?: string
}

interface PlacePickerProps {
  onChange?: (place: Place) => void;
  clearButton?: boolean;
  place_point?: [number, number] | null;
  placeholder: string;
}

export default function ListingPlacePicker({
  onChange,
  clearButton,
  place_point,
  placeholder,
}: PlacePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [center, setCenter] = useState<{ lat, lng }>(
    place_point ? { lat: place_point[0], lng: place_point[1] } : { lat: 58.2, lng: 23.3 }
  );
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const { t } = useTranslate();

  const handlePlaceChange = (place: Place) => {
    setSelectedPlace(place);
    onChange && onChange(place);
  };
  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCenter({ lat: parseFloat(lat), lng: parseFloat(lon) });
        mapRef.current?.setView([parseFloat(lat), parseFloat(lon)], 13);
      }
    } catch (error) {
      console.error("Error searching for location:", error);
    }
  };

  const LocationFinder = () => {
    const map = useMapEvents({
      moveend() {
        const { lat, lng } = map.getCenter();
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log('data :>> ', data);
            if (data) {
              const place: Place = {
                place_point: [lat, lng],
                place_name: data.display_name,
                country: data.address.country,
                city:
                  data.address.city ||
                  data.address.town ||
                  data.address.village || "",
                state:
                  data.address.state || ""

              };
              handlePlaceChange(place);
            }
          })
          .catch(console.error);
      },
    });

    return null;
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <MapPin className="mr-2 h-4 w-4" />
            {selectedPlace ? selectedPlace.place_name : placeholder}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t("Select Location")}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Input
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("Search for a location")}
                className="col-span-3"
              />
              <Button onClick={handleSearch} size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <MapContainer
                  center={center}
                  zoom={13}
                  style={{ height: "300px", width: "100%" }}
                  ref={mapRef}
                >

                  <TileLayer
                    attribution='&copy; <a href="https://www.google.com/maps">google.maps</a>'
                    url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
                  />
                  <CenterMarker />
                  <LocationFinder />

                </MapContainer>
              </CardContent>
            </Card>
            {selectedPlace && (
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">
                  {selectedPlace.place_name}
                </Label>
                {clearButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedPlace(null);
                      onChange && onChange(undefined as any);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
          <Button onClick={() => setIsOpen(false)}>
            {t("Confirm Location")}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
