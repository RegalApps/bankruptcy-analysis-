
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileCheck } from "lucide-react";
import { ClientInsightData } from "../../activity/hooks/predictiveData/types";
import { CaseProgressBadge } from "./caseProgress/CaseProgressBadge";
import { CaseProgressExplanation } from "./caseProgress/CaseProgressExplanation";
import { PendingTasksSection } from "./caseProgress/PendingTasksSection";
import { MissingDocumentsSection } from "./caseProgress/MissingDocumentsSection";
import { NextStepsSection } from "./caseProgress/NextStepsSection";

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
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <CaseProgressBadge progress={caseProgress} />
            </div>
            <span className="text-sm font-bold">{caseProgress}%</span>
          </div>
          <Progress value={caseProgress} className="h-2" />
        </div>
        
        <CaseProgressExplanation progress={caseProgress} />
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <PendingTasksSection pendingTasks={pendingTasks} />
          <MissingDocumentsSection missingDocuments={missingDocuments} />
        </div>
        
        <NextStepsSection pendingTasks={pendingTasks} missingDocuments={missingDocuments} />
      </CardContent>
    </Card>
  );
};
