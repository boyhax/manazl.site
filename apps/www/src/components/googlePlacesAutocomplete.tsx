'use client'
import { useEffect, useState, useRef } from "react";
import { Libraries, useJsApiLoader } from '@react-google-maps/api'


interface PlacesAutocompleteProps {
  onChange?: (place: google.maps.places.PlaceResult) => void;
  defaultValue?: string;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  options?: google.maps.places.AutocompleteOptions;
}

let libraries: Libraries = ['places']

export default function GooglePlacesAutoComplete({
  onChange,
  defaultValue = "",
  onClear,
  placeholder = "Search for a place...",
  className,
  options,
}: PlacesAutocompleteProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-maps-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS as string,
    libraries
  })
  const [autocomplete, setautocomplete] = useState<google.maps.places.Autocomplete>();

  const inputref = useRef(null);

  useEffect(() => {
    if (!!inputref.current && isLoaded) {
      let service = new (window as any).google.maps.places.Autocomplete(inputref.current)
      options && service.setOptions(options)
      setautocomplete(service);

    }


  }, [inputref, isLoaded, options]);
  useEffect(() => {
    if (!autocomplete) return;

    autocomplete.addListener('place_changed', () => {
      onChange && onChange(autocomplete.getPlace());
    });
  }, [onChange, autocomplete]);



  return <input
    onClick={e => e.stopPropagation()}
    className={className}
    ref={inputref} />;

}
