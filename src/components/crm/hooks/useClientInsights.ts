
import { useState, useEffect } from "react";
import { ClientInsightData } from "../types";

export const useClientInsights = (clientId: string) => {
  const [insightData, setInsightData] = useState<ClientInsightData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock data - in a real app, this would be fetched from an API
        const mockClientData: ClientInsightData = {
          clientProfile: {
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1 (555) 123-4567",
            company: "Acme Inc.",
            role: "Chief Technology Officer",
            website: "www.acmeinc.com",
            tags: ["VIP", "Tech", "Enterprise"],
            assignedAgent: "Jane Smith",
            leadDescription: "Looking for financial restructuring options",
            leadSource: "Website Inquiry",
            accountStatus: "Active",
          },
          financialData: {
            income: 120000,
            expenses: 85000,
            assets: 350000,
            liabilities: 275000,
            creditScore: 720,
          },
          riskLevel: "low",
          riskScore: 75,
          complianceStatus: "compliant",
          caseProgress: 65,
          lastContactDate: "2023-06-10",
          nextFollowUp: "2023-06-25",
          caseStatus: "In Progress",
          assignedTrustee: "David Johnson",
          pendingTasks: [
            {
              id: "task-1",
              title: "Submit financial documents",
              dueDate: "2023-06-20",
              priority: "high"
            },
            {
              id: "task-2",
              title: "Complete assessment form",
              dueDate: "2023-06-18",
              priority: "medium"
            },
            {
              id: "task-3",
              title: "Schedule follow-up meeting",
              dueDate: "2023-06-25",
              priority: "low"
            }
          ],
          missingDocuments: [
            {
              id: "doc-1",
              name: "Income Verification",
              requiredBy: "2023-06-15"
            },
            {
              id: "doc-2",
              name: "Asset Declaration",
              requiredBy: "2023-06-22"
            }
          ],
          recentActivities: [
            {
              id: "act-1",
              type: "call",
              description: "Initial consultation call",
              date: "2023-06-01",
              timestamp: "2023-06-01T10:30:00"
            },
            {
              id: "act-2",
              type: "email",
              description: "Sent information package",
              date: "2023-06-03",
              timestamp: "2023-06-03T14:45:00"
            },
            {
              id: "act-3",
              type: "meeting",
              description: "In-person document review",
              date: "2023-06-10",
              timestamp: "2023-06-10T11:00:00"
            }
          ],
          aiSuggestions: [
            {
              id: "sug-1",
              text: "Client hasn't submitted financial documents that are due in 5 days",
              type: "warning"
            },
            {
              id: "sug-2",
              text: "Based on client profile, recommend discussing debt consolidation options",
              type: "info"
            }
          ],
          upcomingDeadlines: [
            {
              id: "deadline-1",
              title: "Document submission deadline",
              date: "2023-06-20",
              type: "document",
              priority: "high"
            },
            {
              id: "deadline-2",
              title: "Financial assessment completion",
              date: "2023-07-05",
              type: "assessment",
              priority: "medium"
            }
          ],
          interactions: [
            {
              date: "2023-06-01",
              type: "email",
              description: "Sent welcome package and intake forms",
            },
            {
              date: "2023-06-03",
              type: "call",
              description: "Initial consultation call - 30 minutes",
            },
            {
              date: "2023-06-10",
              type: "meeting",
              description: "In-person meeting to review options",
            }
          ],
          clientNotes: [
            {
              id: "note-1",
              title: "Initial Consultation Notes",
              content: "Client is interested in exploring debt consolidation options. Current financial strain due to medical expenses. Needs to reduce monthly payments.",
              timestamp: "2023-06-03T11:30:00",
              attachments: ["financial_summary.pdf"]
            },
            {
              id: "note-2",
              title: "Document Review",
              content: "Reviewed income verification and expense documents. Client is missing asset statements and tax returns for the past year.",
              timestamp: "2023-06-10T14:15:00"
            }
          ]
        };

        setInsightData(mockClientData);
      } catch (err) {
        setError("Failed to fetch client insights. Please try again later.");
        console.error("Error fetching client insights:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (clientId) {
      fetchData();
    }
  }, [clientId]);

  return { insightData, isLoading, error };
};
