
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface FormRecommendationPanelProps {
  recommendedForms: Array<{
    formNumber: string;
    formName: string;
    required: boolean;
    description: string;
  }>;
  clientName: string;
}

export const FormRecommendationPanel = ({ 
  recommendedForms,
  clientName
}: FormRecommendationPanelProps) => {
  // Group forms by category
  const formCategories = {
    general: recommendedForms.filter(form => 
      ["1", "2", "3"].includes(form.formNumber)
    ),
    bankruptcy: recommendedForms.filter(form => 
      ["5", "6", "33", "34", "35"].includes(form.formNumber)
    ),
    consumerProposal: recommendedForms.filter(form => 
      ["47", "78", "79", "80"].includes(form.formNumber)
    ),
    business: recommendedForms.filter(form => 
      ["69", "82", "83", "85", "92"].includes(form.formNumber)
    )
  };
  
  const hasRecommendations = recommendedForms.length > 0;
  
  return (
    <div className="space-y-6">
      {hasRecommendations ? (
        <>
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertTitle>AI Form Analysis</AlertTitle>
            <AlertDescription>
              Based on the client information provided, the AI has recommended the following forms. 
              All required forms will be created automatically.
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* General Forms */}
            {formCategories.general.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center gap-2">
                    <Badge variant="outline" className="bg-slate-100">General</Badge>
                    Basic Information Forms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {formCategories.general.map(form => (
                      <li key={form.formNumber} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Form {form.formNumber}</span>
                            <span className="text-sm text-muted-foreground">
                              {form.formName}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {form.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            {/* Bankruptcy Forms */}
            {formCategories.bankruptcy.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Bankruptcy</Badge>
                    Bankruptcy Forms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {formCategories.bankruptcy.map(form => (
                      <li key={form.formNumber} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Form {form.formNumber}</span>
                            <span className="text-sm text-muted-foreground">
                              {form.formName}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {form.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            {/* Consumer Proposal Forms */}
            {formCategories.consumerProposal.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center gap-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Proposal</Badge>
                    Consumer Proposal Forms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {formCategories.consumerProposal.map(form => (
                      <li key={form.formNumber} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Form {form.formNumber}</span>
                            <span className="text-sm text-muted-foreground">
                              {form.formName}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {form.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
            
            {/* Business Forms */}
            {formCategories.business.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-md flex items-center gap-2">
                    <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Business</Badge>
                    Corporate Insolvency Forms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {formCategories.business.map(form => (
                      <li key={form.formNumber} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">Form {form.formNumber}</span>
                            <span className="text-sm text-muted-foreground">
                              {form.formName}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {form.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Automated Document Structure</CardTitle>
              <CardDescription>
                The following folder structure will be created automatically when you create this client.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 p-4 rounded-md text-sm font-mono">
                <p>📁 {clientName}</p>
                <p className="ml-4">├── 📂 Forms & Legal Filings</p>
                {recommendedForms.map(form => (
                  <p key={form.formNumber} className="ml-8">
                    ├── 📄 Form {form.formNumber} - {form.formName}
                  </p>
                ))}
                <p className="ml-4">├── 📂 Financial Documents</p>
                <p className="ml-8">├── 📑 Bank Statements</p>
                <p className="ml-8">├── 📑 Tax Returns & CRA Filings</p>
                <p className="ml-4">├── 📂 Client Communications</p>
                <p className="ml-4">├── 📂 Signed Documents</p>
                <p className="ml-4">└── 📂 Risk & Compliance Reports</p>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Forms Recommended</AlertTitle>
          <AlertDescription>
            No forms have been recommended yet. Please complete the client information and 
            run the AI analysis first.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
