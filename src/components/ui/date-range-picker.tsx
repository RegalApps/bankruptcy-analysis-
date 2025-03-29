
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (date: DateRange | undefined) => void;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  className,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);

  React.useEffect(() => {
    setDate(value);
  }, [value]);

  const handleSelect = (selectedDate: DateRange | undefined) => {
    setDate(selectedDate);
    onChange(selectedDate);
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[240px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
          <div className="flex items-center justify-between p-3 border-t">
            <Button
              variant="ghost"
              className="text-xs"
              onClick={() => handleSelect(undefined)}
            >
              Clear
            </Button>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="text-xs"
                onClick={() => {
                  const today = new Date();
                  handleSelect({
                    from: today,
                    to: today,
                  });
                }}
              >
                Today
              </Button>
              <Button
                variant="ghost"
                className="text-xs"
                onClick={() => {
                  const today = new Date();
                  const lastWeek = addDays(today, -7);
                  handleSelect({
                    from: lastWeek,
                    to: today,
                  });
                }}
              >
                Last 7 days
              </Button>
              <Button
                variant="ghost"
                className="text-xs"
                onClick={() => {
                  const today = new Date();
                  const lastMonth = addDays(today, -30);
                  handleSelect({
                    from: lastMonth,
                    to: today,
                  });
                }}
              >
                Last 30 days
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
