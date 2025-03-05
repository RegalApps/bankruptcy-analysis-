
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, RefreshCw } from "lucide-react";
import { ExcelTable } from "./components/ExcelTable";
import { ExcelHeaderActions } from "./components/ExcelHeaderActions";
import { ExcelErrorDisplay } from "./components/ExcelErrorDisplay";
import { ExcelLoadingSkeleton } from "./components/ExcelLoadingSkeleton";
import { useExcelPreview } from "./hooks/useExcelPreview";
import { ExcelPreviewProps } from "./types";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

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
    clientName,
    handleRefresh 
  } = useExcelPreview(storagePath);

  // Auto-organize Excel file when client name is detected
  useEffect(() => {
    if (clientName && storagePath) {
      const organizeFile = async () => {
        try {
          // Get document ID from storage path
          const documentId = storagePath.split('/').pop()?.split('.')[0];
          if (!documentId) return;
          
          // Get user ID
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;
          
          // Check if document is already organized
          const { data: doc } = await supabase
            .from('documents')
            .select('metadata')
            .eq('id', documentId)
            .single();
            
          if (doc?.metadata?.processing_complete) return;
          
          console.log(`Organizing Excel file for client: ${clientName}`);
          
          // Organize the document
          await organizeDocumentIntoFolders(
            documentId,
            user.id,
            clientName,
            "Excel"
          );
        } catch (err) {
          console.error("Error organizing Excel file:", err);
        }
      };
      
      organizeFile();
    }
  }, [clientName, storagePath]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            {title ? title : 'Financial Data'}
          </CardTitle>
          {clientName && (
            <div className="mt-1">
              <Badge variant="outline" className="text-xs">
                Client: {clientName}
              </Badge>
            </div>
          )}
        </div>
        
        <ExcelHeaderActions 
          title={title} 
          onRefresh={handleRefresh}
          publicUrl={publicUrl}
        />
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <ExcelLoadingSkeleton progress={loadingProgress} />
            {loadingProgress > 40 && loadingProgress < 90 && (
              <div className="text-center text-sm text-muted-foreground">
                <p>Extracting data and detecting client information...</p>
              </div>
            )}
            {loadingProgress === 0 && (
              <div className="flex justify-center mt-4">
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reload
                </Button>
              </div>
            )}
          </div>
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
