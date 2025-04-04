
import { Users, BarChart, PieChart, FileText, Shield, Globe, LayoutDashboard, Zap, LineChart, Network, Cpu } from "lucide-react";
import { ClientManagementAnalytics } from "./client/ClientManagementAnalytics";
import { DocumentAnalytics } from "./documents/DocumentAnalytics";
import { ComplianceAnalytics } from "./compliance/ComplianceAnalytics";
import { GeographicAnalytics } from "./geographic/GeographicAnalytics";
import { OperationalEfficiencyAnalytics } from "./operational/OperationalEfficiencyAnalytics";
import { TrusteePerformanceAnalytics } from "./performance/TrusteePerformanceAnalytics";
import { PredictiveAnalytics } from "./predictive/PredictiveAnalytics";
import { SystemUsageAnalytics } from "./system/SystemUsageAnalytics";
import { MarketingAnalytics } from "./marketing/MarketingAnalytics";
import { SystemHealthAnalytics } from "./health/SystemHealthAnalytics";
import { CrmAnalytics } from "./crm/CrmAnalytics";
import { CategoryData } from "./types";

export const getAnalyticsCategories = (): CategoryData[] => [
  {
    id: "business",
    name: "Business Performance",
    modules: [
      {
        id: "client",
        name: "Client Management",
        icon: Users,
        component: ClientManagementAnalytics,
      },
      {
        id: "operational",
        name: "Operational Efficiency",
        icon: BarChart,
        component: OperationalEfficiencyAnalytics,
      },
      {
        id: "crm",
        name: "CRM Performance",
        icon: PieChart,
        component: CrmAnalytics,
      },
    ],
  },
  {
    id: "documents",
    name: "Document Management",
    modules: [
      {
        id: "documents",
        name: "Document Analytics",
        icon: FileText,
        component: DocumentAnalytics,
      },
      {
        id: "compliance",
        name: "Compliance Monitoring",
        icon: Shield,
        component: ComplianceAnalytics,
      },
    ],
  },
  {
    id: "geographic",
    name: "Geographic Insights",
    modules: [
      {
        id: "location",
        name: "Client Distribution",
        icon: Globe,
        component: GeographicAnalytics,
      },
    ],
  },
  {
    id: "predictive",
    name: "Predictive Analytics",
    modules: [
      {
        id: "trends",
        name: "Trend Analysis",
        icon: LineChart,
        component: PredictiveAnalytics,
      },
    ],
  },
  {
    id: "system",
    name: "System Performance",
    modules: [
      {
        id: "usage",
        name: "System Usage",
        icon: LayoutDashboard,
        component: SystemUsageAnalytics,
      },
      {
        id: "health",
        name: "System Health",
        icon: Zap,
        component: SystemHealthAnalytics,
      },
    ],
  },
  {
    id: "marketing",
    name: "Marketing Performance",
    modules: [
      {
        id: "campaigns",
        name: "Campaign Analytics",
        icon: Network,
        component: MarketingAnalytics,
      },
    ],
  },
];
