'use client'
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useJsApiLoader } from "@react-google-maps/api";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { fromPlaceId } from "react-geocode";

import { cn } from "src/lib/utils";
import usePlacesAutocomplete, { RequestOptions } from "use-places-autocomplete";


export type AutocompletePlaceResult = google.maps.GeocoderResult &
  google.maps.places.AutocompletePrediction;

interface PlacesAutocompleteProps {
  onChange?: (place: AutocompletePlaceResult) => void;
  defaultValue?: string;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  options?: google.maps.places.AutocompleteOptions;
}
const libraries = ['places'] as any
export default function PlacesAutocomplete({
  onChange,
  defaultValue = "",
  onClear,
  placeholder = "Search for a place...",
  className,
  options,
}: PlacesAutocompleteProps) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    init,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      ...options,
      componentRestrictions: {
        country: "om",
      },
    },
    debounce: 300,
    defaultValue,
  });
  const [open, setOpen] = useState(false);
  const { isLoaded } = useJsApiLoader({ libraries, googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS as string })

  useEffect(() => {
    if (isLoaded) {
      init();
    }
  }, [init, isLoaded]);

  const handleSelect = async (
    selectedValue: google.maps.places.AutocompletePrediction
  ) => {
    setValue(selectedValue.description, false);
    clearSuggestions();
    setOpen(false);

    const results = await getGeocode(selectedValue.place_id);
    if (results && onChange) {
      onChange({ ...results[0], ...selectedValue });
    }
  };

  const getGeocode = async (
    placeId: string
  ): Promise<google.maps.GeocoderResult[] | null> => {
    try {
      const { results } = await fromPlaceId(placeId, undefined, "en", "om");
      return results;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  return (
    <div className={cn("w-full relative  ", className)}>
      <Command>
        <CommandInput
          placeholder={placeholder}
          value={value}
          className={"rounded-full border-none"}
          onValueChange={(newValue) => {
            ready ? setValue(newValue) : null;
          }}
        />
        <CommandList className="border-none">
          <CommandGroup>
            {status === "OK" &&
              data.map((suggestion) => (
                <CommandItem
                  key={suggestion.place_id}
                  value={suggestion.description}
                  onSelect={() => handleSelect(suggestion)}
                >
                  {suggestion.description}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </Command>

      {value && onClear && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute  right-2 top-4 h-5 px-3 py-2"
          onClick={() => {
            setValue("");
            onClear();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
