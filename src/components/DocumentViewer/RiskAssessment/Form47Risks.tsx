
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Form47Risk } from "./types";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Form47RisksProps {
  risks: Form47Risk[];
  documentId: string;
  isReadOnly?: boolean;
}

export const Form47Risks = ({ risks, documentId, isReadOnly = false }: Form47RisksProps) => {
  const { toast } = useToast();
  
  // Group risks by severity
  const criticalRisks = risks.filter(risk => risk.severity === 'high');
  const moderateRisks = risks.filter(risk => risk.severity === 'medium');
  const minorRisks = risks.filter(risk => risk.severity === 'low');

  const handleResolveRisk = (risk: Form47Risk) => {
    toast({
      title: "Action Recorded",
      description: `Resolution for "${risk.description}" has been logged.`,
    });
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'Critical';
      case 'medium':
        return 'Moderate';
      case 'low':
        return 'Minor';
      default:
        return severity;
    }
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <Card className="bg-card">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="text-lg font-semibold">
          Form 47 Consumer Proposal Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {/* Critical Risks Section */}
        {criticalRisks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-medium flex items-center gap-1 text-destructive">
              <AlertCircle className="h-4 w-4" />
              Critical Issues ({criticalRisks.length})
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Risk</TableHead>
                  <TableHead>Regulation</TableHead>
                  <TableHead>Required Action</TableHead>
                  <TableHead className="w-[100px]">Deadline</TableHead>
                  {!isReadOnly && <TableHead className="text-right">Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {criticalRisks.map((risk, i) => (
                  <TableRow key={`critical-${i}`}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col gap-1">
                        <span>{risk.description}</span>
                        <span className="text-xs text-muted-foreground">{risk.impact}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{risk.regulation || "BIA Requirement"}</Badge>
                    </TableCell>
                    <TableCell>{risk.requiredAction}</TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {risk.deadline}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Must be resolved {risk.deadline}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    {!isReadOnly && (
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleResolveRisk(risk)}
                        >
                          Resolve
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Moderate Risks Section */}
        {moderateRisks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-medium flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-orange-500" />
              Moderate Issues ({moderateRisks.length})
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Risk</TableHead>
                  <TableHead>Regulation</TableHead>
                  <TableHead>Required Action</TableHead>
                  <TableHead>Deadline</TableHead>
                  {!isReadOnly && <TableHead className="text-right">Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {moderateRisks.map((risk, i) => (
                  <TableRow key={`moderate-${i}`}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col gap-1">
                        <span>{risk.description}</span>
                        <span className="text-xs text-muted-foreground">{risk.impact}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{risk.regulation || "BIA Best Practice"}</Badge>
                    </TableCell>
                    <TableCell>{risk.requiredAction}</TableCell>
                    <TableCell>
                      <Badge variant="default" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {risk.deadline}
                      </Badge>
                    </TableCell>
                    {!isReadOnly && (
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleResolveRisk(risk)}
                        >
                          Resolve
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Minor Risks Section */}
        {minorRisks.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-base font-medium flex items-center gap-1">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              Minor Issues ({minorRisks.length})
            </h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Risk</TableHead>
                  <TableHead>Regulation</TableHead>
                  <TableHead>Recommendation</TableHead>
                  {!isReadOnly && <TableHead className="text-right">Action</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {minorRisks.map((risk, i) => (
                  <TableRow key={`minor-${i}`}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col gap-1">
                        <span>{risk.description}</span>
                        <span className="text-xs text-muted-foreground">{risk.impact}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{risk.regulation || "Best Practice"}</Badge>
                    </TableCell>
                    <TableCell>{risk.requiredAction}</TableCell>
                    {!isReadOnly && (
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleResolveRisk(risk)}
                        >
                          Acknowledge
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {risks.length === 0 && (
          <div className="flex items-center justify-center py-8 text-center">
            <div className="flex flex-col items-center">
              <Check className="h-12 w-12 text-green-500 mb-2" />
              <h3 className="text-lg font-medium">No Risks Detected</h3>
              <p className="text-muted-foreground">
                No compliance or regulatory risks were found for this Consumer Proposal.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
