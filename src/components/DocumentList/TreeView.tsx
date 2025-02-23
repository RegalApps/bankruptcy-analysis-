
import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreeNode {
  id: string;
  title: string;
  type: string;
  children?: TreeNode[];
}

interface TreeViewProps {
  data: TreeNode[];
  onSelect: (id: string) => void;
  searchQuery?: string;
}

interface TreeNodeProps {
  node: TreeNode;
  onSelect: (id: string) => void;
  level?: number;
  searchQuery?: string;
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({ 
  node, 
  onSelect, 
  level = 0,
  searchQuery = "" 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  
  // Check if node or its children match search query
  const matchesSearch = (node: TreeNode): boolean => {
    const titleMatches = node.title.toLowerCase().includes(searchQuery.toLowerCase());
    if (titleMatches) return true;
    if (node.children) {
      return node.children.some(child => matchesSearch(child));
    }
    return false;
  };

  // If there's a search query and no matches, don't render this node
  if (searchQuery && !matchesSearch(node)) {
    return null;
  }

  const getIcon = () => {
    switch (node.type) {
      case 'client':
        return <Users className="h-4 w-4" />;
      case 'category':
        return <Folder className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  return (
    <div>
      <div 
        className={cn(
          "flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-accent",
          "transition-colors duration-200",
          level > 0 && "ml-4"
        )}
        onClick={() => {
          if (hasChildren) {
            setIsExpanded(!isExpanded);
          } else {
            onSelect(node.id);
          }
        }}
      >
        {hasChildren && (
          <button className="h-4 w-4 flex items-center justify-center">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
        {getIcon()}
        <span className="text-sm">{node.title}</span>
      </div>
      
      {isExpanded && hasChildren && (
        <div className="ml-4">
          {node.children?.map((child) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              onSelect={onSelect}
              level={level + 1}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const TreeView: React.FC<TreeViewProps> = ({ data, onSelect, searchQuery }) => {
  return (
    <div className="space-y-2">
      {data.map((node) => (
        <TreeNodeComponent
          key={node.id}
          node={node}
          onSelect={onSelect}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
};
