
import { 
  ClockIcon, 
  UsersIcon, 
  CalendarIcon, 
  BarChart3Icon,
  TrendingUpIcon 
} from "lucide-react";

export const SchedulingMetricsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg border p-4 flex items-center">
        <div className="mr-4 bg-blue-100 p-2 rounded-full">
          <ClockIcon className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Meeting Efficiency</p>
          <p className="text-2xl font-bold">94%</p>
          <p className="text-xs text-green-600 flex items-center">
            <TrendingUpIcon className="h-3 w-3 mr-1" />
            +3.2% vs last month
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4 flex items-center">
        <div className="mr-4 bg-amber-100 p-2 rounded-full">
          <UsersIcon className="h-6 w-6 text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Client Engagement</p>
          <p className="text-2xl font-bold">87/100</p>
          <p className="text-xs text-green-600 flex items-center">
            <TrendingUpIcon className="h-3 w-3 mr-1" />
            +1.5% vs last month
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4 flex items-center">
        <div className="mr-4 bg-purple-100 p-2 rounded-full">
          <BarChart3Icon className="h-6 w-6 text-purple-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Workload Balance</p>
          <p className="text-2xl font-bold">76%</p>
          <p className="text-xs text-amber-600 flex items-center">
            <TrendingUpIcon className="h-3 w-3 mr-1" />
            +0.8% vs last month
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4 flex items-center">
        <div className="mr-4 bg-green-100 p-2 rounded-full">
          <CalendarIcon className="h-6 w-6 text-green-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Slots Utilization</p>
          <p className="text-2xl font-bold">83%</p>
          <p className="text-xs text-green-600 flex items-center">
            <TrendingUpIcon className="h-3 w-3 mr-1" />
            +2.1% vs last month
          </p>
        </div>
      </div>
    </div>
  );
};
