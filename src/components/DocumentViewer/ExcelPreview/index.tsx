
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet } from "lucide-react";
import { ExcelTable } from "./components/ExcelTable";
import { ExcelHeaderActions } from "./components/ExcelHeaderActions";
import { ExcelErrorDisplay } from "./components/ExcelErrorDisplay";
import { ExcelLoadingSkeleton } from "./components/ExcelLoadingSkeleton";
import { useExcelPreview } from "./hooks/useExcelPreview";
import { ExcelPreviewProps } from "./types";

export const ExcelPreview: React.FC<ExcelPreviewProps> = ({ 
  storagePath,
  title
}) => {
  const { 
    data, 
    loading, 
    error, 
    publicUrl, 
    loadingProgress,
    handleRefresh 
  } = useExcelPreview(storagePath);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          {title ? title : 'Spreadsheet Viewer'}
        </CardTitle>
        
        <ExcelHeaderActions 
          title={title} 
          onRefresh={handleRefresh}
          publicUrl={publicUrl}
        />
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <ExcelLoadingSkeleton progress={loadingProgress} />
        ) : error ? (
          <ExcelErrorDisplay 
            error={error} 
            onRefresh={handleRefresh}
            publicUrl={publicUrl}
          />
        ) : data ? (
          <ExcelTable data={data} />
        ) : (
          <div className="p-8 text-center text-muted-foreground">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );
};
