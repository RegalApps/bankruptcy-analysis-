
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Clock, ThumbsUp } from "lucide-react";

const meetingEngagementData = [
  { month: 'Aug', clientEngagement: 78, teamEngagement: 85 },
  { month: 'Sep', clientEngagement: 82, teamEngagement: 83 },
  { month: 'Oct', clientEngagement: 86, teamEngagement: 87 },
  { month: 'Nov', clientEngagement: 84, teamEngagement: 90 },
  { month: 'Dec', clientEngagement: 89, teamEngagement: 92 },
];

const meetingTypeData = [
  { name: 'Client Onboarding', value: 35 },
  { name: 'Follow-up', value: 25 },
  { name: 'Review Session', value: 20 },
  { name: 'Support Call', value: 15 },
  { name: 'Other', value: 5 },
];

const clientSentimentData = [
  { name: 'Very Satisfied', value: 45 },
  { name: 'Satisfied', value: 35 },
  { name: 'Neutral', value: 15 },
  { name: 'Dissatisfied', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const SENTIMENT_COLORS = ['#22c55e', '#86efac', '#d1d5db', '#f87171'];

export const MeetingAnalytics = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold leading-tight">Meeting Analytics & Insights</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meeting Satisfaction</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" /> 
              <span className="text-green-500 font-medium">+5%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.3</div>
            <p className="text-xs text-muted-foreground">
              per meeting
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38min</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" /> 
              <span className="text-green-500 font-medium">-12%</span> more efficient
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Action Completion</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86%</div>
            <p className="text-xs text-muted-foreground">
              of assigned action items
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Meeting Engagement</CardTitle>
            <CardDescription>
              Client and team engagement scores over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={meetingEngagementData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[50, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="clientEngagement" 
                    stroke="#0088FE" 
                    activeDot={{ r: 8 }} 
                    name="Client Engagement" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="teamEngagement" 
                    stroke="#00C49F" 
                    name="Team Engagement" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Meeting Types</CardTitle>
            <CardDescription>
              Distribution of meeting categories
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={meetingTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {meetingTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Client Sentiment Analysis</CardTitle>
          <CardDescription>
            Post-meeting sentiment analysis based on feedback forms and transcriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex flex-col sm:flex-row items-center justify-around gap-4">
            <div className="h-40 w-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={clientSentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {clientSentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#22c55e] mr-2"></div>
                <span className="text-sm">Very Satisfied (45%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#86efac] mr-2"></div>
                <span className="text-sm">Satisfied (35%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#d1d5db] mr-2"></div>
                <span className="text-sm">Neutral (15%)</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#f87171] mr-2"></div>
                <span className="text-sm">Dissatisfied (5%)</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Key Positive Themes</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Clear explanations</Badge>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Helpful trustee</Badge>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Efficient</Badge>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-1">Areas for Improvement</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Technical issues</Badge>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Meeting length</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
