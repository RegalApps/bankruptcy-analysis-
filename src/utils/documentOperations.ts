
import { supabase } from "@/lib/supabase";
import logger from "@/utils/logger";

/**
 * Uploads a document to storage and creates a database record
 */
export const uploadDocument = async (file: File) => {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      throw new Error('Authentication required to upload documents');
    }
    
    // Generate a unique file path
    const fileExt = file.name.split('.').pop();
    const userId = userData.user.id;
    const uuid = crypto.randomUUID();
    const filePath = `${userId}/${uuid}/${file.name}`;
    
    logger.info(`Uploading file ${file.name} to path ${filePath}`);
    
    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false
      });
    
    if (uploadError) throw uploadError;
    
    logger.info(`Upload successful, creating database record`);
    
    // Create document record
    const { data: documentData, error: insertError } = await supabase
      .from('documents')
      .insert([
        {
          title: file.name,
          type: file.type,
          size: file.size,
          storage_path: filePath,
          user_id: userId,
          metadata: {
            original_filename: file.name,
            upload_timestamp: new Date().toISOString()
          },
          ai_processing_status: 'pending'
        }
      ])
      .select()
      .single();
    
    if (insertError) throw insertError;
    
    logger.info(`Document record created with id: ${documentData.id}`);
    
    // If it's a form file, try to extract form number from filename for metadata
    const lcFileName = file.name.toLowerCase();
    let formType = null;
    
    if (lcFileName.includes('form 31') || lcFileName.includes('form31') || lcFileName.includes('proof of claim')) {
      formType = 'form-31';
    } else if (lcFileName.includes('form 47') || lcFileName.includes('form47') || lcFileName.includes('consumer proposal')) {
      formType = 'form-47';
    } else if (lcFileName.includes('form 65') || lcFileName.includes('form65') || lcFileName.includes('notice of intention')) {
      formType = 'form-65';
    } else if (lcFileName.includes('form 76') || lcFileName.includes('form76') || lcFileName.includes('assignment')) {
      formType = 'form-76';
    }
    
    if (formType) {
      logger.info(`Detected form type: ${formType}`);
      
      // Update document with form type
      await supabase
        .from('documents')
        .update({
          metadata: {
            ...documentData.metadata,
            formType,
            form_detection_method: 'filename_analysis'
          }
        })
        .eq('id', documentData.id);
    }
    
    // If it's form 47, create a risk assessment (for demo purposes)
    if (formType === 'form-47' || lcFileName.includes('form 47') || lcFileName.includes('form47')) {
      logger.info(`Creating Form 47 risk assessment`);
      
      // This is imported from your utility file
      const { createForm47RiskAssessment } = await import('./documents/documentOperations');
      await createForm47RiskAssessment(documentData.id);
      
      logger.info(`Form 47 risk assessment created`);
    } else {
      // For other document types, trigger document analysis via edge function
      try {
        logger.info(`Downloading file to analyze content`);
        
        // Download the file content
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('documents')
          .download(filePath);
          
        if (downloadError) throw downloadError;
        
        // Convert to text
        const text = await fileData.text();
        
        logger.info(`File downloaded, sending to analysis service`);
        
        // Call the edge function to analyze the document
        await supabase.functions.invoke('process-ai-request', {
          body: {
            message: text,
            documentId: documentData.id,
            module: "document-analysis",
            formType: formType,
            title: file.name
          }
        });
        
        logger.info(`Analysis request sent successfully`);
      } catch (analysisError) {
        // Log error but don't fail upload
        logger.error(`Error initiating document analysis:`, analysisError);
      }
    }
    
    // Create notification
    await supabase.functions.invoke('handle-notifications', {
      body: {
        action: 'create',
        userId: userId,
        notification: {
          title: 'Document Uploaded Successfully',
          message: `"${file.name}" has been uploaded and is being analyzed`,
          type: 'info',
          category: 'file_activity',
          priority: 'normal',
          action_url: `/documents/${documentData.id}`,
          metadata: {
            documentId: documentData.id,
            fileName: file.name,
            fileSize: file.size
          }
        }
      }
    }).catch(e => console.error('Error creating notification:', e));
    
    return documentData;
  } catch (error) {
    logger.error('Document upload error:', error);
    throw error;
  }
};

/**
 * Creates a detailed risk assessment for Form 47 Consumer Proposal documents
 * @param documentId The document ID to create the risk assessment for
 */
export const createForm47RiskAssessment = async (documentId: string): Promise<void> => {
  try {
    // Get existing analysis record if any
    const { data: existingAnalysis } = await supabase
      .from('document_analysis')
      .select('*')
      .eq('document_id', documentId)
      .maybeSingle();
    
    // Get current user
    const { data: userData } = await supabase.auth.getUser();
    
    // Prepare Form 47-specific detailed risks based on BIA requirements
    const form47Risks = [
      {
        type: "compliance",
        description: "Secured Creditors Payment Terms Missing",
        severity: "high",
        regulation: "BIA Section 66.13(2)(c)",
        impact: "Non-compliance with BIA Sec. 66.13(2)(c)",
        requiredAction: "Specify how secured debts will be paid",
        solution: "Add detailed payment terms for secured creditors",
        deadline: "Immediately"
      },
      {
        type: "compliance",
        description: "Unsecured Creditors Payment Plan Not Provided",
        severity: "high",
        regulation: "BIA Section 66.14",
        impact: "Proposal will be invalid under BIA Sec. 66.14",
        requiredAction: "Add a structured payment plan for unsecured creditors",
        solution: "Create detailed payment schedule for unsecured creditors",
        deadline: "Immediately"
      },
      {
        type: "compliance",
        description: "No Dividend Distribution Schedule",
        severity: "high",
        regulation: "BIA Section 66.15",
        impact: "Fails to meet regulatory distribution rules",
        requiredAction: "Define how funds will be distributed among creditors",
        solution: "Add dividend distribution schedule with percentages and timeline",
        deadline: "Immediately"
      },
      {
        type: "compliance",
        description: "Administrator Fees & Expenses Not Specified",
        severity: "medium",
        regulation: "OSB Directive",
        impact: "Can delay approval from the Office of the Superintendent of Bankruptcy (OSB)",
        requiredAction: "Detail administrator fees to meet regulatory transparency",
        solution: "Specify administrator fees and expenses with breakdown",
        deadline: "3 days"
      },
      {
        type: "legal",
        description: "Proposal Not Signed by Witness",
        severity: "medium",
        regulation: "BIA Requirement",
        impact: "May cause legal delays",
        requiredAction: "Ensure a witness signs before submission",
        solution: "Obtain witness signature on proposal document",
        deadline: "3 days"
      },
      {
        type: "compliance",
        description: "No Additional Terms Specified",
        severity: "low",
        regulation: "BIA Best Practice",
        impact: "Could be required for unique creditor terms",
        requiredAction: "Add custom clauses if applicable",
        solution: "Review if additional terms are needed for special cases",
        deadline: "5 days"
      },
      {
        type: "financial",
        description: "Surplus Income Calculation Missing",
        severity: "high",
        regulation: "BIA Directive No. 6R3",
        impact: "Cannot determine if proposal payments meet minimum requirements",
        requiredAction: "Calculate surplus income according to Directive 6R3",
        solution: "Add detailed surplus income calculation with OSB thresholds",
        deadline: "Immediate"
      },
      {
        type: "documentation",
        description: "Missing Income & Expense Documentation",
        severity: "medium",
        regulation: "Form 47 Requirements",
        impact: "Cannot verify financial disclosure accuracy",
        requiredAction: "Attach supporting documents for income/expenses",
        solution: "Include pay stubs, bank statements, and expense receipts",
        deadline: "5 days"
      },
      {
        type: "compliance",
        description: "Incomplete Statement of Affairs",
        severity: "high",
        regulation: "BIA s. 66.13",
        impact: "Proposal may be rejected for incomplete disclosure",
        requiredAction: "Complete all sections of the Statement of Affairs",
        solution: "Review and complete all asset and liability sections",
        deadline: "Immediate"
      },
      {
        type: "legal",
        description: "No Sworn Declaration",
        severity: "high",
        regulation: "BIA Rule 47",
        impact: "Document lacks legal validity without oath",
        requiredAction: "Ensure form is properly sworn",
        solution: "Have document sworn before trustee or commissioner",
        deadline: "Immediate"
      }
    ];

    // Add detailed Form 47 client information
    const clientInfo = {
      clientName: "Josh Hart",
      administratorName: "Tom Francis",
      filingDate: "February 1, 2025",
      submissionDeadline: "March 3, 2025",
      documentStatus: "Draft - Pending Review",
      formType: "form-47",
      formNumber: "47",
      summary: "Consumer Proposal (Form 47) submitted by Josh Hart under Paragraph 66.13(2)(c) of the BIA"
    };

    // Update or create the analysis record with Form 47 risks
    if (existingAnalysis) {
      // Add Form 47 risks to existing risks
      const existingContent = existingAnalysis.content || {};
      const existingRisks = existingContent.risks || [];
      
      const updatedContent = {
        ...existingContent,
        extracted_info: {
          ...(existingContent.extracted_info || {}),
          ...clientInfo
        },
        risks: [...existingRisks, ...form47Risks],
        regulatory_compliance: {
          status: 'requires_review',
          details: 'Form 47 Consumer Proposal requires detailed review for regulatory compliance',
          references: [
            'BIA Section 66.13(2)(c)', 
            'BIA Section 66.14', 
            'BIA Section 66.15', 
            'OSB Directive on Consumer Proposals',
            'Directive No. 6R3 - Surplus Income',
            'Rule 47 - Prescribed Forms'
          ]
        },
        form47_specific_analysis: {
          surplus_income_status: 'requires_calculation',
          proposal_payment_adequacy: 'requires_verification',
          assets_vs_proposal_value: 'requires_comparison',
          oath_status: 'requires_verification',
          supporting_documents: 'requires_review'
        }
      };
      
      await supabase
        .from('document_analysis')
        .update({ content: updatedContent })
        .eq('document_id', documentId);
        
      console.log('Updated existing analysis with Form 47 risks and client info');
    } else {
      // Create new analysis record with Form 47 risks
      await supabase
        .from('document_analysis')
        .insert({
          document_id: documentId,
          user_id: userData.user?.id,
          content: {
            extracted_info: clientInfo,
            risks: form47Risks,
            summary: clientInfo.summary,
            regulatory_compliance: {
              status: 'requires_review',
              details: 'Form 47 Consumer Proposal requires detailed review for regulatory compliance',
              references: [
                'BIA Section 66.13(2)(c)', 
                'BIA Section 66.14', 
                'BIA Section 66.15', 
                'OSB Directive on Consumer Proposals',
                'Directive No. 6R3 - Surplus Income',
                'Rule 47 - Prescribed Forms'
              ]
            },
            form47_specific_analysis: {
              surplus_income_status: 'requires_calculation',
              proposal_payment_adequacy: 'requires_verification',
              assets_vs_proposal_value: 'requires_comparison',
              oath_status: 'requires_verification',
              supporting_documents: 'requires_review'
            }
          }
        });
        
      console.log('Created new analysis with Form 47 risks and client info');
    }
    
    // Update document metadata with Form 47 specific details
    await supabase
      .from('documents')
      .update({
        ai_processing_status: 'complete',
        metadata: {
          formType: 'form-47',
          formNumber: '47',
          clientName: "Josh Hart",
          administratorName: "Tom Francis",
          filingDate: "February 1, 2025",
          submissionDeadline: "March 3, 2025",
          documentStatus: "Draft - Pending Review",
          signaturesRequired: ['debtor', 'administrator', 'witness'],
          signedParties: [],
          signatureStatus: 'pending',
          legislation: "Paragraph 66.13(2)(c) of the Bankruptcy and Insolvency Act",
          form_specific_details: {
            proposal_type: "Consumer Proposal",
            surplus_income: "Calculation Required",
            family_size: "Unknown", 
            monthly_payment: "To Be Determined",
            proposal_duration: "36 months", // Default
            proposal_total_value: "To Be Calculated"
          }
        },
        deadlines: [
          {
            title: "Consumer Proposal Submission Deadline",
            dueDate: new Date("March 3, 2025").toISOString(),
            description: "Final deadline for submitting Form 47 Consumer Proposal"
          },
          {
            title: "Surplus Income Calculation Deadline",
            dueDate: new Date(new Date().getTime() + 7*24*60*60*1000).toISOString(), // 7 days from now
            description: "Complete Directive 6R3 surplus income calculation"
          },
          {
            title: "Meeting of Creditors",
            dueDate: new Date(new Date().getTime() + 45*24*60*60*1000).toISOString(), // 45 days from now
            description: "Schedule meeting of creditors to vote on proposal (within 45 days of filing)"
          }
        ]
      })
      .eq('id', documentId);
      
    console.log('Updated document metadata with Form 47 details');

  } catch (error) {
    console.error('Error creating Form 47 risk assessment:', error);
    throw error;
  }
};
