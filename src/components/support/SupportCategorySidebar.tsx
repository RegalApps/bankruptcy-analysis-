
import { FileText, MessageCircle, Shield, Lightbulb, Ticket, Award, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";

const categories = [
  { id: "general", label: "General Support", icon: FileText },
  { id: "ai", label: "AI Issues", icon: MessageCircle },
  { id: "legal", label: "Legal Assistance", icon: Shield },
  { id: "feature", label: "Feature Requests", icon: Lightbulb },
];

interface SupportCategorySidebarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const SupportCategorySidebar = ({ 
  selectedCategory, 
  setSelectedCategory 
}: SupportCategorySidebarProps) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className={`w-64 border-r h-full ${isDarkMode ? 'bg-background' : 'bg-white'}`}>
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold mb-2">Categories</h2>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 py-6 h-auto",
                  selectedCategory === category.id && "bg-accent/10 text-accent"
                )}
                onClick={() => setSelectedCategory(category.id)}
              >
                <category.icon className="h-4 w-4" />
                <span>{category.label}</span>
              </Button>
            ))}
          </div>
          
          <div className="space-y-1">
            <h2 className="text-lg font-semibold mb-2">My Tickets</h2>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 py-6 h-auto"
              onClick={() => window.location.href = "/support/tickets"}
            >
              <Ticket className="h-4 w-4" />
              <span>Open Tickets</span>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 py-6 h-auto"
              onClick={() => window.location.href = "/support/tickets?status=resolved"}
            >
              <Ticket className="h-4 w-4" />
              <span>Resolved Tickets</span>
            </Button>
          </div>
          
          <div className="pt-4 border-t">
            <h2 className="text-lg font-semibold mb-2">Leaderboard</h2>
            <Card className="p-3">
              <h3 className="text-sm font-medium mb-2">Top Contributors</h3>
              <div className="space-y-2">
                {[
                  { name: "John Doe", points: 350 },
                  { name: "Jane Smith", points: 280 },
                  { name: "Robert Johnson", points: 220 },
                ].map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                        <Users className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-sm">{user.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs">{user.points}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-2 border-t">
                <h3 className="text-sm font-medium mb-2">AI Agent Accuracy</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overall Score</span>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium text-green-500">95.8%</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};
