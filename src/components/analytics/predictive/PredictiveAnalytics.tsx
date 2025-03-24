
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  Bar
} from "recharts";
import { MetricCard } from "@/components/analytics/MetricCard";
import { Rocket, Users, Clock, Map } from "lucide-react";

// Mock data for predictive analytics
const clientGrowthForecastData = [
  { month: 'Jan', actual: 487, forecast: 487 },
  { month: 'Feb', actual: 498, forecast: 498 },
  { month: 'Mar', actual: 512, forecast: 512 },
  { month: 'Apr', actual: 528, forecast: 528 },
  { month: 'May', actual: 542, forecast: 542 },
  { month: 'Jun', actual: 554, forecast: 554 },
  { month: 'Jul', actual: null, forecast: 568 },
  { month: 'Aug', actual: null, forecast: 582 },
  { month: 'Sep', actual: null, forecast: 597 },
  { month: 'Oct', actual: null, forecast: 615 },
  { month: 'Nov', actual: null, forecast: 634 },
  { month: 'Dec', actual: null, forecast: 650 }
];

const resourceForecastData = [
  { month: 'Jul', trustees: 8, staff: 24, caseload: 554 },
  { month: 'Aug', trustees: 8, staff: 24, caseload: 582 },
  { month: 'Sep', trustees: 8, staff: 25, caseload: 597 },
  { month: 'Oct', trustees: 9, staff: 27, caseload: 615 },
  { month: 'Nov', trustees: 9, staff: 28, caseload: 634 },
  { month: 'Dec', trustees: 10, staff: 30, caseload: 650 }
];

const caseCompletionPredictionsData = [
  { week: 'Week 1', completed: 12, predicted: 13 },
  { week: 'Week 2', completed: 14, predicted: 15 },
  { week: 'Week 3', completed: 13, predicted: 14 },
  { week: 'Week 4', completed: 15, predicted: 16 },
  { week: 'Week 5', completed: null, predicted: 17 },
  { week: 'Week 6', completed: null, predicted: 18 },
  { week: 'Week 7', completed: null, predicted: 19 },
  { week: 'Week 8', completed: null, predicted: 20 }
];

const seasonalTrendsData = [
  { month: 'Jan', filings: 45, filingsForecast: 48, discharges: 32, dischargesForecast: 35 },
  { month: 'Feb', filings: 42, filingsForecast: 45, discharges: 34, dischargesForecast: 36 },
  { month: 'Mar', filings: 50, filingsForecast: 47, discharges: 36, dischargesForecast: 38 },
  { month: 'Apr', filings: 55, filingsForecast: 52, discharges: 38, dischargesForecast: 40 },
  { month: 'May', filings: 48, filingsForecast: 50, discharges: 40, dischargesForecast: 42 },
  { month: 'Jun', filings: 52, filingsForecast: 49, discharges: 42, dischargesForecast: 44 },
  { month: 'Jul', filings: null, filingsForecast: 53, discharges: null, dischargesForecast: 45 },
  { month: 'Aug', filings: null, filingsForecast: 55, discharges: null, dischargesForecast: 47 },
  { month: 'Sep', filings: null, filingsForecast: 58, discharges: null, dischargesForecast: 48 },
  { month: 'Oct', filings: null, filingsForecast: 60, discharges: null, dischargesForecast: 50 },
  { month: 'Nov', filings: null, filingsForecast: 54, discharges: null, dischargesForecast: 52 },
  { month: 'Dec', filings: null, filingsForecast: 51, discharges: null, dischargesForecast: 53 }
];

export const PredictiveAnalytics = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Projected Client Growth" 
          value="18%" 
          description="Annual growth rate forecast" 
          icon={Rocket}
          trend="up" 
        />
        <MetricCard 
          title="Forecast Accuracy" 
          value="93.2%" 
          description="Model prediction accuracy" 
          icon={Map}
          trend="neutral"
        />
        <MetricCard 
          title="Required Staff (EOY)" 
          value="30" 
          description="Projected staff requirements" 
          icon={Users}
          trend="up"
        />
        <MetricCard 
          title="Avg. Case Completion" 
          value="21 days" 
          description="Predicted for next quarter" 
          icon={Clock}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Client Growth Forecast</CardTitle>
            <CardDescription>
              Projected client base for the next 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={clientGrowthForecastData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[450, 700]} />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    name="Actual Clients" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    strokeDasharray="5 5"
                    name="Forecasted Clients" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Resource Forecasting</CardTitle>
            <CardDescription>
              Projected trustee and staff needs based on caseload
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={resourceForecastData}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                >
                  <CartesianGrid stroke="#f5f5f5" />
                  <XAxis dataKey="month" scale="band" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[0, 800]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="trustees" barSize={20} fill="#413ea0" name="Trustees Needed" />
                  <Bar yAxisId="left" dataKey="staff" barSize={20} fill="#ff7300" name="Staff Needed" />
                  <Line yAxisId="right" type="monotone" dataKey="caseload" stroke="#ff0000" name="Projected Caseload" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Case Completion Predictions</CardTitle>
            <CardDescription>
              Predicted case closures for upcoming weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={caseCompletionPredictionsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#8884d8"
                    name="Actual Completions"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="#82ca9d"
                    strokeDasharray="5 5"
                    name="Predicted Completions"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Seasonal Case Trends</CardTitle>
            <CardDescription>
              Historical patterns with predictive forecasts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={seasonalTrendsData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="filings"
                    stroke="#8884d8"
                    name="Actual Filings"
                  />
                  <Line
                    type="monotone"
                    dataKey="filingsForecast"
                    stroke="#8884d8"
                    strokeDasharray="5 5"
                    name="Predicted Filings"
                  />
                  <Line
                    type="monotone"
                    dataKey="discharges"
                    stroke="#82ca9d"
                    name="Actual Discharges"
                  />
                  <Line
                    type="monotone"
                    dataKey="dischargesForecast"
                    stroke="#82ca9d"
                    strokeDasharray="5 5"
                    name="Predicted Discharges"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
