'use client'

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

type DateRange = { from: Date; to: Date | undefined }

type CalendarProps = {
  mode?: "single" | "range"
  selected?: Date | DateRange
  onSelect?: (date: Date | DateRange) => void
  className?: string
  showOutsideDays?: boolean
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  className,
  showOutsideDays = true,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  const [rangeStart, setRangeStart] = React.useState<Date | null>(null)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const days = []
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Add previous month's days
    for (let i = firstDay.getDay(); i > 0; i--) {
      const prevMonthDay = new Date(year, month, 1 - i)
      days.push({ date: prevMonthDay, isOutside: true })
    }

    // Add current month's days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isOutside: false })
    }

    // Add next month's days
    const remainingDays = 7 - (days.length % 7)
    if (remainingDays < 7) {
      for (let i = 1; i <= remainingDays; i++) {
        const nextMonthDay = new Date(year, month + 1, i)
        days.push({ date: nextMonthDay, isOutside: true })
      }
    }

    return days
  }

  const days = getDaysInMonth(currentMonth)

  const isSelected = (date: Date) => {
    if (!selected) return false
    if (selected instanceof Date) {
      return date.toDateString() === selected.toDateString()
    }
    if ('from' in selected && selected.from instanceof Date) {
      if (selected.to instanceof Date) {
        return date >= selected.from && date <= selected.to
      }
      return date.toDateString() === selected.from.toDateString()
    }
    return false
  }

  const isInRange = (date: Date) => {
    if (mode !== "range" || !selected || selected instanceof Date) return false
    if ('from' in selected && selected.from instanceof Date) {
      if (selected.to instanceof Date) {
        return date > selected.from && date < selected.to
      }
      if (rangeStart instanceof Date) {
        return date > selected.from && date < rangeStart
      }
    }
    return false
  }

  const isRangeStart = (date: Date) => {
    if (mode !== "range" || !selected || selected instanceof Date) return false
    return 'from' in selected && selected.from instanceof Date && date.toDateString() === selected.from.toDateString()
  }

  const isRangeEnd = (date: Date) => {
    if (mode !== "range" || !selected || selected instanceof Date) return false
    return 'to' in selected && selected.to instanceof Date && date.toDateString() === selected.to.toDateString()
  }

  const isToday = (date: Date) => {
    return date.toDateString() === new Date().toDateString()
  }

  const handleDateClick = (date: Date) => {
    if (mode === "single") {
      onSelect && onSelect(date)
    } else if (mode === "range") {
      if (!rangeStart) {
        setRangeStart(date)
        onSelect && onSelect({ from: date, to: undefined })
      } else {
        const [start, end] = [rangeStart, date].sort((a, b) => a.getTime() - b.getTime())
        setRangeStart(null)
        onSelect && onSelect({ from: start, to: end })
      }
    }
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  return (
    <div className={cn("p-3", className)}>
      <div className="flex justify-center pt-1 relative items-center">
        <span className="text-sm font-medium">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <div className="space-x-1 flex items-center absolute right-1">
          <Button
            onClick={handlePrevMonth}
            variant="outline"
            className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleNextMonth}
            variant="outline"
            className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 text-center">
        {DAYS.map((day) => (
          <div key={day} className="text-muted-foreground text-[0.8rem] font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {days.map(({ date, isOutside }, index) => (
          <Button
            key={index}
            onClick={() => handleDateClick(date)}
            className={cn(
              "h-8 w-8 p-0 font-normal",
              "border border-input hover:bg-accent bg-inherit text-foreground hover:text-accent-foreground",
              isSelected(date) && "bg-blue-500 text-primary-foreground hover:bg-primary hover:text-primary-foreground",
              isInRange(date) && "bg-blue-500 text-primary-foreground",
              isRangeStart(date) && "rounded-l-md",
              isRangeEnd(date) && "rounded-r-md",
              isToday(date) && !isSelected(date) && "bg-blue-500 text-white hover:bg-blue-600",
              isOutside && !showOutsideDays && "invisible",
              isOutside && showOutsideDays && "text-muted-foreground opacity-50"
            )}
            disabled={isOutside && !showOutsideDays}
          >
            {date.getDate()}
          </Button>
        ))}
      </div>
    </div>
  )
}