
export const createForm47DemoDocument = (userId: string) => ({
  id: "form47",
  title: "Form 47 - Consumer Proposal",
  type: "consumer-proposal",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  user_id: userId || "demo-user",
  storage_path: "demo/form47-consumer-proposal.pdf",
  metadata: {
    formNumber: "47",
    formType: "Consumer Proposal"
  },
  analysis: [{
    content: {
      extracted_info: {
        clientName: "John Smith",
        formNumber: "47",
        formType: "Consumer Proposal",
        trusteeName: "Jane Doe, LIT",
        dateSigned: new Date().toLocaleDateString(),
        summary: "This is a Consumer Proposal form (Form 47) submitted under the Bankruptcy and Insolvency Act."
      },
      risks: [],
      regulatory_compliance: {
        status: "needs_review",
        details: "This Consumer Proposal requires review for regulatory compliance.",
        references: ["BIA Section 66.13(2)", "BIA Section 66.14"]
      }
    }
  }]
});

