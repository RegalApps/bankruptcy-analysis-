
import { useState } from "react";
import { FileCheck, History, AlertTriangle, Activity, FileText, Download, Shield, Calendar, Clock, CheckCircle } from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Document } from "@/components/DocumentList/types";
import { ValidationStatusAlert } from "@/components/e-filing/components/ValidationStatusAlert";
import { DocumentSearch } from "@/components/e-filing/DocumentSearch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "@/components/ui/metadata";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export const EFilingPage = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isValidated, setIsValidated] = useState(false);
  const [activeTab, setActiveTab] = useState("documents");
  const [complianceScore, setComplianceScore] = useState(87);

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
    toast.success("E-Filing process initiated");
    // In a real app, this would redirect to an SSO login or process the filing
  };

  const metadataItems = [
    { label: "Compliance Score", value: `${complianceScore}%` },
    { label: "Last Audit", value: "Today, 2:15 PM" },
    { label: "Documents Ready", value: "17" },
    { label: "Pending Actions", value: "3" },
  ];

  const recentActivities = [
    { id: 1, user: "Sarah Johnson", action: "upload", document: "Form 47", time: "10 minutes ago" },
    { id: 2, user: "Michael Chen", action: "edit", document: "Client Statement", time: "1 hour ago" },
    { id: 3, user: "David Wilson", action: "download", document: "Annual Report", time: "3 hours ago" },
    { id: 4, user: "Jennifer Lee", action: "share", document: "Tax Documents", time: "Yesterday" },
  ];

  const getActionIcon = (action: string) => {
    switch (action) {
      case "upload": return FileText;
      case "edit": return Activity;
      case "download": return Download;
      case "share": return Shield;
      default: return Activity;
    }
  };

  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold">E-Filing Dashboard</h1>
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
              E-File Now
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current Score</span>
                  <span className="text-sm font-medium">{complianceScore}%</span>
                </div>
                <Progress value={complianceScore} className="h-2" />
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                  <span>Last verified: Today at 10:30 AM</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Annual Filing</span>
                  <Badge variant="outline" className="text-xs">7 days left</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tax Return</span>
                  <Badge variant="outline" className="text-xs">14 days left</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {recentActivities.slice(0, 2).map((activity) => {
                  const ActionIcon = getActionIcon(activity.action);
                  return (
                    <div key={activity.id} className="flex items-center gap-2">
                      <ActionIcon className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{activity.user} {activity.action}ed {activity.document}</span>
                    </div>
                  );
                })}
                <Button variant="link" className="text-xs p-0 h-auto" asChild>
                  <Link to="/e-filing/audit-trail">View all activity</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Metadata Summary */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <Metadata items={metadataItems} />
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="validation">Validation</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="history">Filing History</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Document Selection</CardTitle>
                  <CardDescription>
                    Search and select documents for e-filing
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentSearch onDocumentSelect={handleDocumentSelect} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Selected Document</CardTitle>
                  <CardDescription>
                    Document details and validation status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedDocument ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Document Name</span>
                          <span className="text-sm">{selectedDocument.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Type</span>
                          <span className="text-sm">{selectedDocument.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Size</span>
                          <span className="text-sm">2.4 MB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Last Modified</span>
                          <span className="text-sm">Today, 10:30 AM</span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button 
                          onClick={() => handleValidationComplete(true)} 
                          className="w-full"
                        >
                          Validate Document
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] text-center">
                      <FileText className="h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Document Selected</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Select a document from the list to view details
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {isValidated && (
              <Card>
                <CardContent className="pt-6">
                  <ValidationStatusAlert isValid={isValidated} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="validation">
            <Card>
              <CardHeader>
                <CardTitle>Document Validation</CardTitle>
                <CardDescription>
                  Validate documents for compliance and e-filing readiness
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium">Validation Information</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        All documents must pass validation checks before they can be e-filed
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Validation Checks</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm">Format Compliance</span>
                        </div>
                        <Badge variant="outline" className="bg-green-50">Passed</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm">Required Fields</span>
                        </div>
                        <Badge variant="outline" className="bg-green-50">Passed</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                          <span className="text-sm">Signatures</span>
                        </div>
                        <Badge variant="outline" className="bg-green-50">Passed</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded-md">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
                          <span className="text-sm">Regulatory Check</span>
                        </div>
                        <Badge variant="outline" className="bg-amber-50">Warning</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security & Compliance</CardTitle>
                <CardDescription>
                  Information about document security and compliance features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Document Security</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg bg-gray-50">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <Shield className="h-4 w-4 text-primary" />
                          Encryption
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          AES-256 encryption at rest and TLS 1.3 in transit
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg bg-gray-50">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <Activity className="h-4 w-4 text-primary" />
                          Audit Trail
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Immutable blockchain-verified audit records
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Compliance Features</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium">Role-Based Access Control</span>
                          <p className="text-xs text-muted-foreground">
                            Ensures only authorized individuals can access sensitive documents
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium">Multi-Factor Authentication</span>
                          <p className="text-xs text-muted-foreground">
                            Additional security layer for sensitive operations
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                        <div>
                          <span className="text-sm font-medium">Digital Signatures</span>
                          <p className="text-xs text-muted-foreground">
                            Cryptographically secure signatures for document validation
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>E-Filing History</CardTitle>
                <CardDescription>
                  Past e-filing submissions and their statuses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">Annual Report 2025</h3>
                          <p className="text-xs text-muted-foreground">Submitted March 10, 2025</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>
                      </div>
                      <div className="mt-4 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Confirmation Number</span>
                          <span className="font-medium">FIL-2025-0342</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>Processed By</span>
                          <span className="font-medium">Michael Chen</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>Verified</span>
                          <span className="font-medium">Yes (Blockchain)</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <Button variant="outline" size="sm" className="text-xs h-7">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-7 ml-2">
                          Download Receipt
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border">
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-medium">Tax Filing Q4 2024</h3>
                          <p className="text-xs text-muted-foreground">Submitted January 15, 2025</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>
                      </div>
                      <div className="mt-4 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Confirmation Number</span>
                          <span className="font-medium">FIL-2025-0127</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>Processed By</span>
                          <span className="font-medium">Sarah Johnson</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span>Verified</span>
                          <span className="font-medium">Yes (Blockchain)</span>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t">
                        <Button variant="outline" size="sm" className="text-xs h-7">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs h-7 ml-2">
                          Download Receipt
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Secure footer - Could be a component in a real implementation */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>SecureFiles AI E-Filing System v1.2.4 • ISO 27001 Certified • SOC 2 Compliant • GDPR Ready</p>
          <p className="mt-1">Data encrypted at rest with AES-256 • All transmissions protected with TLS 1.3</p>
          <p className="mt-1">© 2025 SecureFiles AI • All actions are immutably logged and blockchain verified</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default EFilingPage;
