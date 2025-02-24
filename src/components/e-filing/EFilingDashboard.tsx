
import { Card } from "@/components/ui/card";
import { DocumentUpload } from "@/components/FileUpload";
import { DocumentList } from "./DocumentList";
import { DocumentDetails } from "./DocumentDetails";
import { useEFiling } from "./context/EFilingContext";

export const EFilingDashboard = () => {
  const { selectedDocument } = useEFiling();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">E-Filing Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Document List Section */}
        <Card className="md:col-span-2 p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Documents</h2>
            <DocumentUpload onUploadComplete={() => {}} />
            <DocumentList />
          </div>
        </Card>

        {/* Document Details Section */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            {selectedDocument ? "Document Details" : "Select a Document"}
          </h2>
          <DocumentDetails />
        </Card>
      </div>
    </div>
  );
};
