
import { useState } from "react";
import { FileUp, Tags } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/contexts/ThemeContext";

const suggestedTags = [
  "Upload Issue", "AI Error", "Form Recognition", "Account Access", 
  "Billing", "Feature Request", "Bug Report", "API Integration"
];

export const NewTicketForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert("Support ticket submitted successfully!");
      setIsSubmitting(false);
      setTitle("");
      setDescription("");
      setCategory("");
      setTags([]);
    }, 1500);
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Support Ticket</CardTitle>
        <CardDescription>
          Describe your issue in detail to help us assist you more effectively
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              placeholder="Briefly describe your issue"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <Select
              value={category}
              onValueChange={setCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Support</SelectItem>
                <SelectItem value="ai">AI Issues</SelectItem>
                <SelectItem value="legal">Legal Assistance</SelectItem>
                <SelectItem value="feature">Feature Requests</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Provide as much detail as possible about your issue"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="resize-none"
            />
          </div>
          
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1">
              <Tags className="h-4 w-4" />
              Tags
            </label>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => removeTag(tag)}
                    className="text-xs ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
              {tags.length === 0 && (
                <span className="text-xs text-muted-foreground">No tags selected</span>
              )}
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-2">Suggested tags:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className={`cursor-pointer hover:bg-accent transition-colors ${
                      tags.includes(tag) ? 'opacity-50' : ''
                    }`}
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-1">
              <FileUp className="h-4 w-4" />
              Attachments
            </label>
            <div className={`border-2 border-dashed rounded-md p-6 text-center ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <Button type="button" variant="outline" className="mb-2">
                <FileUp className="h-4 w-4 mr-2" />
                Choose Files
              </Button>
              <p className="text-xs text-muted-foreground">
                Drag and drop files here or click to browse (Max: 10MB per file)
              </p>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !title || !description || !category}
            >
              {isSubmitting ? "Submitting..." : "Submit Ticket"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
