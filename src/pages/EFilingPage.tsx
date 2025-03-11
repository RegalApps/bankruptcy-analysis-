
import { useState } from "react";
import { FileCheck, History } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Document } from "@/components/DocumentList/types";
import { ValidationStatusAlert } from "@/components/e-filing/components/ValidationStatusAlert";
import { DocumentSearch } from "@/components/e-filing/DocumentSearch";
import { RiskAssessment } from "@/components/e-filing/RiskAssessment";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export const EFilingPage = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isValidated, setIsValidated] = useState(false);

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
    setIsValidated(false);
    toast.success("Document selected for e-filing");
  };

  const handleValidationComplete = (isValid: boolean) => {
    setIsValidated(isValid);
    if (isValid) {
      toast.success("Document validation complete");
    }
  };

  const handleEFile = () => {
    // Redirect to SSO login page
    window.location.href = "https://sso.ised-isde.canada.ca/auth/realms/individual/protocol/openid-connect/auth?response_type=code&client_id=osb-ef&redirect_uri=https%3A%2F%2Fwww.ic.gc.ca%2Fapp%2Fscr%2Fosbeftr%2Fapp%2Fsso%2Flogin&state=b0b0bc06-3b9b-4c67-a26f-b9b4bda7520f&login=true&ui_locales=en&scope=openid";
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold">E-Filing</h1>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="flex items-center gap-2"
            >
              <Link to="/e-filing/audit-trail">
                <History className="h-4 w-4" />
                Audit Trail
              </Link>
            </Button>
            <Button 
              size="lg"
              disabled={!isValidated || !selectedDocument}
              onClick={handleEFile}
              className="gradient-button"
            >
              E-File
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Document Search */}
          <Card>
            <CardHeader>
              <CardTitle>Document Search & Selection</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentSearch onDocumentSelect={handleDocumentSelect} />
            </CardContent>
          </Card>

          {/* Right Column - Risk Assessment */}
          <div className="space-y-6">
            <RiskAssessment 
              document={selectedDocument}
              onValidationComplete={handleValidationComplete}
            />

            {isValidated && (
              <Card>
                <CardContent className="pt-6">
                  <ValidationStatusAlert isValid={isValidated} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EFilingPage;
