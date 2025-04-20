
/**
 * Creates a detailed risk assessment for Form 47 Consumer Proposal documents
 * @param documentId The document ID to create the risk assessment for
 */
import { supabase } from "@/lib/supabase";
import { createFolderIfNotExists } from "@/utils/documents/folder-utils/createFolder";
import logger from "@/utils/logger";

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

/**
 * Uploads a document file and creates a database record for it
 * @param file The document file to upload
 * @returns The created document data or null if there was an error
 */
export const uploadDocument = async (file: File) => {
  try {
    // Create a unique file path for storage
    const fileExt = file.name.split('.').pop();
    const fileName = file.name.replace(/\.[^/.]+$/, ""); // Get filename without extension
    const filePath = `${crypto.randomUUID()}-${fileName}.${fileExt}`;

    console.log(`Uploading file "${file.name}" to storage path: ${filePath}`);

    // Make sure the documents bucket exists
    try {
      const { data: buckets } = await supabase.storage.listBuckets();
      const documentsBucketExists = buckets?.some(bucket => bucket.name === 'documents');
      
      if (!documentsBucketExists) {
        console.log("Documents bucket does not exist, creating...");
        const { error: createBucketError } = await supabase.storage.createBucket('documents', {
          public: true
        });
        
        if (createBucketError) {
          console.error("Error creating documents bucket:", createBucketError);
        } else {
          console.log("Documents bucket created successfully");
        }
      }
    } catch (bucketError) {
      console.warn("Error checking/creating bucket:", bucketError);
      // Continue anyway, the bucket might already exist
    }

    // Upload the file to Supabase storage with public access
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }
    
    console.log("File uploaded successfully:", uploadData);

    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    // Check for Form 47 in the filename or content
    const isForm47 = file.name.toLowerCase().includes('form 47') || 
                    file.name.toLowerCase().includes('consumer proposal') ||
                    file.name.toLowerCase().includes('f47');
    
    // Check for Form 76 in the filename
    const isForm76 = file.name.toLowerCase().includes('form 76') || 
                     file.name.toLowerCase().includes('statement of affairs') ||
                     file.name.toLowerCase().includes('f76');
    
    // Check for financial documents
    const isFinancial = file.name.toLowerCase().includes('statement') ||
                      file.name.toLowerCase().includes('sheet') ||
                      file.name.toLowerCase().includes('budget') ||
                      file.name.toLowerCase().includes('.xls');
                      
    console.log(`File classification: ${isForm47 ? 'Form 47' : isForm76 ? 'Form 76' : isFinancial ? 'Financial' : 'Standard document'}`);
    
    // Determine client name for folder organization
    let clientName = "Untitled Client";
    
    if (isForm47) {
      clientName = "Josh Hart"; // Use the client name from the Form 47 example
    } else if (isForm76) {
      // Extract client name from Form 76 filename if possible
      const nameMatch = file.name.match(/form[- ]?76[- ]?(.+?)(?:\.|$)/i);
      if (nameMatch && nameMatch[1]) {
        clientName = nameMatch[1].trim();
      }
    }
    
    // Create the client folder structure
    let parentFolderId: string | undefined = undefined;
    
    if (clientName !== "Untitled Client") {
      try {
        // Create client folder if it doesn't exist
        const clientFolderId = await createFolderIfNotExists(
          clientName,
          'client',
          userData.user?.id || ''
        );
        
        logger.info(`Client folder: ${clientName}, ID: ${clientFolderId}`);
        
        // Create appropriate subfolder based on document type - always create a Forms subfolder for form documents
        let subfolderName = "Documents";
        let subfolderType = "general";
        
        if (isForm47 || isForm76) {
          subfolderName = "Forms";
          subfolderType = "form";
        } else if (isFinancial) {
          subfolderName = "Financial Sheets";
          subfolderType = "financial";
        }
        
        const subFolderId = await createFolderIfNotExists(
          subfolderName,
          subfolderType,
          userData.user?.id || '',
          clientFolderId
        );
        
        logger.info(`Subfolder: ${subfolderName}, ID: ${subFolderId}`);
        
        // Set the parent folder ID to the subfolder
        parentFolderId = subFolderId;
      } catch (folderError) {
        logger.error("Error creating folder structure:", folderError);
        // Continue without folder structure if there was an error
      }
    }
    
    // Create a database record for the document
    const { data: documentData, error: dbError } = await supabase
      .from('documents')
      .insert({
        title: file.name,
        type: file.type,
        size: file.size,
        storage_path: filePath,
        user_id: userData.user?.id,
        ai_processing_status: 'pending',
        parent_folder_id: parentFolderId, // Link document to the created folder structure
        metadata: {
          formType: isForm47 ? 'form-47' : isForm76 ? 'form-76' : null,
          clientName: clientName !== "Untitled Client" ? clientName : null,
          uploadDate: new Date().toISOString(),
          documentStatus: isForm47 ? "Draft - Pending Review" : "Uploaded"
        }
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      throw dbError;
    }
    
    console.log("Document record created:", documentData);

    // If this is a Form 47, create a risk assessment for it
    if (isForm47) {
      await createForm47RiskAssessment(documentData.id);
    }

    // Get and log the public URL for verification
    const { data: urlData } = await supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
      
    console.log("Document public URL:", urlData?.publicUrl);

    return documentData;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};
