
import React, { useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExcelData } from "../types";
import { cn } from "@/lib/utils";
import { ArrowDownAZ, ArrowUpAZ, ArrowDownZA, ArrowUpZA, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExcelTableProps {
  data: ExcelData;
  enableSorting?: boolean;
  enableFiltering?: boolean;
}

export const ExcelTable = ({ 
  data, 
  enableSorting = false, 
  enableFiltering = false 
}: ExcelTableProps) => {
  const { headers, rows } = data;
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: number | null;
    direction: 'asc' | 'desc' | null;
  }>({
    key: null,
    direction: null,
  });
  
  // Filtering state
  const [filterColumn, setFilterColumn] = useState<number | null>(null);
  const [filterValue, setFilterValue] = useState("");
  
  // Handle sorting
  const handleSort = (columnIndex: number) => {
    if (!enableSorting) return;
    
    let direction: 'asc' | 'desc' | null = 'asc';
    
    if (sortConfig.key === columnIndex) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }
    
    setSortConfig({
      key: direction === null ? null : columnIndex,
      direction,
    });
  };
  
  // Handle filtering
  const handleFilterColumnChange = (value: string) => {
    const columnIndex = value === "" ? null : parseInt(value);
    setFilterColumn(columnIndex);
    setFilterValue("");
  };
  
  const clearFilter = () => {
    setFilterColumn(null);
    setFilterValue("");
  };
  
  // Process data with sorting and filtering
  const processedRows = useMemo(() => {
    let result = [...rows];
    
    // Apply filtering
    if (filterColumn !== null && filterValue !== "") {
      result = result.filter(row => {
        const cellValue = String(row[filterColumn]).toLowerCase();
        return cellValue.includes(filterValue.toLowerCase());
      });
    }
    
    // Apply sorting
    if (sortConfig.key !== null && sortConfig.direction !== null) {
      result.sort((a, b) => {
        const keyIndex = sortConfig.key as number;
        
        // Handle numeric sorting
        if (!isNaN(Number(a[keyIndex])) && !isNaN(Number(b[keyIndex]))) {
          return sortConfig.direction === 'asc' 
            ? Number(a[keyIndex]) - Number(b[keyIndex])
            : Number(b[keyIndex]) - Number(a[keyIndex]);
        }
        
        // Default to string comparison
        const aValue = String(a[keyIndex]).toLowerCase();
        const bValue = String(b[keyIndex]).toLowerCase();
        
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  }, [rows, sortConfig, filterColumn, filterValue]);
  
  // Render sort indicator
  const renderSortIcon = (columnIndex: number) => {
    if (!enableSorting) return null;
    
    if (sortConfig.key === columnIndex) {
      if (sortConfig.direction === 'asc') {
        return <ArrowUpAZ className="ml-1 h-4 w-4 inline" />;
      } else if (sortConfig.direction === 'desc') {
        return <ArrowDownZA className="ml-1 h-4 w-4 inline" />;
      }
    }
    
    return <ArrowUpAZ className="ml-1 h-4 w-4 inline opacity-20" />;
  };

  return (
    <div className="space-y-4">
      {/* Filtering controls */}
      {enableFiltering && (
        <div className="flex space-x-2 items-center">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={filterColumn === null ? "" : String(filterColumn)} onValueChange={handleFilterColumnChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select column to filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No filter</SelectItem>
                {headers.map((header, index) => (
                  <SelectItem key={index} value={String(index)}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {filterColumn !== null && (
            <>
              <Input
                placeholder={`Filter by ${headers[filterColumn]}...`}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="max-w-xs"
              />
              <Button variant="ghost" size="icon" onClick={clearFilter}>
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      )}
      
      {/* Table */}
      <div className="border rounded-md overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead 
                  key={index} 
                  className={cn(
                    "font-bold",
                    enableSorting && "cursor-pointer hover:bg-muted/50"
                  )}
                  onClick={() => handleSort(index)}
                >
                  <div className="flex items-center">
                    {header}
                    {enableSorting && renderSortIcon(index)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedRows.map((row, rowIndex) => (
              <TableRow key={rowIndex} className={rowIndex === processedRows.length - 1 ? "font-bold" : ""}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex} className={cellIndex === 0 ? "font-semibold" : ""}>
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Results count */}
      {enableFiltering && filterColumn !== null && filterValue !== "" && (
        <div className="text-sm text-muted-foreground">
          Showing {processedRows.length} of {rows.length} rows
        </div>
      )}
    </div>
  );
};
