"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type CalendarProps = {
  mode?: "single" | "range" | "multiple"
  selected?: Date | Date[] | undefined
  onSelect?: (date: Date | undefined) => void
  className?: string
  locale?: any
  modifiers?: any
  modifiersClassNames?: any
  month?: Date
  onMonthChange?: (month: Date) => void
  disabled?: boolean | ((date: Date) => boolean)
  fromDate?: Date
  toDate?: Date
}

function Calendar({
  className,
  mode = "single",
  selected,
  onSelect,
  locale,
  modifiers,
  modifiersClassNames,
  month: initialMonth,
  onMonthChange,
  disabled,
  fromDate,
  toDate,
  ...props
}: CalendarProps) {
  const [month, setMonth] = React.useState(initialMonth || new Date())
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    selected instanceof Date ? selected : undefined,
  )

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const handlePrevMonth = () => {
    const newMonth = new Date(month)
    newMonth.setMonth(newMonth.getMonth() - 1)
    setMonth(newMonth)
    if (onMonthChange) {
      onMonthChange(newMonth)
    }
  }

  const handleNextMonth = () => {
    const newMonth = new Date(month)
    newMonth.setMonth(newMonth.getMonth() + 1)
    setMonth(newMonth)
    if (onMonthChange) {
      onMonthChange(newMonth)
    }
  }

  const handleDateSelect = (date: Date) => {
    if (onSelect) {
      onSelect(date)
    }
    setSelectedDate(date)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (date: Date) => {
    if (!selectedDate) return false
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )
  }

  const isDisabled = (date: Date) => {
    if (typeof disabled === "function") {
      return disabled(date)
    }
    if (disabled === true) {
      return true
    }
    if (fromDate && date < fromDate) {
      return true
    }
    if (toDate && date > toDate) {
      return true
    }
    return false
  }

  const renderCalendar = () => {
    const year = month.getFullYear()
    const monthIndex = month.getMonth()
    const daysInMonth = getDaysInMonth(year, monthIndex)
    const firstDay = getFirstDayOfMonth(year, monthIndex)

    const days = []
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

    // Add weekday headers
    const weekDayHeaders = weekDays.map((day, index) => (
      <div key={`header-${index}`} className="text-center text-xs font-medium text-gray-500 w-9">
        {day}
      </div>
    ))

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-9 h-9"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day)
      const isCurrentDay = isToday(date)
      const isCurrentSelected = isSelected(date)
      const isCurrentDisabled = isDisabled(date)

      days.push(
        <Button
          key={`day-${day}`}
          variant="ghost"
          className={cn(
            "h-9 w-9 p-0 font-normal",
            isCurrentSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
            isCurrentDay && !isCurrentSelected && "bg-accent text-accent-foreground",
            isCurrentDisabled && "opacity-50 cursor-not-allowed",
          )}
          disabled={isCurrentDisabled}
          onClick={() => handleDateSelect(date)}
        >
          {day}
        </Button>,
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="sm" onClick={handlePrevMonth} className="h-7 w-7 bg-transparent p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="font-medium">
            {month.toLocaleDateString(locale?.code || "en-US", { month: "long", year: "numeric" })}
          </div>
          <Button variant="outline" size="sm" onClick={handleNextMonth} className="h-7 w-7 bg-transparent p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {weekDayHeaders}
          {days}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("p-3", className)} {...props}>
      {renderCalendar()}
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
