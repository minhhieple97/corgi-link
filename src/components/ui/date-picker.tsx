"use client"

import * as React from "react"
import { CalendarIcon, Clock } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DATE_PRESETS, createExpirationDate, formatExpirationDate } from "@/lib/date-utils"

type DatePickerProps = {
  date?: Date | null
  onDateChange: (date: Date | null) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function ExpirationDatePicker({
  date,
  onDateChange,
  placeholder = "Select expiration date",
  className,
  disabled = false,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedPreset, setSelectedPreset] = React.useState<string>("")

  const handlePresetChange = (presetKey: string) => {
    if (presetKey === "custom") {
      setSelectedPreset("custom")
      return
    }
    
    const presetDate = createExpirationDate(presetKey as keyof typeof DATE_PRESETS)
    onDateChange(presetDate)
    setSelectedPreset(presetKey)
    setIsOpen(false)
  }

  const handleDateSelect = (selectedDate: Date | undefined) => {
    onDateChange(selectedDate || null)
    setSelectedPreset("custom")
    setIsOpen(false)
  }

  const handleClear = () => {
    onDateChange(null)
    setSelectedPreset("")
  }

  const isNeverExpires = !date
  const isExpired = date && date < new Date()

  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      <Label className="text-sm font-medium flex items-center gap-2">
        <Clock className="h-4 w-4" />
        Expiration (Optional)
      </Label>
      
      <div className="space-y-3">
        {/* Preset Selection */}
        <Select
          value={selectedPreset}
          onValueChange={handlePresetChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a preset or custom" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_PRESETS).map(([key, preset]) => (
              <SelectItem key={key} value={key}>
                {preset.label}
              </SelectItem>
            ))}
            <SelectItem value="custom">Custom Date</SelectItem>
          </SelectContent>
        </Select>

        {/* Custom Date Picker */}
        {selectedPreset === "custom" && (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
                disabled={disabled}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : placeholder}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date || undefined}
                onSelect={handleDateSelect}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}

        {/* Current Selection Display */}
        {(date || isNeverExpires) && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {isNeverExpires ? "Never expires" : formatExpirationDate(date)}
              </span>
              {isExpired && (
                <Badge variant="destructive" className="text-xs">
                  Expired
                </Badge>
              )}
              {!isNeverExpires && !isExpired && (
                <Badge variant="secondary" className="text-xs">
                  Future
                </Badge>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={disabled}
              className="h-auto p-1 text-muted-foreground hover:text-foreground"
            >
              Clear
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}