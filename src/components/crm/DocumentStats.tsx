
import { Card } from "@/components/ui/card";
import { FileSignature, Shield, Clock } from "lucide-react";

interface DocumentStatsProps {
  pendingCount: number;
}

export const DocumentStats = ({ pendingCount }: DocumentStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileSignature className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium">Pending Signatures</h4>
            <p className="text-sm text-muted-foreground">
              {pendingCount} documents
            </p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium">Secure Documents</h4>
            <p className="text-sm text-muted-foreground">128-bit encrypted</p>
          </div>
        </div>
      </Card>
      <Card className="p-4">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h4 className="font-medium">Recent Activity</h4>
            <p className="text-sm text-muted-foreground">Real-time updates</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
