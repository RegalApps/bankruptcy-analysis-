
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryData, AnalyticsModule } from "./types";
import { getTabDescription } from "./utils";

interface AnalyticsContentProps {
  categories: CategoryData[];
  activeCategory: string;
  activeModule: string;
  setActiveModule: (moduleId: string) => void;
  documentMockData: any;
}

export const AnalyticsContent: React.FC<AnalyticsContentProps> = ({
  categories,
  activeCategory,
  activeModule,
  setActiveModule,
  documentMockData,
}) => {
  // Find the active module data
  const activeModuleData = categories
    .flatMap(category => category.modules)
    .find(module => module.id === activeModule);

  return (
    <Card className="border border-border/50 shadow-sm">
      <CardContent className="p-5">
        {/* Module tabs for the selected category */}
        <div className="mb-6">
          <Tabs value={activeModule} onValueChange={setActiveModule} className="space-y-4">
            <TabsList className="h-auto p-1 bg-muted/50 mb-2">
              {categories
                .find(c => c.id === activeCategory)
                ?.modules.map((module) => (
                  <TabsTrigger 
                    key={module.id} 
                    value={module.id}
                    className="flex items-center gap-2 px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <module.icon className="h-4 w-4" />
                    <span>{module.name}</span>
                  </TabsTrigger>
                ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Module title and description */}
        {activeModuleData && (
          <div className="border-b border-border/50 pb-4 mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <activeModuleData.icon className="h-6 w-6 text-primary" />
              {activeModuleData.name}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {getTabDescription(activeModuleData.id)}
            </p>
          </div>
        )}

        {/* Module content */}
        {categories.map(category => (
          category.modules.map(module => (
            <div key={module.id} className={activeModule === module.id ? "block" : "hidden"}>
              {module.id === "documents" ? (
                <module.component 
                  taskVolume={documentMockData.taskVolume}
                  timeSaved={documentMockData.timeSaved}
                  errorReduction={documentMockData.errorReduction}
                />
              ) : (
                <module.component />
              )}
            </div>
          ))
        ))}
      </CardContent>
    </Card>
  );
};
