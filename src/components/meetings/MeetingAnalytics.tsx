
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Clock, ThumbsUp, MessageSquare, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const meetingEngagementData = [
  { month: 'Aug', clientEngagement: 78, teamEngagement: 85 },
  { month: 'Sep', clientEngagement: 82, teamEngagement: 83 },
  { month: 'Oct', clientEngagement: 86, teamEngagement: 87 },
  { month: 'Nov', clientEngagement: 84, teamEngagement: 90 },
  { month: 'Dec', clientEngagement: 89, teamEngagement: 92 },
  { month: 'Jan', clientEngagement: 92, teamEngagement: 94 },
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

const meetingFeedbackData = [
  { name: "Overall Rating", value: 4.5, target: 4.0, prevValue: 4.2, color: "#0088FE" },
  { name: "Time Efficiency", value: 85, target: 80, prevValue: 78, color: "#00C49F" },
  { name: "Technical Quality", value: 92, target: 90, prevValue: 88, color: "#FFBB28" },
  { name: "Participant Engagement", value: 88, target: 85, prevValue: 81, color: "#FF8042" },
];

const technicalIssuesData = [
  { name: 'None', value: 75 },
  { name: 'Minor', value: 18 },
  { name: 'Major', value: 7 },
];

const recentMeetingReviews = [
  { 
    id: "m1", 
    title: "Weekly Team Sync", 
    date: "2 hours ago", 
    rating: 5, 
    feedback: "Great meeting, all topics covered efficiently"
  },
  { 
    id: "m2", 
    title: "Client Onboarding - XYZ Corp", 
    date: "Yesterday", 
    rating: 4, 
    feedback: "Good session, but ran over time"
  },
  { 
    id: "m3", 
    title: "Project Status Review", 
    date: "2 days ago", 
    rating: 4, 
    feedback: "Minor technical issues with screen sharing"
  },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const SENTIMENT_COLORS = ['#22c55e', '#86efac', '#d1d5db', '#f87171'];
const TECHNICAL_COLORS = ['#22c55e', '#f59e0b', '#ef4444'];

export const MeetingAnalytics = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold leading-tight">Meeting Analytics & Insights</h2>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="space-y-6">
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
        </TabsContent>
        
        <TabsContent value="feedback" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Meeting Feedback Metrics</CardTitle>
                <CardDescription>Key performance indicators from meeting reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={meetingFeedbackData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      layout="vertical"
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip
                        formatter={(value, name, props) => {
                          const item = props.payload;
                          // If this is the primary value
                          if (name === "Current") {
                            // Special case for Overall Rating which is on a 5-point scale
                            if (item.name === "Overall Rating") {
                              return [`${value}/5`, name];
                            }
                            return [`${value}%`, name];
                          }
                          // For other values (target, previous)
                          if (item.name === "Overall Rating") {
                            return [`${value}/5`, name];
                          }
                          return [`${value}%`, name];
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="prevValue" 
                        fill="#94a3b8" 
                        name="Previous" 
                        radius={[0, 0, 0, 0]}
                      />
                      <Bar 
                        dataKey="value" 
                        name="Current"
                        radius={[0, 4, 4, 0]}
                      >
                        {meetingFeedbackData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Technical Issues Reported</CardTitle>
                <CardDescription>
                  From post-meeting feedback forms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <div className="h-64 w-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={technicalIssuesData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {technicalIssuesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={TECHNICAL_COLORS[index % TECHNICAL_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="mt-6 space-y-2">
                  <h4 className="text-sm font-medium">Common Technical Issues</h4>
                  <ul className="space-y-1 list-disc pl-5 text-sm text-muted-foreground">
                    <li>Audio quality problems (41%)</li>
                    <li>Screen sharing delay (28%)</li>
                    <li>Connection instability (17%)</li>
                    <li>Video freezing (14%)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Recent Meeting Reviews</CardTitle>
                <CardDescription>Latest feedback from completed meetings</CardDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Updated</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMeetingReviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{review.title}</h4>
                        <p className="text-xs text-muted-foreground">{review.date}</p>
                      </div>
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">{review.rating}/5</span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-start gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm">{review.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="col-span-full">
              <CardHeader>
                <CardTitle>Meeting Efficiency Trends</CardTitle>
                <CardDescription>
                  Time utilization and agenda completion metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Aug", actual: 75, target: 95, completion: 80 },
                        { month: "Sep", actual: 78, target: 95, completion: 82 },
                        { month: "Oct", actual: 82, target: 95, completion: 85 },
                        { month: "Nov", actual: 85, target: 95, completion: 88 },
                        { month: "Dec", actual: 88, target: 95, completion: 90 },
                        { month: "Jan", actual: 92, target: 95, completion: 94 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, '']}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#0088FE"
                        name="Time Efficiency"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="#8884d8"
                        strokeDasharray="5 5"
                        name="Target Efficiency"
                      />
                      <Line
                        type="monotone"
                        dataKey="completion"
                        stroke="#82ca9d"
                        name="Agenda Completion"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Time Efficiency Improvement
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+17%</div>
                <p className="text-xs text-muted-foreground">
                  Year-over-year improvement in meeting time utilization
                </p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Contributing Factors</h4>
                  <ul className="space-y-1 list-disc pl-5 text-sm text-muted-foreground">
                    <li>Standardized agenda templates</li>
                    <li>Pre-meeting material distribution</li>
                    <li>Improved facilitation training</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Technical Disruptions
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-42%</div>
                <p className="text-xs text-muted-foreground">
                  Reduction in technical issues reported in Q4
                </p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Improvement Actions</h4>
                  <ul className="space-y-1 list-disc pl-5 text-sm text-muted-foreground">
                    <li>Hardware upgrades for key personnel</li>
                    <li>Pre-meeting connectivity checks</li>
                    <li>Platform standardization</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Top Performing Meeting Type
                </CardTitle>
                <Users className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">Project Updates</div>
                <p className="text-xs text-muted-foreground">
                  96% agenda completion rate, avg duration 28 min
                </p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Success Factors</h4>
                  <ul className="space-y-1 list-disc pl-5 text-sm text-muted-foreground">
                    <li>Standardized reporting templates</li>
                    <li>Clear time limits per section</li>
                    <li>Visual progress indicators</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

function Star({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
