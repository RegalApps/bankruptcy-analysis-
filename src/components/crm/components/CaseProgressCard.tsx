
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, FileCheck } from "lucide-react";
import { ClientInsightData } from "../../activity/hooks/predictiveData/types";

interface CaseProgressCardProps {
  insights: ClientInsightData;
}

export const CaseProgressCard = ({ insights }: CaseProgressCardProps) => {
  const { caseProgress, pendingTasks, missingDocuments } = insights;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary" />
          Case Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-bold">{caseProgress}%</span>
          </div>
          <Progress value={caseProgress} className="h-2" />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="rounded-md border p-3 flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-full">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium">{pendingTasks}</p>
              <p className="text-xs text-muted-foreground">Pending Tasks</p>
            </div>
          </div>
          
          <div className="rounded-md border p-3 flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <Check className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium">{missingDocuments}</p>
              <p className="text-xs text-muted-foreground">Missing Documents</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
