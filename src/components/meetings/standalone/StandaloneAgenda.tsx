
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Save, Check, Trash2, Clock, ClipboardList } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface AgendaItem {
  id: string;
  text: string;
  completed: boolean;
  timeEstimate?: string;
}

export const StandaloneAgenda = () => {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [newItemText, setNewItemText] = useState("");
  const [timeEstimate, setTimeEstimate] = useState("5");
  const { toast } = useToast();
  
  // Load agenda items from localStorage when component mounts
  useEffect(() => {
    const savedAgenda = localStorage.getItem("meeting-agenda");
    if (savedAgenda) {
      try {
        setAgendaItems(JSON.parse(savedAgenda));
      } catch (error) {
        console.error("Failed to parse saved agenda:", error);
      }
    }
    
    // Set up storage event listener to sync with main app
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "meeting-agenda" && e.newValue) {
        try {
          setAgendaItems(JSON.parse(e.newValue));
        } catch (error) {
          console.error("Failed to parse updated agenda:", error);
        }
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  
  // Save agenda items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("meeting-agenda", JSON.stringify(agendaItems));
  }, [agendaItems]);
  
  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    
    const newItem: AgendaItem = {
      id: Date.now().toString(),
      text: newItemText,
      completed: false,
      timeEstimate: `${timeEstimate} min`
    };
    
    setAgendaItems([...agendaItems, newItem]);
    setNewItemText("");
  };
  
  const handleToggleComplete = (id: string) => {
    setAgendaItems(
      agendaItems.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };
  
  const handleDeleteItem = (id: string) => {
    setAgendaItems(agendaItems.filter(item => item.id !== id));
  };
  
  const handleSaveAgenda = () => {
    localStorage.setItem("meeting-agenda", JSON.stringify(agendaItems));
    toast({
      title: "Agenda saved",
      description: "Your meeting agenda has been saved successfully",
    });
  };
  
  // Calculate estimated time remaining
  const remainingTime = agendaItems
    .filter(item => !item.completed)
    .reduce((total, item) => {
      const minutes = parseInt(item.timeEstimate?.split(" ")[0] || "0", 10);
      return total + minutes;
    }, 0);
  
  return (
    <div className="p-4 min-h-screen flex flex-col">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <ClipboardList className="h-5 w-5 mr-2" />
            Meeting Agenda
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Input
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                placeholder="Add agenda item..."
                onKeyDown={(e) => e.key === "Enter" && handleAddItem()}
              />
            </div>
            <div className="flex items-center space-x-2 w-24">
              <Input
                type="number"
                value={timeEstimate}
                onChange={(e) => setTimeEstimate(e.target.value)}
                className="w-12 text-center"
                min="1"
              />
              <span className="text-sm text-muted-foreground">min</span>
            </div>
            <Button onClick={handleAddItem} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            {agendaItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No agenda items yet. Add items above to get started.
              </div>
            ) : (
              agendaItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    item.completed ? "bg-muted/50 text-muted-foreground" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox
                      checked={item.completed}
                      onCheckedChange={() => handleToggleComplete(item.id)}
                    />
                    <span className={item.completed ? "line-through" : ""}>
                      {item.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {item.timeEstimate}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="text-sm flex items-center">
            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-muted-foreground">Remaining:</span>
            <span className="ml-1 font-medium">{remainingTime} min</span>
          </div>
          <Button onClick={handleSaveAgenda} className="flex items-center gap-1">
            <Save className="h-4 w-4" />
            Save Agenda
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
