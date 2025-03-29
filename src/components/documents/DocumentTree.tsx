
import { useState } from "react";
import { FolderIcon } from "./FolderIcon";
import { StatusIcon, DocumentStatus } from "./StatusIcon";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronDown, MoreHorizontal, Edit2, Trash2, MoveIcon, History } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Tree node types
interface TreeNode {
  id: string;
  name: string;
  type: 'folder' | 'file';
  folderType?: 'client' | 'estate' | 'form' | 'financials' | 'default';
  status?: DocumentStatus;
  children?: TreeNode[];
  filePath?: string;
}

interface DocumentTreeProps {
  rootNodes: TreeNode[];
  onNodeSelect: (node: TreeNode) => void;
  onFileOpen?: (node: TreeNode) => void;
}

export const DocumentTree = ({ rootNodes, onNodeSelect, onFileOpen }: DocumentTreeProps) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>(
    // Start with the first level expanded by default
    rootNodes.reduce((acc, node) => ({ ...acc, [node.id]: true }), {})
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  
  const handleNodeClick = (node: TreeNode) => {
    setSelectedNodeId(node.id);
    onNodeSelect(node);
    
    if (node.type === 'file' && onFileOpen) {
      onFileOpen(node);
    }
  };
  
  const toggleNode = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };
  
  const handleDoubleClick = (node: TreeNode, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Start editing for this node
    setEditingNodeId(node.id);
    setEditingName(node.name);
  };
  
  const handleRename = (nodeId: string) => {
    // In a real app, this would save the rename to the database
    console.log(`Renamed node ${nodeId} to ${editingName}`);
    setEditingNodeId(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent, nodeId: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRename(nodeId);
    } else if (e.key === 'Escape') {
      setEditingNodeId(null);
    }
  };
  
  // Recursive function to render a node and its children
  const renderNode = (node: TreeNode, level: number = 0) => {
    const isExpanded = expandedNodes[node.id] || false;
    const isSelected = selectedNodeId === node.id;
    const isEditing = editingNodeId === node.id;
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.id}>
        <div
          className={cn(
            "flex items-center py-1 px-2 rounded-sm transition-colors",
            isSelected ? "bg-primary/10" : "hover:bg-accent/50",
            "cursor-pointer"
          )}
          onClick={() => handleNodeClick(node)}
          onDoubleClick={(e) => handleDoubleClick(node, e)}
          style={{ paddingLeft: `${(level * 16) + 8}px` }}
        >
          {hasChildren && (
            <div 
              className="mr-1 cursor-pointer p-1 hover:bg-accent rounded-sm"
              onClick={(e) => toggleNode(node.id, e)}
            >
              {isExpanded ? 
                <ChevronDown className="h-4 w-4 text-muted-foreground" /> : 
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              }
            </div>
          )}
          
          {!hasChildren && <div className="w-6"></div>}
          
          <div className="mr-2">
            {node.type === 'folder' ? (
              <FolderIcon 
                type={node.folderType || 'default'} 
                isExpanded={isExpanded} 
              />
            ) : (
              <FolderIcon 
                type="default" 
                fileName={node.name} 
              />
            )}
          </div>
          
          {isEditing ? (
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={() => handleRename(node.id)}
              onKeyDown={(e) => handleKeyDown(e, node.id)}
              autoFocus
              className="flex-1 bg-transparent border border-primary rounded px-1 outline-none"
            />
          ) : (
            <span className="flex-1">{node.name}</span>
          )}
          
          {node.status && node.status !== 'none' && (
            <StatusIcon status={node.status} className="ml-2" />
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div 
                className="p-1 rounded-sm opacity-70 hover:opacity-100 hover:bg-accent"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditingNodeId(node.id)}>
                <Edit2 className="mr-2 h-4 w-4" />
                <span>Rename</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MoveIcon className="mr-2 h-4 w-4" />
                <span>Move</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <History className="mr-2 h-4 w-4" />
                <span>View History</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {node.children!.map(childNode => renderNode(childNode, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="p-2 h-full overflow-auto">
      {rootNodes.map(node => renderNode(node))}
    </div>
  );
};
