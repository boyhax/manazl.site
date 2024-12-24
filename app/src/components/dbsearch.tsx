import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { fromPlaceId } from "react-geocode";
import { googleapi } from "src/App";
import supabase from "src/lib/supabase";
import { cn } from "src/lib/utils";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

function useDBPlacesAutocomplete() {
  const [value, _setValue] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = useCallback(async (input: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("search_items")
        .select()
        .ilike("name", `%${input}%`)
        .limit(5);

      if (data) setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  function setValue(value, fetch = true) {
    if (value) {
      if (fetch) {
        const timer = setTimeout(() => fetchSuggestions(value), 300);
      }
    } else {
      setSuggestions([]);
    }
    _setValue(value || "");
  }

  return {
    value,
    setValue,
    suggestions,
    loading,
    clearSuggestions: () => setSuggestions([]),
  };
}
interface PlacesAutocompleteProps {
  onChange?: (place) => void;
  defaultValue?: string;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  options?;
}

export default function ({
  onChange,
  defaultValue = "",
  onClear,
  placeholder = "Search for a place...",
  className,
  options,
}: PlacesAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const { value, suggestions, setValue, clearSuggestions } =
    useDBPlacesAutocomplete();

  const [open, setOpen] = useState(false);

  const handleSelect = async (selectedValue) => {
    setValue(selectedValue.name, false);
    clearSuggestions();
    setOpen(false);
    onChange(selectedValue);
  };
  return (
    <div ref={wrapperRef} className={cn("w-full relative", className)}>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsOpen(true)}
        className={cn(["  bg-inherit ", className])}
      />

      {isOpen && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg">
          {
            <ul className="max-h-60 overflow-auto">
              <ScrollArea>
                <ScrollBar></ScrollBar>

                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.name}
                    className="flex items-center p-2 hover:bg-accent cursor-pointer"
                    onClick={() => handleSelect(suggestion)}
                  >
                    <div className="w-10 h-10 mr-3 flex-shrink-0">
                      {!!suggestion.image ? (
                        <img
                          src={suggestion.image}
                          alt=""
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        ""
                      )}
                    </div>
                    <div className="flex-grow justify-between ms-2">
                      <div className="font-medium">{suggestion.name}</div>
                      <Badge variant="secondary" className="mt-1">
                        {suggestion.type}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ScrollArea>
            </ul>
          }
        </div>
      )}

      {value && onClear && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          onClick={() => {
            setValue("");
            if (onClear) onClear();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

interface SearchItem {
  name: string;
  image: string;
  type: "place" | "Host";
}

interface CustomSelectProps {
  onChange?: (place: SearchItem) => void;
  defaultValue?: string;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  suggestions: SearchItem[];
  loading: boolean;
  value: string;
  setValue: (value: string, fetch?: boolean) => void;
}

function CustomSelect({
  onChange,
  defaultValue = "",
  onClear,
  placeholder = "Search for a place...",
  className,
  suggestions,
  loading,
  value,
  setValue,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (selectedValue: SearchItem) => {
    setValue(selectedValue.name, false);
    setIsOpen(false);
    if (onChange) {
      onChange(selectedValue);
    }
  };

  return (
    <div ref={wrapperRef} className={cn("w-full relative", className)}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsOpen(true)}
        className="rounded-full"
      />

      {isOpen && (suggestions.length > 0 || loading) && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg">
          {loading ? (
            <div className="p-2 text-center text-muted-foreground">
              Loading...
            </div>
          ) : (
            <ul className="max-h-60 overflow-auto">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.name}
                  className="flex items-center p-2 hover:bg-accent cursor-pointer"
                  onClick={() => handleSelect(suggestion)}
                >
                  <div className="w-10 h-10 mr-3 flex-shrink-0">
                    <img
                      src={suggestion.image || "/placeholder.png"}
                      alt=""
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium">{suggestion.name}</div>
                    <Badge variant="secondary" className="mt-1">
                      {suggestion.type}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {value && onClear && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          onClick={() => {
            setValue("");
            if (onClear) onClear();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
