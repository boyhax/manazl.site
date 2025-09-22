"use client"

import React, { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface AutocompleteProps<T> {
    value: string
    onChange: (value: string) => void
    onSelect: (item: T) => void
    onClear?: () => void
    suggestions: T[]
    renderItem: (item: T) => React.ReactNode
    placeholder?: string
    className?: string
    loading?: boolean
}

export default function Autocomplete<T>({
    value,
    onChange,
    onSelect,
    onClear,
    suggestions,
    renderItem,
    placeholder = "Search...",
    className,
    loading = false,
}: AutocompleteProps<T>) {
    const [isOpen, setIsOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
        setIsOpen(true)
    }

    const handleSelect = (item: T) => {
        onSelect(item)
        setIsOpen(false)
    }

    return (
        <div ref={wrapperRef} className={cn("w-full relative", className)}>
            <Input
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                onFocus={() => setIsOpen(true)}
                className="rounded-full"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-controls="autocomplete-list"
            />

            {isOpen && (suggestions?.length > 0 || loading) && (
                <div
                    id="autocomplete-list"
                    className="absolute z-10 w-full mt-1 bg-background border border-input rounded-md shadow-lg"
                    role="listbox"
                >
                    {loading ? (
                        <div className="p-2 text-center text-muted-foreground">
                            Loading...
                        </div>
                    ) : (
                        <ScrollArea className="h-[300px]">
                            <ul className="p-0 m-0">
                                {suggestions.map((item, index) => (
                                    <li
                                        key={index}
                                        className="cursor-pointer hover:bg-accent"
                                        onClick={() => handleSelect(item)}
                                        role="option"
                                        aria-selected={false}
                                    >
                                        {renderItem(item)}
                                    </li>
                                ))}
                            </ul>
                            <ScrollBar />
                        </ScrollArea>
                    )}
                </div>
            )}

            {value && onClear && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => {
                        onChange("")
                        if (onClear) onClear()
                    }}
                    aria-label="Clear input"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    )
}