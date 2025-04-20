import { useState, useEffect, useCallback, useMemo } from "react";
import { FilterOptions } from "./types/filterTypes";
import { TimeframeFilter } from "./FilterComponents/TimeframeFilter";
import { ActionTypesFilter } from "./FilterComponents/ActionTypesFilter";
import { UsersFilter } from "./FilterComponents/UsersFilter";
import { RecentActivityPanel } from "./FilterComponents/RecentActivityPanel";
import { AuditEntry } from "./TimelineEntry";

interface FilterPanelProps {
  entries: AuditEntry[];
  onFilterChange: (filters: FilterOptions) => void;
}

export const FilterPanel = ({ entries, onFilterChange }: FilterPanelProps) => {
  const [filters, setFilters] = useState<FilterOptions>({
    actionTypes: new Set<string>(),
    timeframe: 'all',
    users: new Set<string>()
  });
  
  const { uniqueActionTypes, uniqueUsers, recentActivity } = useMemo(() => {
    return {
      uniqueActionTypes: [...new Set(entries.map(entry => entry.actionType))],
      uniqueUsers: [...new Set(entries.map(entry => entry.user.name))],
      recentActivity: entries.slice(0, 5)
    };
  }, [entries]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange(filters);
    }, 50);
    
    return () => clearTimeout(timeoutId);
  }, [filters, onFilterChange]);
  
  const updateFilters = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);
  
  const clearAllFilters = useCallback(() => {
    const newFilters = {
      actionTypes: new Set<string>(),
      timeframe: 'all',
      users: new Set<string>()
    };
    setFilters(newFilters);
  }, []);
  
  const activeFilterCount = useMemo(() => 
    (filters.actionTypes.size || 0) + 
    (filters.users.size || 0) + 
    (filters.timeframe !== 'all' ? 1 : 0),
  [filters]);
  
  const handleTimeframeChange = useCallback((timeframe: string) => {
    updateFilters({ ...filters, timeframe });
  }, [filters, updateFilters]);
  
  const handleActionTypeChange = useCallback((actionType: string) => {
    const newActionTypes = new Set(filters.actionTypes);
    if (newActionTypes.has(actionType)) {
      newActionTypes.delete(actionType);
    } else {
      newActionTypes.add(actionType);
    }
    
    updateFilters({ ...filters, actionTypes: newActionTypes });
  }, [filters, updateFilters]);
  
  const handleUserChange = useCallback((userName: string) => {
    const newUsers = new Set(filters.users);
    if (newUsers.has(userName)) {
      newUsers.delete(userName);
    } else {
      newUsers.add(userName);
    }
    
    updateFilters({ ...filters, users: newUsers });
  }, [filters, updateFilters]);
  
  return (
    <div className="space-y-4 h-full overflow-y-auto px-2">
      <div className="flex items-center justify-between pb-2">
        <h3 className="text-base font-semibold">Filters</h3>
        {activeFilterCount > 0 && (
          <button 
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={clearAllFilters}
          >
            Clear
          </button>
        )}
      </div>
      
      <TimeframeFilter 
        selectedTimeframe={filters.timeframe} 
        onTimeframeChange={handleTimeframeChange}
      />
      
      <ActionTypesFilter 
        actionTypes={uniqueActionTypes}
        selectedActionTypes={filters.actionTypes}
        onActionTypeChange={handleActionTypeChange}
      />
      
      <UsersFilter 
        users={uniqueUsers}
        selectedUsers={filters.users}
        onUserChange={handleUserChange}
      />
      
      <RecentActivityPanel recentActivity={recentActivity} />
    </div>
  );
};
