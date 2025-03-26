
import { BarChart2, Book, Shield, FileText, TrendingUp, LineChart, Users, Activity, Map, Gauge } from "lucide-react";
import { ClientManagementAnalytics } from "@/components/analytics/client/ClientManagementAnalytics";
import { OperationalEfficiencyAnalytics } from "@/components/analytics/operational/OperationalEfficiencyAnalytics";
import { ComplianceAnalytics } from "@/components/analytics/compliance/ComplianceAnalytics";
import { DocumentAnalytics } from "@/components/analytics/documents/DocumentAnalytics";
import { MarketingAnalytics } from "@/components/analytics/marketing/MarketingAnalytics";
import { PredictiveAnalytics } from "@/components/analytics/predictive/PredictiveAnalytics";
import { TrusteePerformanceAnalytics } from "@/components/analytics/performance/TrusteePerformanceAnalytics";
import { SystemUsageAnalytics } from "@/components/analytics/system/SystemUsageAnalytics";
import { GeographicAnalytics } from "@/components/analytics/geographic/GeographicAnalytics";
import { SystemHealthAnalytics } from "@/components/analytics/health/SystemHealthAnalytics";
import { CategoryData } from "./types";

export const getAnalyticsCategories = (): CategoryData[] => {
  return [
    { 
      id: "business",
      name: "Business Insights",
      modules: [
        { id: "client", name: "Client & Case Metrics", icon: Users, component: ClientManagementAnalytics },
        { id: "operations", name: "Operational Efficiency", icon: BarChart2, component: OperationalEfficiencyAnalytics },
        { id: "marketing", name: "Marketing & Leads", icon: TrendingUp, component: MarketingAnalytics },
        { id: "trustees", name: "Trustee Performance", icon: Activity, component: TrusteePerformanceAnalytics }
      ]
    },
    { 
      id: "documents",
      name: "Document Analytics",
      modules: [
        { id: "documents", name: "Document Management", icon: Book, component: DocumentAnalytics }
      ]
    },
    { 
      id: "compliance",
      name: "Compliance & Risk",
      modules: [
        { id: "compliance", name: "Compliance & Risk", icon: Shield, component: ComplianceAnalytics }
      ]
    },
    { 
      id: "system",
      name: "System & Infrastructure",
      modules: [
        { id: "usage", name: "System Usage", icon: FileText, component: SystemUsageAnalytics },
        { id: "geographic", name: "Geographic Analysis", icon: Map, component: GeographicAnalytics },
        { id: "health", name: "System Health", icon: Gauge, component: SystemHealthAnalytics },
        { id: "predictive", name: "Predictive Analytics", icon: LineChart, component: PredictiveAnalytics }
      ]
    }
  ];
};
