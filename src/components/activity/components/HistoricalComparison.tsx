
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ComparisonData {
  currentValue: number;
  previousValue: number;
  label: string;
}

interface HistoricalComparisonProps {
  currentPeriod: {
    totalIncome: number;
    totalExpenses: number;
    surplusIncome: number;
  };
  previousPeriod: {
    totalIncome: number;
    totalExpenses: number;
    surplusIncome: number;
  };
}

export const HistoricalComparison = ({ 
  currentPeriod, 
  previousPeriod 
}: HistoricalComparisonProps) => {
  const [comparisons, setComparisons] = useState<ComparisonData[]>([]);

  useEffect(() => {
    const calculateComparisons = () => {
      return [
        {
          label: "Total Income",
          currentValue: currentPeriod.totalIncome,
          previousValue: previousPeriod.totalIncome,
        },
        {
          label: "Total Expenses",
          currentValue: currentPeriod.totalExpenses,
          previousValue: previousPeriod.totalExpenses,
        },
        {
          label: "Surplus Income",
          currentValue: currentPeriod.surplusIncome,
          previousValue: previousPeriod.surplusIncome,
        },
      ];
    };

    setComparisons(calculateComparisons());
  }, [currentPeriod, previousPeriod]);

  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const renderChangeIndicator = (current: number, previous: number) => {
    const percentageChange = getPercentageChange(current, previous);
    const isPositive = percentageChange > 0;
    const isNeutral = percentageChange === 0;

    return (
      <div className={`flex items-center space-x-1 ${
        isPositive ? 'text-green-500' : isNeutral ? 'text-gray-500' : 'text-red-500'
      }`}>
        {isNeutral ? (
          <MinusIcon className="h-4 w-4" />
        ) : isPositive ? (
          <ArrowUpIcon className="h-4 w-4" />
        ) : (
          <ArrowDownIcon className="h-4 w-4" />
        )}
        <span>{Math.abs(percentageChange).toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {comparisons.map((comparison, index) => (
            <div key={index} className="grid grid-cols-3 gap-4 items-center">
              <div className="font-medium">{comparison.label}</div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Previous</div>
                <div>{formatCurrency(comparison.previousValue)}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Current</div>
                <div className="flex items-center justify-end space-x-2">
                  <span>{formatCurrency(comparison.currentValue)}</span>
                  {renderChangeIndicator(comparison.currentValue, comparison.previousValue)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
