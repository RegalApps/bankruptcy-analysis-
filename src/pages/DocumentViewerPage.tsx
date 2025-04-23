import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import EnhancedDocumentViewer from "@/components/DocumentViewer/EnhancedDocumentViewer";
import { toast } from "sonner";
import { getDocumentById } from "@/utils/documentOperations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import logger from '@/utils/logger';

// Define the BankruptcyAnalysisResult interface
interface BankruptcyAnalysisResult {
  formType: string;
  keyFields: Record<string, string>;
  missingFields: string[];
  validationIssues: string[];
  riskLevel: 'low' | 'medium' | 'high';
  narrative: string;
}

const DocumentViewerPage = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<any>(null);
  const [analysis, setAnalysis] = useState<BankruptcyAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [documentNotFound, setDocumentNotFound] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let loadingTimeout: NodeJS.Timeout;

    const fetchDocument = async () => {
      try {
        const doc = await getDocumentById(documentId);
        
        if (!isMounted) return;
        
        if (!doc) {
          setDocumentNotFound(true);
          setLoading(false);
        } else {
          setDocument(doc);
          setAnalysis(doc.analysis);
          setLoading(false);
        }
      } catch (error) {
        if (!isMounted) return;
        
        logger.error("Error fetching document:", error);
        setDocumentNotFound(true);
        setLoading(false);
      }
    };

    // Set a timeout to prevent infinite loading
    loadingTimeout = setTimeout(() => {
      if (isMounted && loading) {
        logger.warn("Document loading timed out");
        setDocumentNotFound(true);
        setLoading(false);
      }
    }, 10000); // 10 second timeout

    fetchDocument();

    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
    };
  }, [documentId]);

  const handleBackClick = () => {
    navigate('/documents');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <Button variant="ghost" onClick={handleBackClick}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Documents
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-lg">Loading document...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (documentNotFound) {
    return (
      <MainLayout>
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <Button variant="ghost" onClick={handleBackClick}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Documents
            </Button>
          </div>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <h2 className="text-2xl font-bold mb-4">Document Not Found</h2>
                <p className="mb-6 text-muted-foreground">The document you're looking for doesn't exist or has been removed.</p>
                <Button onClick={handleBackClick}>Return to Documents</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleBackClick} className="mr-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">{document?.title}</h1>
          {analysis && (
            <Badge 
              className="ml-4" 
              variant={analysis.riskLevel === 'high' ? 'destructive' : 
                      analysis.riskLevel === 'medium' ? 'warning' : 'outline'}
            >
              {analysis.riskLevel.toUpperCase()} RISK
            </Badge>
          )}
        </div>

        <Tabs defaultValue="analysis" className="w-full">
          <TabsList>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
            <TabsTrigger value="document">Document</TabsTrigger>
          </TabsList>
          
          <TabsContent value="analysis">
            {analysis ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="col-span-1 md:col-span-3">
                  <CardHeader>
                    <CardTitle>{analysis.formType}</CardTitle>
                    <CardDescription>Bankruptcy Form Analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg mb-4">{analysis.narrative}</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Key Fields</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(analysis.keyFields).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span>{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Missing Fields</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysis.missingFields.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {analysis.missingFields.map((field, index) => (
                          <li key={index}>{field}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No missing fields detected.</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Validation Issues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {analysis.validationIssues.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {analysis.validationIssues.map((issue, index) => (
                          <li key={index}>{issue}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No validation issues detected.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Analysis Available</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>No bankruptcy form analysis is available for this document.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="document">
            <Card>
              <CardContent className="p-0">
                <div className="h-[800px] w-full">
                  <EnhancedDocumentViewer 
                    document={document} 
                    analysis={analysis}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default DocumentViewerPage;
