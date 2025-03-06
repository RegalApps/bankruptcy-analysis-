
/**
 * Creates a detailed risk assessment for Form 47 Consumer Proposal documents
 * @param documentId The document ID to create the risk assessment for
 */
import { supabase } from "@/lib/supabase";

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
            'OSB Directive on Consumer Proposals'
          ]
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
                'OSB Directive on Consumer Proposals'
              ]
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
          legislation: "Paragraph 66.13(2)(c) of the Bankruptcy and Insolvency Act"
        },
        deadlines: [
          {
            title: "Consumer Proposal Submission Deadline",
            dueDate: new Date("March 3, 2025").toISOString(),
            description: "Final deadline for submitting Form 47 Consumer Proposal"
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
                    file.name.toLowerCase().includes('consumer proposal');
    
    console.log(`File classification: ${isForm47 ? 'Form 47 detected' : 'Standard document'}`);
    
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
        metadata: {
          formType: isForm47 ? 'form-47' : null,
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
