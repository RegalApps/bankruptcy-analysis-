import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getDocumentSummary } from '@/utils/documentSummaries';

interface ComprehensiveSummaryProps {
  formType: string;
}

/**
 * Component that displays a button to open a comprehensive document summary
 * This is separate from the JSON mapping analysis and provides detailed assessment
 * for specific form types.
 */
export const ComprehensiveSummary: React.FC<ComprehensiveSummaryProps> = ({ formType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const summaryText = getDocumentSummary(formType);

  // If there's no summary for this form type, don't render anything
  if (!summaryText) {
    return null;
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setIsOpen(true)}
        className="mr-2"
      >
        <FileText className="h-4 w-4 mr-2" />
        Document Summary
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Comprehensive Document Assessment</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <pre className="text-sm whitespace-pre-wrap font-sans">
              {summaryText}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
