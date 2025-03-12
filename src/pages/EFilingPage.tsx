
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, CheckCircle, Clock, FileText, Upload } from 'lucide-react';
import { DocumentSearch } from '@/components/e-filing/DocumentSearch';
import { ValidationStatusAlert } from '@/components/e-filing/components/ValidationStatusAlert';
import { Document } from '@/components/DocumentList/types';
import { useNavigate } from 'react-router-dom';

export const EFilingPage = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isValidated, setIsValidated] = useState(false);
  const navigate = useNavigate();

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
    setIsValidated(false);
  };

  const handleValidate = () => {
    // In a real app, this would be an actual validation process
    // For demo purposes, we'll just set it to true after a delay
    setTimeout(() => {
      setIsValidated(true);
    }, 1500);
  };

  const handleViewAuditTrail = () => {
    navigate('/e-filing/audit-trail');
  };

  const recentFilings = [
    {
      id: '1',
      title: 'Form 76 - John Smith',
      status: 'completed',
      date: 'Mar 15, 2025',
      court: 'Ontario Superior Court'
    },
    {
      id: '2',
      title: 'Tax Filing - ABC Corp',
      status: 'pending',
      date: 'Mar 12, 2025',
      court: 'Tax Court of Canada'
    },
    {
      id: '3',
      title: 'Bankruptcy Form 31 - Jane Doe',
      status: 'completed',
      date: 'Mar 10, 2025',
      court: 'Ontario Superior Court'
    }
  ];

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">E-Filing Portal</h1>
            <p className="text-muted-foreground mt-1">
              Prepare, validate and submit court documents electronically
            </p>
          </div>
          <Button onClick={handleViewAuditTrail} variant="outline" className="gap-2">
            <Clock className="h-4 w-4" />
            View Audit Trail
          </Button>
        </div>

        <Tabs defaultValue="new-filing" className="space-y-4">
          <TabsList>
            <TabsTrigger value="new-filing">New Filing</TabsTrigger>
            <TabsTrigger value="recent">Recent Filings</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="new-filing" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Select Document</CardTitle>
                  <CardDescription>
                    Choose a document from your files to e-file
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentSearch onDocumentSelect={handleDocumentSelect} />
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Filing Details</CardTitle>
                  <CardDescription>
                    Document information and filing status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedDocument ? (
                    <>
                      <div className="p-4 border rounded-lg bg-slate-50">
                        <div className="flex items-center gap-3 mb-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <h3 className="font-medium">{selectedDocument.title}</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">File Type</p>
                            <p className="font-medium">{selectedDocument.type}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Size</p>
                            <p className="font-medium">{selectedDocument.size} MB</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Created</p>
                            <p className="font-medium">{new Date(selectedDocument.created_at).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Last Modified</p>
                            <p className="font-medium">{new Date(selectedDocument.updated_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>

                      {isValidated && (
                        <ValidationStatusAlert isValid={true} />
                      )}
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="font-medium text-lg mb-1">No Document Selected</h3>
                      <p className="text-muted-foreground max-w-md">
                        Please select a document from the list on the left to begin the e-filing process
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" disabled={!selectedDocument}>
                    Select Different Document
                  </Button>
                  <div className="space-x-2">
                    <Button 
                      onClick={handleValidate} 
                      disabled={!selectedDocument || isValidated}
                    >
                      Validate Document
                    </Button>
                    <Button 
                      className="gap-2"
                      disabled={!selectedDocument || !isValidated}
                    >
                      Submit Filing
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Recent Filings</CardTitle>
                <CardDescription>
                  View and manage your recent court filings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentFilings.map((filing) => (
                    <div key={filing.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{filing.title}</p>
                          <p className="text-sm text-muted-foreground">{filing.court} • {filing.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {filing.status === 'completed' ? (
                          <div className="flex items-center text-green-600 gap-1">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Filed</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-600 gap-1">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm font-medium">Pending</span>
                          </div>
                        )}
                        <Button variant="ghost" size="sm" className="ml-4">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates">
            <Card>
              <CardHeader>
                <CardTitle>Filing Templates</CardTitle>
                <CardDescription>
                  Use saved templates to speed up your filing process
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Bankruptcy Form', 'Small Claims', 'Tax Court Filing'].map((template, i) => (
                    <Card key={i} className="cursor-pointer hover:border-primary transition-colors">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">{template}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Pre-configured template with all required fields
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" size="sm" className="gap-2">
                          Use Template
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};
