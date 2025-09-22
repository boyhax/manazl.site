"use client";

import { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function TagsInput({ tags, setTags, ...props }) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
        setInputValue("");
      }
    }
  };
  function hundleAdd() {
    if (!tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  }
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-sm py-1 px-2">
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X size={14} />
            </button>
          </Badge>
        ))}
      </div>
      <div className={"px-2 flex gap-2 flex-row items-center"}>
        <Input
          {...props}
          type="text"
          placeholder="Type a tag and press Enter"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          className=""
        />

        {inputValue ? (
          <button type="button" onClick={hundleAdd} className={"p-1 rounded border"}>
            Add
          </button>
        ) : null}
      </div>
    </div>
  );
}
