
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, Trash2, Save, Share2, FileEdit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AgendaItem {
  id: string;
  title: string;
  completed: boolean;
  isEditing?: boolean;
}

export const MeetingAgenda = () => {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([
    { id: "1", title: "Review previous meeting action items", completed: true },
    { id: "2", title: "Discuss client onboarding process improvements", completed: false },
    { id: "3", title: "Review financial reports", completed: false },
    { id: "4", title: "Schedule next meeting", completed: false }
  ]);
  const [newItemTitle, setNewItemTitle] = useState("");
  const { toast } = useToast();
  
  const addAgendaItem = () => {
    if (!newItemTitle.trim()) return;
    
    const newItem: AgendaItem = {
      id: Date.now().toString(),
      title: newItemTitle,
      completed: false
    };
    
    setAgendaItems([...agendaItems, newItem]);
    setNewItemTitle("");
    toast({
      title: "Agenda item added",
      description: `"${newItemTitle}" added to the agenda.`,
    });
  };
  
  const toggleItemCompleted = (id: string) => {
    setAgendaItems(
      agendaItems.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };
  
  const deleteAgendaItem = (id: string) => {
    setAgendaItems(agendaItems.filter(item => item.id !== id));
    toast({
      title: "Agenda item removed",
      description: "The agenda item has been removed.",
    });
  };
  
  const startEditing = (id: string) => {
    setAgendaItems(
      agendaItems.map(item => 
        item.id === id ? { ...item, isEditing: true } : { ...item, isEditing: false }
      )
    );
  };
  
  const updateItemTitle = (id: string, newTitle: string) => {
    setAgendaItems(
      agendaItems.map(item => 
        item.id === id ? { ...item, title: newTitle, isEditing: false } : item
      )
    );
  };
  
  const handleKeyDown = (e: React.KeyboardEvent, id: string, title: string) => {
    if (e.key === 'Enter') {
      updateItemTitle(id, title);
    }
  };
  
  const saveAgenda = () => {
    // In a real app, this would save the agenda to a database
    toast({
      title: "Agenda saved",
      description: "Your meeting agenda has been saved successfully.",
    });
  };
  
  const shareAgenda = () => {
    // In a real app, this would open a sharing dialog
    toast({
      title: "Share agenda",
      description: "Meeting agenda shared with participants.",
    });
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold leading-tight">Interactive Meeting Agenda</h2>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Meeting Agenda</CardTitle>
              <CardDescription>
                Interactive checklist for keeping meetings on track
              </CardDescription>
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={saveAgenda} className="flex items-center gap-1">
                <Save className="h-3.5 w-3.5" />
                <span>Save</span>
              </Button>
              <Button variant="outline" size="sm" onClick={shareAgenda} className="flex items-center gap-1">
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {agendaItems.map((item) => (
                <div key={item.id} className="flex items-start gap-2 group">
                  <Checkbox 
                    id={`agenda-item-${item.id}`}
                    checked={item.completed}
                    onCheckedChange={() => toggleItemCompleted(item.id)}
                    className="mt-1"
                  />
                  {item.isEditing ? (
                    <Input 
                      defaultValue={item.title}
                      autoFocus
                      onBlur={(e) => updateItemTitle(item.id, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, item.id, (e.target as HTMLInputElement).value)}
                      className="flex-1"
                    />
                  ) : (
                    <label 
                      htmlFor={`agenda-item-${item.id}`}
                      className={`flex-1 ${item.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {item.title}
                    </label>
                  )}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7" 
                      onClick={() => startEditing(item.id)}
                    >
                      <FileEdit className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-7 w-7 text-destructive" 
                      onClick={() => deleteAgendaItem(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex space-x-2">
          <Input
            placeholder="Add a new agenda item"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addAgendaItem()}
            className="flex-1"
          />
          <Button onClick={addAgendaItem} className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>Add Item</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
