
import React, { useEffect, useState } from "react";
import { useExcelPreview } from "./hooks/useExcelPreview";
import { ExcelTable } from "./components/ExcelTable";
import { ExcelHeaderActions } from "./components/ExcelHeaderActions";
import { ExcelErrorDisplay } from "./components/ExcelErrorDisplay";
import { ExcelLoadingSkeleton } from "./components/ExcelLoadingSkeleton";
import { ExcelPreviewProps } from "./types";

export const ExcelPreview: React.FC<ExcelPreviewProps> = ({ 
  storageUrl, 
  documentId 
}) => {
  const [currentSheet, setCurrentSheet] = useState(0);
  
  const { 
    data,
    loading,
    error,
    publicUrl,
    handleRefresh
  } = useExcelPreview(storageUrl);

  const sheetNames = data?.sheets || [];
  const isLoading = loading;

  useEffect(() => {
    if (!isLoading && (data || error)) {
      console.log("Excel preview data loaded:", { data, error });
    }
  }, [data, error, isLoading]);

  if (isLoading) {
    return <ExcelLoadingSkeleton />;
  }

  if (error) {
    return (
      <ExcelErrorDisplay 
        error={error}
        onRefresh={handleRefresh}
        publicUrl={publicUrl}
      />
    );
  }

  if (!data || !data.rows || data.rows.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <p className="text-muted-foreground mb-2">No data found in this Excel file.</p>
        <p className="text-sm text-muted-foreground">The file might be empty or in an unsupported format.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ExcelHeaderActions 
        onRefresh={handleRefresh}
        publicUrl={publicUrl}
      />
      
      <div className="flex-1 overflow-auto">
        <ExcelTable data={data} />
      </div>
    </div>
  );
};
