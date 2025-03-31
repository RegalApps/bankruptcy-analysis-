
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ChevronDown, BarChart3, PieChart, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Mock data for the feedback analytics
const mockFeedbackStats = {
  totalResponses: 128,
  averageSatisfaction: 87,
  categories: {
    technical: { score: 92, responses: 128 },
    clarity: { score: 85, responses: 128 },
    comfort: { score: 91, responses: 128 },
    professionalism: { score: 89, responses: 128 },
    future: { score: 78, responses: 128 }
  },
  questions: [
    {
      id: "communication",
      question: "Did the trustee communicate clearly and effectively?",
      responses: {
        "Extremely effectively": 64,
        "Effectively": 45,
        "Somewhat effectively": 14,
        "Ineffectively": 5
      }
    },
    {
      id: "understanding",
      question: "Did you clearly understand the information provided in today's meeting?",
      responses: {
        "Completely clear": 58,
        "Mostly clear": 52,
        "Somewhat unclear": 15,
        "Completely unclear": 3
      }
    }
  ],
  trends: [
    { month: "Jul", score: 82 },
    { month: "Aug", score: 85 },
    { month: "Sep", score: 87 },
    { month: "Oct", score: 89 },
    { month: "Nov", score: 87 },
    { month: "Dec", score: 91 }
  ],
  keyInsights: [
    "Client understanding has improved 12% over the last quarter",
    "Audio quality issues were reported in 18% of online meetings",
    "Professionalism scores are highest for in-person meetings",
    "Follow-up clarity needs improvement (lowest scoring area)"
  ]
};

export const FeedbackAnalytics = () => {
  // In a real implementation, this would fetch data from your API
  const stats = mockFeedbackStats;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Meeting Feedback Analytics</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            Last 30 Days <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalResponses}</div>
            <p className="text-xs text-muted-foreground mt-1">From all meetings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageSatisfaction}%</div>
            <p className="text-xs text-muted-foreground mt-1">+3.2% from last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground mt-1">Of all meetings</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Satisfaction by Category</CardTitle>
            <CardDescription>Analysis of feedback across different aspects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(stats.categories).map(([category, data]) => {
              // Map category IDs to more readable names
              const categoryNames: Record<string, string> = {
                technical: "Technical Quality",
                clarity: "Clarity & Understanding", 
                comfort: "Comfort & Trust",
                professionalism: "Professionalism",
                future: "Future Confidence"
              };
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{categoryNames[category]}</span>
                    <span className="text-sm font-medium">{data.score}%</span>
                  </div>
                  <Progress value={data.score} className="h-2" />
                  <p className="text-xs text-muted-foreground">Based on {data.responses} responses</p>
                </div>
              );
            })}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>AI-generated analysis of feedback patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.keyInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2 p-3 border rounded-md">
                  <div className="mt-0.5">
                    {index % 3 === 0 ? (
                      <BarChart3 className="h-5 w-5 text-blue-500" />
                    ) : index % 3 === 1 ? (
                      <PieChart className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingUp className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                  <span className="text-sm">{insight}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Question Breakdown</CardTitle>
          <CardDescription>Detailed analysis of individual questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {stats.questions.map((q) => (
              <div key={q.id} className="space-y-4">
                <h4 className="font-medium text-sm">{q.question}</h4>
                <div className="space-y-3">
                  {Object.entries(q.responses).map(([option, count]) => {
                    const percentage = Math.round((count / stats.totalResponses) * 100);
                    
                    // Determine the color based on the response type
                    const getColorClass = (option: string) => {
                      if (option.includes("Extremely") || option.includes("Completely") || option.includes("Very")) {
                        return "bg-green-500";
                      } else if (option.includes("Somewhat") || option.includes("Slightly")) {
                        return "bg-amber-500";
                      } else if (option.includes("Ineffectively") || option.includes("unclear") || option.includes("uncomfortable")) {
                        return "bg-red-500";
                      } else {
                        return "bg-blue-500";
                      }
                    };
                    
                    return (
                      <div key={option} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{option}</span>
                          <span className="font-medium">{count} responses ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className={`${getColorClass(option)} h-2 rounded-full`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
