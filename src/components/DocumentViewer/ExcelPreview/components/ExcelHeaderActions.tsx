
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { DownloadCloud, RefreshCw, ExternalLink, FileSpreadsheet } from "lucide-react";
import { ExcelHeaderActionsProps } from "../types";

export const ExcelHeaderActions = ({ 
  title, 
  onRefresh, 
  publicUrl, 
  sheetNames,
  currentSheet,
  onSheetChange
}: ExcelHeaderActionsProps) => {
  return (
    <>
      <CardTitle className="flex items-center gap-2">
        <FileSpreadsheet className="h-5 w-5 text-green-600" />
        Excel Preview: {title || 'Financial Data'}
      </CardTitle>
      
      {sheetNames && sheetNames.length > 1 && (
        <div className="flex items-center gap-2 my-2">
          <span className="text-sm text-muted-foreground">Sheets:</span>
          <div className="flex flex-wrap gap-1">
            {sheetNames.map((sheetName, index) => (
              <Button
                key={`sheet-${index}`}
                variant={currentSheet === index ? "default" : "outline"}
                size="sm"
                onClick={() => onSheetChange && onSheetChange(index)}
                className="text-xs"
              >
                {sheetName}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a 
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            <DownloadCloud className="h-4 w-4 mr-2" />
            Download
          </a>
        </Button>
        <Button variant="default" size="sm" asChild>
          <a 
            href={publicUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in Browser
          </a>
        </Button>
      </div>
    </>
  );
};
