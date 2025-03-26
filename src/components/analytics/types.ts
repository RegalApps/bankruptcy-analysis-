
export interface AnalyticsModule {
  id: string;
  name: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  component: React.FC<any>;
  data?: any;
}

export interface CategoryData {
  id: string;
  name: string;
  modules: AnalyticsModule[];
}

export interface DocumentAnalyticsData {
  taskVolume: Array<{ month: string; tasks: number }>;
  timeSaved: Array<{ month: string; hours: number }>;
  errorReduction: Array<{ month: string; errors: number }>;
}
