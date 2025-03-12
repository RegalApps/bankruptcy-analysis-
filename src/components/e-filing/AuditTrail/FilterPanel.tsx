
import { useState } from "react";
import { Filter, Clock, User, FileType, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { AuditEntry } from "./TimelineEntry";

interface FilterPanelProps {
  entries: AuditEntry[];
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  actionTypes: Set<string>;
  timeframe: string;
  users: Set<string>;
}

export const FilterPanel = ({ entries, onFilterChange }: FilterPanelProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    actionTypes: new Set(),
    timeframe: 'all',
    users: new Set()
  });
  
  // Extract unique values from entries for filtering
  const uniqueActionTypes = [...new Set(entries.map(entry => entry.actionType))];
  const uniqueUsers = [...new Set(entries.map(entry => entry.user.name))];
  
  // Recent activity - show the latest 5 entries
  const recentActivity = entries.slice(0, 5);
  
  const timeframes = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];
  
  const toggleActionTypeFilter = (actionType: string) => {
    const newActionTypes = new Set(filters.actionTypes);
    if (newActionTypes.has(actionType)) {
      newActionTypes.delete(actionType);
    } else {
      newActionTypes.add(actionType);
    }
    
    const newFilters = { ...filters, actionTypes: newActionTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const toggleUserFilter = (userName: string) => {
    const newUsers = new Set(filters.users);
    if (newUsers.has(userName)) {
      newUsers.delete(userName);
    } else {
      newUsers.add(userName);
    }
    
    const newFilters = { ...filters, users: newUsers };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const setTimeframeFilter = (timeframe: string) => {
    const newFilters = { ...filters, timeframe };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const clearAllFilters = () => {
    const newFilters = {
      actionTypes: new Set(),
      timeframe: 'all',
      users: new Set()
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  // Calculate active filter count for the badge
  const activeFilterCount = 
    (filters.actionTypes.size || 0) + 
    (filters.users.size || 0) + 
    (filters.timeframe !== 'all' ? 1 : 0);
  
  return (
    <div className="space-y-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filters</h3>
        {activeFilterCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-xs"
          >
            Clear All
          </Button>
        )}
      </div>
      
      {/* Time Period Filter */}
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
                variant={filters.timeframe === value ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setTimeframeFilter(value)}
              >
                {label}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Action Types Filter */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Action Types
          </CardTitle>
        </CardHeader>
        <CardContent className="py-0 px-3 pb-3">
          <div className="flex flex-wrap gap-2">
            {uniqueActionTypes.map(actionType => (
              <Badge
                key={actionType}
                variant={filters.actionTypes.has(actionType) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleActionTypeFilter(actionType)}
              >
                {actionType.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Users Filter */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center">
            <User className="h-4 w-4 mr-2" />
            Users
          </CardTitle>
        </CardHeader>
        <CardContent className="py-0 px-3 pb-3">
          <div className="flex flex-wrap gap-2">
            {uniqueUsers.length <= 5 ? (
              uniqueUsers.map(userName => (
                <Badge
                  key={userName}
                  variant={filters.users.has(userName) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleUserFilter(userName)}
                >
                  {userName}
                </Badge>
              ))
            ) : (
              <>
                {uniqueUsers.slice(0, 3).map(userName => (
                  <Badge
                    key={userName}
                    variant={filters.users.has(userName) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleUserFilter(userName)}
                  >
                    {userName}
                  </Badge>
                ))}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge variant="outline" className="cursor-pointer">
                      +{uniqueUsers.length - 3} more
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {uniqueUsers.slice(3).map(userName => (
                      <DropdownMenuItem 
                        key={userName}
                        onClick={() => toggleUserFilter(userName)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        <span>{userName}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader className="py-3">
          <CardTitle className="text-sm flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="py-0 px-3 pb-3">
          <div className="space-y-2">
            {recentActivity.map(entry => (
              <div key={entry.id} className="text-xs border-b pb-2 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{entry.user.name}</span>
                  <Badge variant="outline" className="text-[10px] px-1">
                    {entry.actionType.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="truncate text-muted-foreground mt-1">
                  {entry.documentName}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
