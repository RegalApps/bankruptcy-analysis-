
import { createForm31DemoDocument, createForm31DemoAnalysis } from '@/components/DocumentViewer/utils/demoDocuments';
import { toast } from "sonner";

/**
 * Test function to verify Form 31 document rendering capabilities
 */
export const testForm31DocumentViewer = () => {
  try {
    // Generate demo document and analysis
    const documentId = "test-form31-" + Date.now();
    const demoDocument = createForm31DemoDocument(documentId);
    const demoAnalysis = createForm31DemoAnalysis(documentId);
    
    // Verify required document properties
    const requiredProperties = [
      'id', 'title', 'storage_path', 'metadata', 'deadlines', 'version'
    ];
    
    const missingProperties = requiredProperties.filter(prop => 
      demoDocument[prop] === undefined || demoDocument[prop] === null
    );
    
    if (missingProperties.length > 0) {
      console.error('Demo document missing required properties:', missingProperties);
      return {
        success: false,
        message: `Document missing required properties: ${missingProperties.join(', ')}`
      };
    }
    
    // Verify analysis content
    const analysisContent = demoAnalysis.content;
    if (!analysisContent.extracted_info || !analysisContent.risks || !analysisContent.regulatory_compliance) {
      console.error('Demo analysis missing required content sections');
      return {
        success: false,
        message: 'Analysis content incomplete'
      };
    }
    
    // Verify risks are properly defined
    const risks = analysisContent.risks;
    if (!Array.isArray(risks) || risks.length === 0) {
      console.error('No risks defined in analysis');
      return {
        success: false,
        message: 'No risks defined in analysis'
      };
    }
    
    // Check for essential risk properties
    const requiredRiskProperties = ['type', 'description', 'severity', 'regulation', 'solution'];
    const risksWithMissingProperties = risks.filter(risk => 
      requiredRiskProperties.some(prop => !risk[prop])
    );
    
    if (risksWithMissingProperties.length > 0) {
      console.error('Some risks missing required properties:', risksWithMissingProperties);
      return {
        success: false,
        message: `${risksWithMissingProperties.length} risks have incomplete information`
      };
    }
    
    // Verify BIA compliance references
    const regulatoryCompliance = analysisContent.regulatory_compliance;
    if (!regulatoryCompliance.references || regulatoryCompliance.references.length === 0) {
      console.error('No regulatory references defined');
      return {
        success: false, 
        message: 'BIA compliance references missing'
      };
    }
    
    // Test passed successfully
    console.log('Form 31 document and analysis validation successful!', {
      document: demoDocument,
      analysis: demoAnalysis
    });
    
    return {
      success: true,
      message: 'Form 31 document and analysis validation successful',
      document: demoDocument,
      analysis: demoAnalysis
    };
  } catch (error) {
    console.error('Error testing Form 31 document viewer:', error);
    return {
      success: false,
      message: `Test failed with error: ${error.message}`
    };
  }
};

/**
 * Run the Form 31 document test and display results in UI
 */
export const runForm31Test = () => {
  const startTime = performance.now();
  const result = testForm31DocumentViewer();
  const endTime = performance.now();
  
  if (result.success) {
    toast.success(`Form 31 test passed in ${Math.round(endTime - startTime)}ms`, {
      description: "All document properties and risk analysis validated successfully",
      duration: 5000
    });
    console.log('Form 31 test details:', result);
  } else {
    toast.error(`Form 31 test failed: ${result.message}`, {
      description: "See console for detailed error information",
      duration: 5000
    });
  }
  
  return result;
};
