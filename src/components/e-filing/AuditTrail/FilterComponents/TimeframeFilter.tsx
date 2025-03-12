
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeframeOption } from "../types/filterTypes";

interface TimeframeFilterProps {
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
}

export const TimeframeFilter = ({ 
  selectedTimeframe, 
  onTimeframeChange 
}: TimeframeFilterProps) => {
  const timeframes: TimeframeOption[] = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];
  
  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-sm flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          Time Period
        </CardTitle>
      </CardHeader>
      <CardContent className="py-0 px-3 pb-3">
        <div className="flex flex-wrap gap-2">
          {timeframes.map(({ value, label }) => (
            <Badge
              key={value}
              variant={selectedTimeframe === value ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => onTimeframeChange(value)}
            >
              {label}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
