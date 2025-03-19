
import React, { useEffect } from "react";
import { PerformanceDashboard } from "@/components/performance/PerformanceDashboard";
import { MainLayout } from "@/components/layout/MainLayout";
import { initPerformanceMonitoring } from "@/utils/performanceMonitor";

const PerformancePage = () => {
  useEffect(() => {
    initPerformanceMonitoring();
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <PerformanceDashboard />
      </div>
    </MainLayout>
  );
};

export default PerformancePage;
