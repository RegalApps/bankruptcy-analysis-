
import { useState } from "react";
import { ChevronRight, ChevronDown, FolderPlus, Trash2, Edit, Merge } from "lucide-react";
import { FolderIcon } from "./FolderIcon";
import { StatusIcon, DocumentStatus } from "./StatusIcon";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

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
  
  // State for folder management
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isMergeFolderDialogOpen, setIsMergeFolderDialogOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderType, setNewFolderType] = useState<FolderType>("default");
  const [selectedFolderForMerge, setSelectedFolderForMerge] = useState<string>("");
  const [targetFolderForMerge, setTargetFolderForMerge] = useState<string>("");
  const [folderToDelete, setFolderToDelete] = useState<string>("");
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingNodeName, setEditingNodeName] = useState<string>("");
  const [selectedParentFolder, setSelectedParentFolder] = useState<string | null>(null);
  
  // Writable copy of tree
  const [nodesState, setNodesState] = useState<TreeNode[]>(rootNodes);
  
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
  
  // Create a new folder
  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast.error("Folder name cannot be empty");
      return;
    }
    
    const newFolder: TreeNode = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      type: 'folder',
      folderType: newFolderType,
      children: []
    };
    
    if (selectedParentFolder) {
      // Add as child to selected parent
      setNodesState(prev => {
        return addChildToFolder(prev, selectedParentFolder, newFolder);
      });
    } else {
      // Add at root level
      setNodesState(prev => [...prev, newFolder]);
    }
    
    toast.success(`Folder "${newFolderName}" created successfully`);
    setNewFolderName("");
    setNewFolderType("default");
    setSelectedParentFolder(null);
    setIsNewFolderDialogOpen(false);
  };
  
  // Helper function to add a child to a folder in the tree
  const addChildToFolder = (nodes: TreeNode[], parentId: string, newChild: TreeNode): TreeNode[] => {
    return nodes.map(node => {
      if (node.id === parentId) {
        return {
          ...node,
          children: [...(node.children || []), newChild]
        };
      }
      
      if (node.children) {
        return {
          ...node,
          children: addChildToFolder(node.children, parentId, newChild)
        };
      }
      
      return node;
    });
  };
  
  // Delete a folder
  const handleDeleteFolder = () => {
    if (!folderToDelete) return;
    
    setNodesState(prev => {
      return deleteNodeFromTree(prev, folderToDelete);
    });
    
    toast.success("Folder deleted successfully");
    setIsDeleteConfirmOpen(false);
    setFolderToDelete("");
  };
  
  // Helper function to delete a node from the tree
  const deleteNodeFromTree = (nodes: TreeNode[], nodeId: string): TreeNode[] => {
    return nodes.filter(node => node.id !== nodeId).map(node => {
      if (node.children) {
        return {
          ...node,
          children: deleteNodeFromTree(node.children, nodeId)
        };
      }
      return node;
    });
  };
  
  // Merge folders
  const handleMergeFolders = () => {
    if (!selectedFolderForMerge || !targetFolderForMerge || selectedFolderForMerge === targetFolderForMerge) {
      toast.error("Please select different source and target folders");
      return;
    }
    
    const sourceFolder = findNodeInTree(nodesState, selectedFolderForMerge);
    const targetFolder = findNodeInTree(nodesState, targetFolderForMerge);
    
    if (!sourceFolder || !targetFolder) {
      toast.error("One of the selected folders was not found");
      return;
    }
    
    // Merge the children
    setNodesState(prev => {
      return mergeNodeChildren(prev, selectedFolderForMerge, targetFolderForMerge);
    });
    
    toast.success("Folders merged successfully");
    setIsMergeFolderDialogOpen(false);
    setSelectedFolderForMerge("");
    setTargetFolderForMerge("");
  };
  
  // Helper function to find a node in the tree
  const findNodeInTree = (nodes: TreeNode[], nodeId: string): TreeNode | null => {
    for (const node of nodes) {
      if (node.id === nodeId) return node;
      
      if (node.children) {
        const foundInChildren = findNodeInTree(node.children, nodeId);
        if (foundInChildren) return foundInChildren;
      }
    }
    
    return null;
  };
  
  // Helper function to merge node children
  const mergeNodeChildren = (nodes: TreeNode[], sourceId: string, targetId: string): TreeNode[] => {
    const sourceNode = findNodeInTree(nodes, sourceId);
    
    if (!sourceNode) return nodes;
    
    const updatedNodes = nodes.map(node => {
      if (node.id === targetId) {
        // Add source node's children to target node
        return {
          ...node,
          children: [
            ...(node.children || []),
            ...(sourceNode.children || [])
          ]
        };
      }
      
      if (node.children) {
        return {
          ...node,
          children: mergeNodeChildren(node.children, sourceId, targetId)
        };
      }
      
      return node;
    });
    
    // Remove the source node
    return deleteNodeFromTree(updatedNodes, sourceId);
  };
  
  // Handle rename node
  const startEditingNode = (nodeId: string, nodeName: string, event: React.MouseEvent) => {
    event.stopPropagation();
    setEditingNodeId(nodeId);
    setEditingNodeName(nodeName);
  };
  
  const handleRenameNode = (nodeId: string) => {
    if (!editingNodeName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    
    setNodesState(prev => {
      return renameNodeInTree(prev, nodeId, editingNodeName);
    });
    
    toast.success("Renamed successfully");
    setEditingNodeId(null);
    setEditingNodeName("");
  };
  
  // Helper function to rename a node in the tree
  const renameNodeInTree = (nodes: TreeNode[], nodeId: string, newName: string): TreeNode[] => {
    return nodes.map(node => {
      if (node.id === nodeId) {
        return {
          ...node,
          name: newName
        };
      }
      
      if (node.children) {
        return {
          ...node,
          children: renameNodeInTree(node.children, nodeId, newName)
        };
      }
      
      return node;
    });
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
  
  // Get all folders for selection in dialogs
  const getAllFolders = (nodes: TreeNode[]): TreeNode[] => {
    let folders: TreeNode[] = [];
    
    nodes.forEach(node => {
      if (node.type === 'folder') {
        folders.push(node);
        
        if (node.children) {
          folders = [...folders, ...getAllFolders(node.children)];
        }
      }
    });
    
    return folders;
  };
  
  const allFolders = getAllFolders(nodesState);
  
  // Recursive rendering of tree nodes
  const renderNode = (node: TreeNode, level: number = 0) => {
    const isNodeExpanded = isExpanded(node.id);
    const hasChildren = node.children && node.children.length > 0;
    
    return (
      <div key={node.id} className="select-none">
        <div 
          className={cn(
            "flex items-center py-2 px-2 hover:bg-accent/50 rounded-md cursor-pointer",
            "transition-colors duration-100 group"
          )}
          style={{ paddingLeft: `${(level * 20) + 8}px` }}
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
          {editingNodeId === node.id ? (
            <div className="flex-1 flex items-center">
              <Input 
                value={editingNodeName}
                onChange={(e) => setEditingNodeName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRenameNode(node.id);
                  } else if (e.key === 'Escape') {
                    setEditingNodeId(null);
                  }
                }}
                autoFocus
                className="h-7 py-1 text-sm"
                onClick={(e) => e.stopPropagation()}
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-1 h-7 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRenameNode(node.id);
                }}
              >
                Save
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 px-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingNodeId(null);
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div 
              className="flex-1 truncate font-medium text-sm" 
              onClick={() => handleNodeClick(node, false)}
            >
              {node.name}
            </div>
          )}
          
          {/* Status indicator if available */}
          {node.status && (
            <div className="ml-2">
              <StatusIcon status={node.status} />
            </div>
          )}
          
          {/* Action buttons - only visible on hover */}
          <div className="opacity-0 group-hover:opacity-100 flex ml-2 gap-1">
            {node.type === 'folder' && (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedParentFolder(node.id);
                    setIsNewFolderDialogOpen(true);
                  }}
                >
                  <FolderPlus className="h-3.5 w-3.5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFolderToDelete(node.id);
                    setIsDeleteConfirmOpen(true);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={(e) => startEditingNode(node.id, node.name, e)}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
          </div>
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
    <div className="space-y-4">
      {/* Folder management toolbar */}
      <div className="flex items-center gap-2 px-4 pb-2 border-b">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedParentFolder(null);
            setIsNewFolderDialogOpen(true);
          }}
          className="flex items-center gap-1"
        >
          <FolderPlus className="h-4 w-4" />
          <span>New Folder</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMergeFolderDialogOpen(true)}
          className="flex items-center gap-1"
        >
          <Merge className="h-4 w-4" />
          <span>Merge Folders</span>
        </Button>
      </div>
      
      {/* Tree nodes */}
      <div className="p-4 pt-0">
        {nodesState.map(node => renderNode(node))}
      </div>
      
      {/* New Folder Dialog */}
      <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              {selectedParentFolder 
                ? "Create a new subfolder inside the selected folder." 
                : "Create a new folder at the root level."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="folderType">Folder Type</Label>
              <select
                id="folderType"
                value={newFolderType}
                onChange={(e) => setNewFolderType(e.target.value as FolderType)}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background"
              >
                <option value="default">Default</option>
                <option value="client">Client</option>
                <option value="estate">Estate</option>
                <option value="form">Form</option>
                <option value="financials">Financials</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setNewFolderName("");
              setNewFolderType("default");
              setSelectedParentFolder(null);
              setIsNewFolderDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create Folder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Merge Folders Dialog */}
      <Dialog open={isMergeFolderDialogOpen} onOpenChange={setIsMergeFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Merge Folders</DialogTitle>
            <DialogDescription>
              Select the source folder and target folder to merge. 
              All contents from the source folder will be moved to the target folder, 
              and the source folder will be deleted.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sourceFolder">Source Folder</Label>
              <select
                id="sourceFolder"
                value={selectedFolderForMerge}
                onChange={(e) => setSelectedFolderForMerge(e.target.value)}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background"
              >
                <option value="">Select source folder</option>
                {allFolders.map(folder => (
                  <option key={folder.id} value={folder.id}>
                    {folder.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="targetFolder">Target Folder</Label>
              <select
                id="targetFolder"
                value={targetFolderForMerge}
                onChange={(e) => setTargetFolderForMerge(e.target.value)}
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background"
              >
                <option value="">Select target folder</option>
                {allFolders
                  .filter(folder => folder.id !== selectedFolderForMerge)
                  .map(folder => (
                    <option key={folder.id} value={folder.id}>
                      {folder.name}
                    </option>
                  ))
                }
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setSelectedFolderForMerge("");
              setTargetFolderForMerge("");
              setIsMergeFolderDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleMergeFolders}>Merge Folders</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Folder</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this folder? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setFolderToDelete("");
              setIsDeleteConfirmOpen(false);
            }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteFolder}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
