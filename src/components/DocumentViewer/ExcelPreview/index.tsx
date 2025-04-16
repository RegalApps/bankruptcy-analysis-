
import React, { useEffect, useState } from "react";
import { useExcelPreview } from "./hooks/useExcelPreview";
import { ExcelTable } from "./components/ExcelTable";
import { ExcelHeaderActions } from "./components/ExcelHeaderActions";
import { ExcelErrorDisplay } from "./components/ExcelErrorDisplay";
import { ExcelLoadingSkeleton } from "./components/ExcelLoadingSkeleton";

interface ExcelPreviewProps {
  storageUrl: string;
  documentId?: string;
}

export const ExcelPreview: React.FC<ExcelPreviewProps> = ({ storageUrl, documentId }) => {
  const { 
    data,
    sheetNames,
    currentSheet,
    setCurrentSheet,
    isLoading,
    error,
    refetch
  } = useExcelPreview(storageUrl, documentId);

  const [hasRendered, setHasRendered] = useState(false);

  useEffect(() => {
    // Mark as rendered once we have data or an error
    if (!isLoading && (data || error)) {
      setHasRendered(true);
    }
  }, [data, error, isLoading]);

  if (isLoading && !hasRendered) {
    return <ExcelLoadingSkeleton />;
  }

  if (error) {
    return <ExcelErrorDisplay error={error} onRetry={refetch} />;
  }

  if (!data || data.length === 0) {
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
        sheetNames={sheetNames}
        currentSheet={currentSheet}
        onSheetChange={setCurrentSheet}
        onRefresh={refetch}
      />
      
      <div className="flex-1 overflow-auto">
        <ExcelTable data={data} />
      </div>
    </div>
  );
};
