import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import supabase from "src/lib/supabase";
import { cn } from "src/lib/utils";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface SearchItem {
  name: string;
  point?: { coordinates:[number,number]};
  image?: string;
  type?: string;
}

function useDBPlacesAutocomplete() {
  const [value, _setValue] = useState("");
  const client = useQueryClient()
  const { data: suggestions,isLoading } =useQuery({
    queryKey: ['searchitems', value],
    staleTime:500,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("search_items")
        .select()
        .ilike("name", `%${value}%`)
        .limit(5);
        if(error) throw Error(error as any)
      return !data?[]:data?.map(item => {
        let point = JSON.parse(item.point)
        item.point = point
        return item
      }) as SearchItem[]
    }
    
  })
      

  const clearSuggestions = () => {
    client.setQueryData(['searchitems'],prev=>[])
  }

  function setValue(value, fetch = true) {
    _setValue(value || "");
  }

  return {
    value,
    setValue,
    suggestions,
    loading:isLoading,
    clearSuggestions,
  };
}

interface PlacesAutocompleteProps {
  onSuggetions?: ( allSuggestions?: SearchItem[]) => void;
  defaultValue?: string;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  options?;
  renderSuggestions?: boolean;
}

export default function ({
  onSuggetions,
  defaultValue = "",
  onClear,
  placeholder = "Search for a place...",
  className,
  options,
  renderSuggestions = false,
}: PlacesAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { value, suggestions, loading, setValue, clearSuggestions } =
    useDBPlacesAutocomplete();

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
  
  // Pass suggestions to parent when they change
  useEffect(() => {
    if (onSuggetions && suggestions?.length > 0) {
      // Don't pass a selected place, just pass the suggestions
      onSuggetions( suggestions);
    }
  }, [suggestions]);

  const handleSelect = async (selectedValue: SearchItem) => {
    setValue(selectedValue.name, false);
    clearSuggestions();
    setIsOpen(false);
    if (onSuggetions) {
      // Now pass the selected place
      onSuggetions([selectedValue]);
    }
  };
  
  return (
    <div ref={wrapperRef} className={cn("w-full relative", className)}>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setIsOpen(true)}
        className={cn(["bg-inherit", className])}
      />

      {/* Only render suggestions if explicitly asked to */}
      {renderSuggestions && isOpen && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg">
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

interface CustomSelectProps {
  onSuggetions?: (place: SearchItem[]) => void;
  defaultValue?: string;
  onClear?: () => void;
  placeholder?: string;
  className?: string;
  suggestions: SearchItem[];
  loading: boolean;
  value: string;
  setValue: (value: string, fetch?: boolean) => void;
}
