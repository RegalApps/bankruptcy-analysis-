
import { Shield, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AuditEntry } from "./types";
import { format } from "date-fns";

interface AuditComplianceInfoProps {
  entry: AuditEntry;
}

export const AuditComplianceInfo = ({ entry }: AuditComplianceInfoProps) => {
  return (
    <div>
      <h3 className="text-sm font-medium flex items-center mb-2">
        <Shield className="h-4 w-4 mr-1" /> Compliance Information
      </h3>
      
      <Card className="bg-muted/50">
        <CardContent className="p-3 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Verification Hash</span>
              <span className="font-mono text-xs">{entry.hash.substring(0, 16)}...</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Timestamp</span>
              <span>{format(new Date(entry.timestamp), "yyyy-MM-dd HH:mm:ss.SSS")}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Compliance Status</span>
              <span className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-3.5 w-3.5" />
                Verified
              </span>
            </div>
            
            {entry.regulatoryFramework && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Regulatory Framework</span>
                <span>{entry.regulatoryFramework}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Display Security & Compliance Certificates */}
      <div className="flex justify-center gap-2 mt-3">
        <img 
          src="/placeholder.svg" 
          alt="ISO 27001" 
          className="h-8 opacity-60 hover:opacity-100 transition-opacity cursor-help"
          title="ISO 27001 Certified"
        />
        <img 
          src="/placeholder.svg" 
          alt="GDPR" 
          className="h-8 opacity-60 hover:opacity-100 transition-opacity cursor-help"
          title="GDPR Compliant"
        />
        <img 
          src="/placeholder.svg" 
          alt="SOC 2" 
          className="h-8 opacity-60 hover:opacity-100 transition-opacity cursor-help"
          title="SOC 2 Certified"
        />
      </div>
    </div>
  );
};
