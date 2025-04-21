
import { supabase } from "@/lib/supabase";

/**
 * Diagnostic utility for BIA system
 * Use this to check connections, test processing, and validate data structure
 */

// Test OpenAI API connectivity
export const testOpenAIConnection = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // We'll use our process-ai-request function to test OpenAI connectivity
    const { data, error } = await supabase.functions.invoke('process-ai-request', {
      body: { 
        message: "Test connection. Please respond with 'OpenAI connection successful'.",
        module: "system-test"
      }
    });

    if (error) {
      return { 
        success: false, 
        message: `OpenAI connection failed: ${error.message}` 
      };
    }

    return { 
      success: true, 
      message: "OpenAI connection successful" 
    };
  } catch (err: any) {
    console.error("OpenAI connection test failed:", err);
    return { 
      success: false, 
      message: `OpenAI connection test error: ${err.message}` 
    };
  }
};

// Test Supabase connectivity and permissions
export const testSupabaseConnection = async (): Promise<{ 
  success: boolean; 
  message: string;
  details?: { [key: string]: boolean }; 
}> => {
  try {
    const results = {
      documentsTableAccess: false,
      documentAnalysisTableAccess: false,
      storageAccess: false,
      functionAccess: false
    };

    // Test documents table access
    const { data: documentsData, error: documentsError } = await supabase
      .from('documents')
      .select('id')
      .limit(1);
    
    results.documentsTableAccess = !documentsError;

    // Test document_analysis table access
    const { data: analysisData, error: analysisError } = await supabase
      .from('document_analysis')
      .select('id')
      .limit(1);
    
    results.documentAnalysisTableAccess = !analysisError;

    // Test storage access (list buckets)
    const { data: storageData, error: storageError } = await supabase
      .storage
      .listBuckets();
    
    results.storageAccess = !storageError;

    // Test function access
    try {
      const { data: functionData, error: functionError } = await supabase.functions.invoke(
        'process-ai-request',
        { body: { message: 'test', module: 'test' } }
      );
      results.functionAccess = !functionError;
    } catch (err) {
      results.functionAccess = false;
    }

    // Determine overall status
    const allSuccess = Object.values(results).every(value => value);
    
    return {
      success: allSuccess,
      message: allSuccess 
        ? "All Supabase connections successful" 
        : "Some Supabase connections failed",
      details: results
    };
  } catch (err: any) {
    console.error("Supabase connection test failed:", err);
    return { 
      success: false, 
      message: `Supabase connection test error: ${err.message}` 
    };
  }
};

// Check document processing pipeline
export const testDocumentPipeline = async (documentId: string): Promise<{
  success: boolean;
  message: string;
  stages: {
    documentExists: boolean;
    documentHasStoragePath: boolean;
    fileAccessible: boolean;
    analysisExists: boolean;
    analysisComplete: boolean;
  };
  details?: any;
}> => {
  try {
    const stages = {
      documentExists: false,
      documentHasStoragePath: false,
      fileAccessible: false, 
      analysisExists: false,
      analysisComplete: false
    };
    
    let details = {};

    // Check if document exists
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError) {
      return {
        success: false,
        message: `Document lookup failed: ${docError.message}`,
        stages
      };
    }

    stages.documentExists = true;
    details = { ...details, document };

    // Check if document has a storage path
    if (!document.storage_path) {
      return {
        success: false,
        message: "Document exists but has no storage path",
        stages,
        details
      };
    }

    stages.documentHasStoragePath = true;

    // Check if file is accessible in storage
    try {
      const { data: fileData, error: fileError } = await supabase
        .storage
        .from('documents')
        .download(document.storage_path);

      if (fileError) {
        return {
          success: false,
          message: `File not accessible in storage: ${fileError.message}`,
          stages,
          details
        };
      }

      stages.fileAccessible = true;
    } catch (err: any) {
      return {
        success: false,
        message: `File access error: ${err.message}`,
        stages,
        details
      };
    }

    // Check if analysis exists
    const { data: analysis, error: analysisError } = await supabase
      .from('document_analysis')
      .select('*')
      .eq('document_id', documentId);

    if (analysisError) {
      return {
        success: false,
        message: `Analysis lookup failed: ${analysisError.message}`,
        stages,
        details
      };
    }

    if (!analysis || analysis.length === 0) {
      return {
        success: false,
        message: "No analysis found for this document",
        stages,
        details
      };
    }

    stages.analysisExists = true;
    details = { ...details, analysis: analysis[0] };

    // Check if analysis content is valid
    const analysisContent = analysis[0].content;
    if (!analysisContent) {
      return {
        success: false,
        message: "Analysis exists but has no content",
        stages,
        details
      };
    }

    // Check for required analysis components
    const hasExtractedInfo = !!analysisContent.extracted_info;
    const hasRisks = !!analysisContent.risks;
    
    if (!hasExtractedInfo || !hasRisks) {
      return {
        success: false,
        message: "Analysis content is missing required fields (extracted_info or risks)",
        stages,
        details: {
          ...details,
          hasExtractedInfo,
          hasRisks
        }
      };
    }

    stages.analysisComplete = true;

    return {
      success: true,
      message: "Document pipeline validation successful",
      stages,
      details
    };
  } catch (err: any) {
    console.error("Document pipeline test failed:", err);
    return {
      success: false, 
      message: `Document pipeline test error: ${err.message}`,
      stages: {
        documentExists: false,
        documentHasStoragePath: false,
        fileAccessible: false,
        analysisExists: false,
        analysisComplete: false
      }
    };
  }
};

// Validate BIA system data structure
export const validateDataStructure = async (): Promise<{
  success: boolean;
  message: string;
  tables: {
    documents: boolean;
    documentAnalysis: boolean;
  };
  columns: {
    documentsColumns: string[];
    analysisColumns: string[];
    missingRequired: string[];
  };
}> => {
  try {
    let tables = {
      documents: false,
      documentAnalysis: false
    };
    
    let columns = {
      documentsColumns: [] as string[],
      analysisColumns: [] as string[],
      missingRequired: [] as string[]
    };

    // Check documents table
    const { data: documents, error: docsError } = await supabase
      .from('documents')
      .select('*')
      .limit(1);
    
    if (docsError) {
      return {
        success: false,
        message: `Documents table check failed: ${docsError.message}`,
        tables,
        columns
      };
    }
    
    tables.documents = true;
    
    // Check document_analysis table
    const { data: analysis, error: analysisError } = await supabase
      .from('document_analysis')
      .select('*')
      .limit(1);
    
    if (analysisError) {
      return {
        success: false,
        message: `Document analysis table check failed: ${analysisError.message}`,
        tables,
        columns
      };
    }
    
    tables.documentAnalysis = true;
    
    // Check columns in documents table
    if (documents && documents.length > 0) {
      columns.documentsColumns = Object.keys(documents[0] || {});
      
      // Check for required columns
      const requiredDocumentColumns = ['id', 'storage_path', 'ai_processing_status', 'metadata'];
      const missingDocColumns = requiredDocumentColumns.filter(col => !columns.documentsColumns.includes(col));
      
      if (missingDocColumns.length > 0) {
        columns.missingRequired.push(...missingDocColumns.map(col => `documents.${col}`));
      }
    }
    
    // Check columns in document_analysis table
    if (analysis && analysis.length > 0) {
      columns.analysisColumns = Object.keys(analysis[0] || {});
      
      // Check for required columns
      const requiredAnalysisColumns = ['id', 'document_id', 'content'];
      const missingAnalysisColumns = requiredAnalysisColumns.filter(col => !columns.analysisColumns.includes(col));
      
      if (missingAnalysisColumns.length > 0) {
        columns.missingRequired.push(...missingAnalysisColumns.map(col => `document_analysis.${col}`));
      }
    }
    
    const success = tables.documents && tables.documentAnalysis && columns.missingRequired.length === 0;
    
    return {
      success,
      message: success ? 
        "Data structure validation successful" : 
        "Data structure validation failed",
      tables,
      columns
    };
  } catch (err: any) {
    console.error("Data structure validation failed:", err);
    return {
      success: false,
      message: `Data structure validation error: ${err.message}`,
      tables: {
        documents: false,
        documentAnalysis: false
      },
      columns: {
        documentsColumns: [],
        analysisColumns: [],
        missingRequired: []
      }
    };
  }
};

// Run full system diagnostics
export const runFullSystemDiagnostics = async (sampleDocumentId?: string): Promise<{
  success: boolean;
  message: string;
  results: {
    openai: { success: boolean; message: string };
    supabase: { success: boolean; message: string; details?: any };
    dataStructure: { success: boolean; message: string; tables: any; columns: any };
    pipeline?: { success: boolean; message: string; stages: any; details?: any };
  };
}> => {
  try {
    // Test OpenAI connection
    const openaiTest = await testOpenAIConnection();
    
    // Test Supabase connection
    const supabaseTest = await testSupabaseConnection();
    
    // Test data structure
    const dataStructureTest = await validateDataStructure();
    
    // Test document pipeline if sample document provided
    const pipelineTest = sampleDocumentId ? 
      await testDocumentPipeline(sampleDocumentId) : 
      undefined;
    
    // Determine overall success
    const coreSuccess = openaiTest.success && supabaseTest.success && dataStructureTest.success;
    const pipelineSuccess = pipelineTest ? pipelineTest.success : true;
    const success = coreSuccess && pipelineSuccess;
    
    return {
      success,
      message: success ? 
        "All diagnostic tests passed successfully" : 
        "Some diagnostic tests failed",
      results: {
        openai: openaiTest,
        supabase: supabaseTest,
        dataStructure: dataStructureTest,
        pipeline: pipelineTest
      }
    };
  } catch (err: any) {
    console.error("Full system diagnostics failed:", err);
    return {
      success: false,
      message: `System diagnostic error: ${err.message}`,
      results: {
        openai: { success: false, message: "Test failed due to an error" },
        supabase: { success: false, message: "Test failed due to an error" },
        dataStructure: { 
          success: false, 
          message: "Test failed due to an error",
          tables: { documents: false, documentAnalysis: false },
          columns: { documentsColumns: [], analysisColumns: [], missingRequired: [] }
        }
      }
    };
  }
};
