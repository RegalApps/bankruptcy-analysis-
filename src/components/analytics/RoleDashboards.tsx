
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AnomalyDetectionDashboard } from "./performance/AnomalyDetectionDashboard";
import { RealTimeMetrics } from "./RealTimeMetrics";
import { analyticsService, EventCategory } from "@/services/analyticsService";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader, Save, PlusCircle, X } from "lucide-react";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

// Define role-specific dashboard configurations
const roleConfigs = {
  admin: {
    name: 'Admin Dashboard',
    description: 'Complete system overview for administrators',
    widgets: ['anomaly-detection', 'real-time-metrics', 'category-breakdown', 'subcategory-breakdown', 'historical-trends'],
    defaultTab: 'performance'
  },
  manager: {
    name: 'Manager Dashboard',
    description: 'Business and operational metrics for managers',
    widgets: ['real-time-metrics', 'category-breakdown', 'client-metrics', 'document-metrics'],
    defaultTab: 'business'
  },
  trustee: {
    name: 'Trustee Dashboard',
    description: 'Client and document-focused metrics for trustees',
    widgets: ['client-metrics', 'document-metrics', 'form-analytics'],
    defaultTab: 'client'
  },
  technical: {
    name: 'Technical Dashboard',
    description: 'Performance and system metrics for technical staff',
    widgets: ['anomaly-detection', 'real-time-metrics', 'error-metrics', 'api-performance'],
    defaultTab: 'performance'
  }
};

type WidgetId = 'anomaly-detection' | 'real-time-metrics' | 'category-breakdown' | 
  'subcategory-breakdown' | 'historical-trends' | 'client-metrics' | 
  'document-metrics' | 'form-analytics' | 'error-metrics' | 'api-performance';

interface Widget {
  id: WidgetId;
  name: string;
  description: string;
  component: React.FC<any>;
  defaultProps?: any;
  size: 'small' | 'medium' | 'large' | 'full';
}

// Define available widgets
const availableWidgets: Widget[] = [
  {
    id: 'anomaly-detection',
    name: 'Anomaly Detection',
    description: 'Detect and analyze performance anomalies',
    component: AnomalyDetectionDashboard,
    size: 'full'
  },
  {
    id: 'real-time-metrics',
    name: 'Real-Time Metrics',
    description: 'Live analytics data from current session',
    component: RealTimeMetrics,
    size: 'full'
  },
  {
    id: 'category-breakdown',
    name: 'Event Categories',
    description: 'Breakdown of events by category',
    component: CategoryBreakdown,
    size: 'medium'
  },
  {
    id: 'subcategory-breakdown',
    name: 'Event Subcategories',
    description: 'Breakdown of events by subcategory',
    component: SubcategoryBreakdown,
    size: 'medium'
  },
  {
    id: 'historical-trends',
    name: 'Historical Trends',
    description: 'Long-term analytics trends',
    component: HistoricalTrends,
    size: 'full'
  },
  {
    id: 'client-metrics',
    name: 'Client Metrics',
    description: 'Client engagement and interaction metrics',
    component: ClientMetrics,
    size: 'medium'
  },
  {
    id: 'document-metrics',
    name: 'Document Metrics',
    description: 'Document processing and access metrics',
    component: DocumentMetrics,
    size: 'medium'
  },
  {
    id: 'form-analytics',
    name: 'Form Analytics',
    description: 'Form submission and validation analytics',
    component: FormAnalytics,
    size: 'medium'
  },
  {
    id: 'error-metrics',
    name: 'Error Metrics',
    description: 'System errors and exceptions tracking',
    component: ErrorMetrics,
    size: 'medium'
  },
  {
    id: 'api-performance',
    name: 'API Performance',
    description: 'API call performance and reliability metrics',
    component: ApiPerformance,
    size: 'medium'
  }
];

// Component to render category breakdown
function CategoryBreakdown() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = () => {
      const categoryData = analyticsService.getEventsByCategory();
      setData(categoryData);
      setIsLoading(false);
    };
    
    fetchData();
    const interval = setInterval(fetchData, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            nameKey="name"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Component to render subcategory breakdown
function SubcategoryBreakdown() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = () => {
      const subcategoryData = analyticsService.getEventsBySubcategory();
      setData(subcategoryData);
      setIsLoading(false);
    };
    
    fetchData();
    const interval = setInterval(fetchData, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <p>No subcategory data available</p>
      </div>
    );
  }
  
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Placeholder components for other widgets
function HistoricalTrends() {
  return (
    <div className="h-96 flex items-center justify-center text-muted-foreground">
      <p>Historical trends data visualization would go here</p>
    </div>
  );
}

function ClientMetrics() {
  return (
    <div className="h-64 flex items-center justify-center text-muted-foreground">
      <p>Client metrics visualization would go here</p>
    </div>
  );
}

function DocumentMetrics() {
  return (
    <div className="h-64 flex items-center justify-center text-muted-foreground">
      <p>Document metrics visualization would go here</p>
    </div>
  );
}

function FormAnalytics() {
  return (
    <div className="h-64 flex items-center justify-center text-muted-foreground">
      <p>Form analytics visualization would go here</p>
    </div>
  );
}

function ErrorMetrics() {
  return (
    <div className="h-64 flex items-center justify-center text-muted-foreground">
      <p>Error metrics visualization would go here</p>
    </div>
  );
}

function ApiPerformance() {
  return (
    <div className="h-64 flex items-center justify-center text-muted-foreground">
      <p>API performance visualization would go here</p>
    </div>
  );
}

export const RoleDashboards = () => {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [activeTab, setActiveTab] = useState('performance');
  const [activeWidgets, setActiveWidgets] = useState<WidgetId[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load role config when role changes
  useEffect(() => {
    const role = selectedRole as keyof typeof roleConfigs;
    setActiveWidgets(roleConfigs[role].widgets as WidgetId[]);
    setActiveTab(roleConfigs[role].defaultTab);
    setIsLoading(false);
  }, [selectedRole]);
  
  const handleRoleChange = (role: string) => {
    setIsLoading(true);
    setSelectedRole(role);
    setIsEditing(false);
  };
  
  const handleAddWidget = (widgetId: WidgetId) => {
    if (!activeWidgets.includes(widgetId)) {
      setActiveWidgets(prev => [...prev, widgetId]);
    }
  };
  
  const handleRemoveWidget = (widgetId: WidgetId) => {
    setActiveWidgets(prev => prev.filter(id => id !== widgetId));
  };
  
  const handleSaveCustomization = () => {
    // In a real app, this would save to user preferences in the backend
    setIsEditing(false);
    
    // Custom toast message to indicate save
    const role = selectedRole as keyof typeof roleConfigs;
    const roleName = roleConfigs[role].name;
    
    // Using the toast system
    const customEvent = new CustomEvent('toast', {
      detail: {
        title: 'Dashboard Customized',
        description: `${roleName} dashboard layout has been updated with ${activeWidgets.length} widgets.`,
        variant: 'default'
      }
    });
    
    window.dispatchEvent(customEvent);
  };
  
  const getWidgetComponent = (widgetId: WidgetId) => {
    const widget = availableWidgets.find(w => w.id === widgetId);
    if (!widget) return null;
    
    const Component = widget.component;
    return (
      <Card key={widgetId} className={`relative ${isEditing ? 'border-dashed border-2 border-primary/60' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{widget.name}</CardTitle>
              <CardDescription>{widget.description}</CardDescription>
            </div>
            {isEditing && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full" 
                onClick={() => handleRemoveWidget(widgetId)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Component {...(widget.defaultProps || {})} />
        </CardContent>
      </Card>
    );
  };
  
  const renderWidgets = () => {
    return activeWidgets.map(widgetId => {
      const widget = availableWidgets.find(w => w.id === widgetId);
      if (!widget) return null;
      
      if (widget.size === 'full') {
        return (
          <div key={widgetId} className="col-span-1 md:col-span-2 lg:col-span-3">
            {getWidgetComponent(widgetId)}
          </div>
        );
      } else if (widget.size === 'medium') {
        return (
          <div key={widgetId} className="col-span-1 md:col-span-1 lg:col-span-1">
            {getWidgetComponent(widgetId)}
          </div>
        );
      } else if (widget.size === 'large') {
        return (
          <div key={widgetId} className="col-span-1 md:col-span-2 lg:col-span-2">
            {getWidgetComponent(widgetId)}
          </div>
        );
      } else {
        return (
          <div key={widgetId} className="col-span-1">
            {getWidgetComponent(widgetId)}
          </div>
        );
      }
    });
  };
  
  const renderWidgetSelector = () => {
    const unusedWidgets = availableWidgets.filter(
      widget => !activeWidgets.includes(widget.id)
    );
    
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Add Widgets</CardTitle>
          <CardDescription>Select widgets to add to your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unusedWidgets.map(widget => (
              <Card key={widget.id} className="border-dashed cursor-pointer hover:border-primary/60 transition-colors">
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{widget.name}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-4 px-4">
                  <p className="text-sm text-muted-foreground">{widget.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2 w-full"
                    onClick={() => handleAddWidget(widget.id)}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Widget
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">
            {roleConfigs[selectedRole as keyof typeof roleConfigs].name}
          </h2>
          <p className="text-muted-foreground">
            {roleConfigs[selectedRole as keyof typeof roleConfigs].description}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 min-w-[200px]">
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="trustee">Trustee</SelectItem>
                <SelectItem value="technical">Technical Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant={isEditing ? "default" : "outline"} 
            onClick={() => isEditing ? handleSaveCustomization() : setIsEditing(true)}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Layout
              </>
            ) : (
              'Customize Dashboard'
            )}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="client">Client</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="performance" className="mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderWidgets()}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="business" className="mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderWidgets()}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="client" className="mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderWidgets()}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="documents" className="mt-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderWidgets()}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {isEditing && renderWidgetSelector()}
    </div>
  );
};
