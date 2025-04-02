
import { useState, useEffect } from "react";
import { ClientInsightData } from "../types";

export const useClientInsights = (clientId: string) => {
  const [insightData, setInsightData] = useState<ClientInsightData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientInsights = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API call with timeout
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock data based on client ID
        const mockData: ClientInsightData = {
          id: clientId,
          clientProfile: {
            name: clientId === "1" ? "John Doe" : clientId === "2" ? "Jane Smith" : "Robert Johnson",
            email: clientId === "1" ? "john.doe@example.com" : clientId === "2" ? "jane.smith@example.com" : "robert.johnson@example.com",
            phone: "+1 (555) 123-4567",
            company: clientId === "1" ? "Acme Inc." : clientId === "2" ? "Tech Solutions" : "Global Services",
            role: "CEO",
            website: "www.example.com",
            avatarUrl: "",
            tags: ["VIP", "Long-term"],
            assignedAgent: "Mark Wilson",
            leadDescription: "Seeking debt relief options",
            leadSource: "Website Inquiry",
            accountStatus: "Active",
          },
          financialData: {
            income: 75000,
            expenses: 65000,
            assets: 120000,
            liabilities: 180000,
            creditScore: 680,
          },
          interactions: [
            {
              date: "2023-05-15",
              type: "email",
              description: "Sent follow-up regarding document requirements",
            },
            {
              date: "2023-05-10",
              type: "phone",
              description: "Initial consultation call to discuss situation",
            },
          ],
          riskLevel: clientId === "1" ? "low" : clientId === "2" ? "medium" : "high",
          riskScore: clientId === "1" ? 85 : clientId === "2" ? 45 : 62,
          complianceStatus: clientId === "1" ? "Compliant" : clientId === "2" ? "Needs Review" : "Issues Detected",
          caseProgress: clientId === "1" ? 75 : clientId === "2" ? 25 : 50,
          lastContactDate: "2023-06-01",
          nextFollowUp: "2023-06-15",
          caseStatus: "Active",
          assignedTrustee: "Jane Roberts",
          pendingTasks: [
            {
              id: "task1",
              title: "Complete Form 47",
              dueDate: "2023-06-20",
              priority: "high",
            },
            {
              id: "task2",
              title: "Schedule creditor meeting",
              dueDate: "2023-06-25",
              priority: "medium",
            },
          ],
          missingDocuments: [
            {
              id: "doc1",
              name: "Tax Return (2022)",
              requiredBy: "2023-06-30",
            },
            {
              id: "doc2",
              name: "Bank Statements (Last 3 months)",
              requiredBy: "2023-06-15",
            },
          ],
          recentActivities: [
            {
              id: "act1",
              type: "document",
              description: "Uploaded Financial Statement",
              date: "2023-06-05T10:30:00Z",
            },
            {
              id: "act2",
              type: "meeting",
              description: "Completed initial consultation",
              date: "2023-06-01T14:00:00Z",
            },
            {
              id: "act3",
              type: "email",
              description: "Sent welcome package",
              date: "2023-05-28T09:15:00Z",
            },
          ],
          aiSuggestions: [
            {
              id: "sugg1",
              text: "Client may qualify for expedited processing based on financial situation",
              type: "opportunity",
            },
            {
              id: "sugg2",
              text: "Consider discussing debt consolidation options at next meeting",
              type: "action",
            },
          ],
          upcomingDeadlines: [
            {
              id: "deadline1",
              title: "Document submission deadline",
              date: "2023-06-30",
              type: "regulatory",
            },
            {
              id: "deadline2",
              title: "45-day follow-up required",
              date: "2023-07-15",
              type: "internal",
            },
          ],
        };

        setInsightData(mockData);
      } catch (err) {
        console.error("Error fetching client insights:", err);
        setError("Failed to load client insights. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (clientId) {
      fetchClientInsights();
    } else {
      setIsLoading(false);
    }
  }, [clientId]);

  return { insightData, isLoading, error };
};
