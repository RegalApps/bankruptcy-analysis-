
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryData } from "./types";

interface AnalyticsSidebarProps {
  categories: CategoryData[];
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export const AnalyticsSidebar: React.FC<AnalyticsSidebarProps> = ({
  categories,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <Card className="sticky top-4">
      <CardContent className="p-4">
        <h2 className="font-medium text-lg mb-3">Analytics Categories</h2>
        <nav className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center ${
                activeCategory === category.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted transition-colors"
              }`}
            >
              {category.name}
              <span className="ml-auto text-xs text-muted-foreground">
                {category.modules.length}
              </span>
            </button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
};
