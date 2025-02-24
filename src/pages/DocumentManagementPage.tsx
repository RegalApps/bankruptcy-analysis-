
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useDocuments } from "@/components/DocumentList/hooks/useDocuments";
import { Document } from "@/components/DocumentList/types";
import { useNavigate } from "react-router-dom";

export const DocumentManagementPage = () => {
  const { documents, isLoading } = useDocuments();
  const navigate = useNavigate();

  const handleDocumentDoubleClick = (documentId: string) => {
    navigate('/', { state: { selectedDocument: documentId } });
  };

  return (
    <div className="flex-1 p-6 space-y-8">
      {/* Drag and Drop Upload Area */}
      <Card className="border-2 border-dashed hover:border-primary/50 transition-colors">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center cursor-pointer">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // Handle file upload
              }
            }}
          />
          <div 
            onClick={() => document.getElementById('file-upload')?.click()}
            className="w-full"
          >
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Drag and drop your documents here
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              or click to browse your files
            </p>
            <Button variant="outline">
              Browse Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recently Uploaded Documents */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Recently Uploaded</h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse h-[200px]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {documents.map((doc: Document) => (
              <Card 
                key={doc.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onDoubleClick={() => handleDocumentDoubleClick(doc.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium truncate" title={doc.title}>
                        {doc.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(doc.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="mt-1"
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default DocumentManagementPage;
