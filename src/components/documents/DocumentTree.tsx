
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { FolderIcon } from "./FolderIcon";
import { StatusIcon, DocumentStatus } from "./StatusIcon";
import { cn } from "@/lib/utils";

// Define node types
type NodeType = 'folder' | 'file';
type FolderType = 'client' | 'estate' | 'form' | 'financials' | 'default';

// Node structure
interface TreeNode {
  id: string;
  name: string;
  type: NodeType;
  folderType?: FolderType;
  status?: DocumentStatus;
  children?: TreeNode[];
  filePath?: string;
}

interface DocumentTreeProps {
  rootNodes: TreeNode[];
  onNodeSelect?: (node: TreeNode) => void;
  onFileOpen?: (node: TreeNode) => void;
}

export const DocumentTree = ({ 
  rootNodes,
  onNodeSelect,
  onFileOpen
}: DocumentTreeProps) => {
  // Track expanded nodes
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    // Pre-expand Josh Hart's folder
    "josh-hart-root": true,
    "estate-folder": true
  });
  
  // Toggle node expansion
  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };
  
  // Check if a node is expanded
  const isExpanded = (nodeId: string) => {
    return !!expandedNodes[nodeId];
  };
  
  // Handle click on a node
  const handleNodeClick = (node: TreeNode, isToggle: boolean) => {
    if (node.type === 'folder' && isToggle) {
      toggleNode(node.id);
    } else if (node.type === 'folder') {
      // Folder was clicked (not the toggle)
      toggleNode(node.id);
      if (onNodeSelect) onNodeSelect(node);
    } else if (node.type === 'file') {
      // File was clicked
      if (onFileOpen) onFileOpen(node);
    }
  };
  
  // Handle double click for renaming (stub for now)
  const handleDoubleClick = (node: TreeNode) => {
    console.log("Double-clicked for rename:", node);
    // Would add inline rename functionality here
  };
  
  // Recursive rendering of tree nodes
  const renderNode = (node: TreeNode, level: number = 0) => {
    const isNodeExpanded = isExpanded(node.id);
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.id} className="select-none">
        <div 
          className={cn(
            "flex items-center py-2 px-2 hover:bg-accent/50 rounded-md cursor-pointer",
            "transition-colors duration-100"
          )}
          style={{ paddingLeft: `${(level * 20) + 8}px` }}
          onDoubleClick={() => handleDoubleClick(node)}
        >
          {/* Toggle icon or spacer */}
          <div 
            className="mr-1.5 w-5 h-5 flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) handleNodeClick(node, true);
            }}
          >
            {hasChildren ? (
              isNodeExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : <span className="w-4"></span>}
          </div>
          
          {/* Folder/File icon */}
          <div className="mr-2.5" onClick={() => handleNodeClick(node, false)}>
            <FolderIcon 
              type={node.folderType || 'default'} 
              isExpanded={isNodeExpanded}
              fileName={node.type === 'file' ? node.name : undefined}
            />
          </div>
          
          {/* Node name */}
          <div 
            className="flex-1 truncate font-medium text-sm" 
            onClick={() => handleNodeClick(node, false)}
          >
            {node.name}
          </div>
          
          {/* Status indicator if available */}
          {node.status && (
            <div className="ml-2">
              <StatusIcon status={node.status} />
            </div>
          )}
        </div>
        
        {/* Render children if expanded */}
        {isNodeExpanded && hasChildren && (
          <div className="pl-4">
            {node.children!.map(childNode => renderNode(childNode, level + 1))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="p-4">
      {rootNodes.map(node => renderNode(node))}
    </div>
  );
};
