
import { useState, useEffect } from "react";
import { ClientInsightData } from "../types";

export const useClientInsights = (clientId: string) => {
  const [insightData, setInsightData] = useState<ClientInsightData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate a delay and return mock data
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock client insight data tailored to our new dashboard
        const mockInsightData: ClientInsightData = {
          riskLevel: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
          riskScore: Math.floor(Math.random() * 100),
          complianceStatus: Math.random() > 0.7 ? "critical" : Math.random() > 0.4 ? "issues" : "compliant",
          caseProgress: Math.floor(Math.random() * 100),
          pendingTasks: [
            { id: "1", title: "Review financial documents", priority: "high" },
            { id: "2", title: "Schedule follow-up call", priority: "medium" }
          ],
          missingDocuments: [
            { id: "1", name: "Bank Statement", requiredBy: "2023-07-01" },
            { id: "2", name: "Tax Returns", requiredBy: "2023-07-15" }
          ],
          recentActivities: [
            { 
              id: "1", 
              type: "email", 
              action: "Email opened: Monthly Newsletter", 
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() 
            },
            { 
              id: "2", 
              type: "form", 
              action: "Form submitted: Contact Request", 
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() 
            },
            { 
              id: "3", 
              type: "call", 
              action: "Call completed: Initial consultation", 
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString() 
            },
            { 
              id: "4", 
              type: "meeting", 
              action: "Meeting booked: Financial planning session", 
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString() 
            }
          ],
          aiSuggestions: [
            {
              id: "1",
              type: "info",
              message: "Client hasn't been contacted in 14 days.",
              action: "Schedule follow-up"
            },
            {
              id: "2",
              type: "info",
              message: "Last touchpoint was a form submission on " + 
                new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toLocaleDateString() + 
                ". Consider follow-up.",
              action: "Send follow-up email"
            },
            {
              id: "3",
              type: "warning",
              message: "Client has opened 3 emails but hasn't responded.",
              action: "Try a different communication channel"
            },
            {
              id: "4",
              type: "urgent",
              message: "High churn risk detected based on engagement patterns.",
              action: "Escalate to account manager"
            }
          ],
          // New fields for our enhanced client profile
          clientProfile: {
            email: "client@example.com",
            phone: "(555) 123-4567",
            website: "www.clientwebsite.com",
            company: "Acme Corporation",
            role: "Chief Financial Officer",
            assignedAgent: "Sarah Johnson",
            avatarUrl: "",
            tags: ["Lead", "Financial Services", "High Value"]
          },
          // Client notes for the activity tab
          clientNotes: [
            {
              title: "Initial Consultation Notes",
              content: "Client expressed interest in our premium services. Discussed timeline and budget constraints.",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
              attachments: ["meeting_notes.pdf", "initial_proposal.docx"]
            },
            {
              title: "Follow-up Call",
              content: "Addressed client's concerns about implementation timeline. They requested a more detailed breakdown of costs.",
              timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
              attachments: []
            }
          ],
          // Milestones for case progress
          milestones: [
            { name: "Initial Contact Made", completed: true },
            { name: "Needs Assessment", completed: true },
            { name: "Proposal Sent", completed: true },
            { name: "Contract Negotiation", completed: false },
            { name: "Deal Closed", completed: false }
          ],
          // Adding upcomingDeadlines field with proper structure
          upcomingDeadlines: [
            {
              id: "1",
              title: "Submit Financial Documents",
              date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().split('T')[0],
              priority: "high"
            },
            {
              id: "2",
              title: "Compliance Review Meeting",
              date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().split('T')[0],
              priority: "medium"
            },
            {
              id: "3",
              title: "Contract Signing",
              date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString().split('T')[0],
              priority: "low"
            }
          ]
        };

        setInsightData(mockInsightData);
      } catch (err) {
        console.error("Error fetching client insights:", err);
        setError("Failed to load client insights. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    if (clientId) {
      fetchInsights();
    } else {
      setIsLoading(false);
    }
  }, [clientId]);

  return { insightData, isLoading, error };
};
