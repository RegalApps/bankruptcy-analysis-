
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ExcelPreviewProps } from "./types";
import { ExcelLoadingSkeleton } from "./components/ExcelLoadingSkeleton";
import { ExcelErrorDisplay } from "./components/ExcelErrorDisplay";
import { ExcelTable } from "./components/ExcelTable";
import { ExcelHeaderActions } from "./components/ExcelHeaderActions";
import { useExcelPreview } from "./hooks/useExcelPreview";

export const ExcelPreview: React.FC<ExcelPreviewProps> = ({ storagePath, title }) => {
  const {
    loading,
    error,
    excelData,
    publicUrl,
    fetchExcelPreview
  } = useExcelPreview(storagePath, title);
  
  const handleRefresh = () => {
    fetchExcelPreview();
  };
  
  if (loading) {
    return <ExcelLoadingSkeleton size="medium" />;
  }
  
  if (error) {
    return <ExcelErrorDisplay error={error} onRefresh={handleRefresh} publicUrl={publicUrl} />;
  }
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <ExcelHeaderActions 
          title={title} 
          onRefresh={handleRefresh} 
          publicUrl={publicUrl} 
        />
      </CardHeader>
      <CardContent>
        <ExcelTable data={excelData} />
        <p className="text-xs text-muted-foreground mt-4">
          This is a preview of the Excel file. To interact with all data, please download the original file.
        </p>
      </CardContent>
    </Card>
  );
};
