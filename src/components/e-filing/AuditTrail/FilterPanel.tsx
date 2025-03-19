
import { useState, useEffect } from "react";
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
  
  // Extract unique values from entries for filtering
  const uniqueActionTypes = [...new Set(entries.map(entry => entry.actionType))];
  const uniqueUsers = [...new Set(entries.map(entry => entry.user.name))];
  
  // Recent activity - show the latest 5 entries
  const recentActivity = entries.slice(0, 5);

  // Apply filters when they change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);
  
  const updateFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  
  const clearAllFilters = () => {
    const newFilters = {
      actionTypes: new Set<string>(),
      timeframe: 'all',
      users: new Set<string>()
    };
    setFilters(newFilters);
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
          <button 
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={clearAllFilters}
          >
            Clear All
          </button>
        )}
      </div>
      
      {/* Time Period Filter */}
      <TimeframeFilter 
        selectedTimeframe={filters.timeframe} 
        onTimeframeChange={(timeframe) => {
          updateFilters({ ...filters, timeframe });
        }} 
      />
      
      {/* Action Types Filter */}
      <ActionTypesFilter 
        actionTypes={uniqueActionTypes}
        selectedActionTypes={filters.actionTypes}
        onActionTypeChange={(actionType) => {
          const newActionTypes = new Set(filters.actionTypes);
          if (newActionTypes.has(actionType)) {
            newActionTypes.delete(actionType);
          } else {
            newActionTypes.add(actionType);
          }
          
          updateFilters({ ...filters, actionTypes: newActionTypes });
        }}
      />
      
      {/* Users Filter */}
      <UsersFilter 
        users={uniqueUsers}
        selectedUsers={filters.users}
        onUserChange={(userName) => {
          const newUsers = new Set(filters.users);
          if (newUsers.has(userName)) {
            newUsers.delete(userName);
          } else {
            newUsers.add(userName);
          }
          
          updateFilters({ ...filters, users: newUsers });
        }}
      />
      
      {/* Recent Activity */}
      <RecentActivityPanel recentActivity={recentActivity} />
    </div>
  );
};
