
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tag, Plus, X } from "lucide-react";
import { useState } from "react";

interface TagsManagerProps {
  tags: string[];
  onAddTag?: (tag: string) => void;
  onRemoveTag?: (tag: string) => void;
  onFilterByTag?: (tag: string) => void;
  selectedTag?: string;
}

export const TagsManager = ({ 
  tags, 
  onAddTag, 
  onRemoveTag,
  onFilterByTag,
  selectedTag
}: TagsManagerProps) => {
  const [newTag, setNewTag] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTag = () => {
    if (newTag.trim() && onAddTag) {
      onAddTag(newTag.trim());
      setNewTag("");
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Tag className="h-4 w-4 mr-2 text-primary" />
          <h3 className="text-sm font-medium">Tags</h3>
        </div>
        {onAddTag && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs"
            onClick={() => setIsAdding(!isAdding)}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="flex items-center gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Enter tag name"
            className="h-7 text-xs"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddTag();
            }}
          />
          <Button size="sm" className="h-7" onClick={handleAddTag}>Add</Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {tags.length > 0 ? (
          tags.map((tag) => (
            <Badge 
              key={tag} 
              variant={selectedTag === tag ? "default" : "outline"} 
              className="cursor-pointer flex items-center gap-1"
              onClick={() => onFilterByTag && onFilterByTag(tag)}
            >
              {tag}
              {onRemoveTag && (
                <X 
                  className="h-3 w-3 ml-1" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveTag(tag);
                  }}
                />
              )}
            </Badge>
          ))
        ) : (
          <p className="text-xs text-muted-foreground">No tags yet</p>
        )}
      </div>
    </div>
  );
};
