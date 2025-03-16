
import { useState, useEffect } from "react";
import { ClientInsightData } from "../../activity/hooks/predictiveData/types";

export const useClientInsights = (clientId: string | null) => {
  const [insightData, setInsightData] = useState<ClientInsightData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) {
      setInsightData(null);
      return;
    }

    const fetchClientInsights = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // In a real app, this would be an API call to fetch client insights
        // For now, we'll simulate it with a timeout and mock data
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data based on client ID
        const mockInsightData: ClientInsightData = {
          riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
          riskScore: Math.floor(Math.random() * 100),
          complianceStatus: ['compliant', 'issues', 'critical'][Math.floor(Math.random() * 3)] as 'compliant' | 'issues' | 'critical',
          pendingTasks: Math.floor(Math.random() * 10),
          missingDocuments: Math.floor(Math.random() * 5),
          upcomingDeadlines: [
            {
              id: '1',
              title: 'Submit Form 47 to OSB',
              date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
              priority: 'high'
            },
            {
              id: '2',
              title: 'Client Meeting',
              date: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
              priority: 'medium'
            },
            {
              id: '3',
              title: 'Financial Statement Review',
              date: new Date(Date.now() + 86400000 * 10).toISOString().split('T')[0],
              priority: 'low'
            }
          ],
          recentActivities: [
            {
              id: '1',
              action: 'Uploaded Income Statement',
              timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
              type: 'document'
            },
            {
              id: '2',
              action: 'Scheduled Meeting with Trustee',
              timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
              type: 'meeting'
            },
            {
              id: '3',
              action: 'Made Payment of $250',
              timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
              type: 'payment'
            }
          ],
          aiSuggestions: [
            {
              id: '1',
              message: 'Missing signature on Form 47. Auto-sent request for client e-signature.',
              type: 'urgent',
              action: 'View Document'
            },
            {
              id: '2',
              message: 'Financial data suggests client may qualify for a more favorable repayment plan.',
              type: 'info',
              action: 'Review Analysis'
            }
          ],
          caseProgress: Math.floor(Math.random() * 100),
          financialHealth: {
            score: Math.floor(Math.random() * 100),
            status: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)] as 'improving' | 'stable' | 'declining',
            trend: Math.random() * 10 - 5
          }
        };

        setInsightData(mockInsightData);
      } catch (err) {
        console.error("Error fetching client insights:", err);
        setError("Failed to load client insights. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientInsights();
  }, [clientId]);

  return { insightData, isLoading, error };
};
