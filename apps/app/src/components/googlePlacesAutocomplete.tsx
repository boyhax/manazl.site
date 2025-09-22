import { useEffect, useState, useRef } from "react";
import { googleapi } from "src/App";
import { Input } from "./ui/input";


interface PlacesAutocompleteProps {
  onChange?: (place: google.maps.places.PlaceResult) => void;
  defaultValue?: string;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  options?: google.maps.places.AutocompleteOptions;
}



export default function ({
  onChange,
  defaultValue = "",
  onClear,
  placeholder = "Search for a place...",
  className,
  options,
}: PlacesAutocompleteProps) {
  const [autocomplete, setautocomplete] = useState<google.maps.places.Autocomplete>(null);

  const inputref = useRef(null);

  useEffect(() => {
    if (!inputref.current) return;
    googleapi.importLibrary("places").then((serv) => {
      const service = new serv.Autocomplete(inputref.current);
      service.setOptions(options)
      setautocomplete(service);
    });
  }, [inputref]);
  useEffect(() => {
    if (!autocomplete) return;

    autocomplete.addListener('place_changed', () => {
      onChange(autocomplete.getPlace());
    });
  }, [onChange, autocomplete]);



  return <input
    onClick={e => e.stopPropagation()}
    className={className}
    ref={inputref} />;

}
