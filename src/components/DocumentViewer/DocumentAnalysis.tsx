
import React from 'react';
import { DocumentDetails } from './types';

interface DocumentAnalysisProps {
  document: DocumentDetails | null;
  onRefreshAnalysis: () => void;
}

export const DocumentAnalysis: React.FC<DocumentAnalysisProps> = ({ 
  document, 
  onRefreshAnalysis 
}) => {
  if (!document) {
    return (
      <div className="p-4 text-center">
        <p className="text-muted-foreground">No document selected</p>
      </div>
    );
  }

  // Basic analysis display - can be enhanced as needed
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Document Analysis</h3>
        <button 
          onClick={onRefreshAnalysis}
          className="text-sm text-primary hover:underline"
        >
          Refresh Analysis
        </button>
      </div>

      {document.analysis && document.analysis.length > 0 ? (
        <div className="space-y-4">
          {document.analysis.map((analysis, index) => (
            <div key={index} className="border rounded-md p-4">
              <h4 className="font-medium mb-2">Extracted Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {Object.entries(analysis.content.extracted_info).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex flex-col">
                      <span className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span>{value}</span>
                    </div>
                  )
                ))}
              </div>

              {analysis.content.risks.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Identified Risks</h4>
                  <div className="space-y-2">
                    {analysis.content.risks.map((risk, riskIndex) => (
                      <div key={riskIndex} className="border-l-4 border-yellow-500 pl-3 py-2">
                        <div className="font-medium">{risk.type}</div>
                        <div className="text-sm text-muted-foreground">{risk.description}</div>
                        <div className="mt-1 text-xs">
                          <span className={`inline-block px-2 py-1 rounded ${
                            risk.severity === 'high' ? 'bg-red-100 text-red-800' :
                            risk.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {risk.severity} severity
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 border border-dashed rounded-md">
          <p className="text-muted-foreground mb-2">No analysis data available</p>
          <button 
            onClick={onRefreshAnalysis}
            className="text-sm px-3 py-1 bg-primary text-primary-foreground rounded-md"
          >
            Generate Analysis
          </button>
        </div>
      )}
    </div>
  );
};
