
import { supabase } from "@/lib/supabase";
import { Document } from "@/components/DocumentList/types";
import { FolderStructure, FolderAIRecommendation, FolderPermissionRule, UserRole } from "@/types/folders";
import { toast } from "sonner";

export const folderService = {
  /**
   * Get all folders
   */
  async getFolders(): Promise<FolderStructure[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('is_folder', true)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Transform to FolderStructure
      return this.buildFolderStructure(data || []);
    } catch (error) {
      console.error('Error fetching folders:', error);
      toast.error('Failed to load folders');
      return [];
    }
  },

  /**
   * Build folder hierarchy from flat array
   */
  buildFolderStructure(folders: Document[]): FolderStructure[] {
    const folderMap: Record<string, FolderStructure> = {};
    const rootFolders: FolderStructure[] = [];

    // First pass: create folder objects
    folders.forEach(folder => {
      folderMap[folder.id] = {
        id: folder.id,
        name: folder.title,
        type: this.determineFolderType(folder),
        children: [],
        parentId: folder.parent_folder_id,
        level: 0,
        metadata: folder.metadata
      };
    });

    // Second pass: build the hierarchy
    Object.values(folderMap).forEach(folder => {
      if (folder.parentId && folderMap[folder.parentId]) {
        // Add to parent's children
        folderMap[folder.parentId].children?.push(folder);
        // Set level based on parent
        folder.level = (folderMap[folder.parentId].level || 0) + 1;
      } else {
        // Root level folder
        rootFolders.push(folder);
      }
    });

    return rootFolders;
  },

  /**
   * Determine folder type from Document
   */
  determineFolderType(folder: Document): 'client' | 'form' | 'financial' | 'general' {
    if (folder.folder_type === 'client') return 'client';
    if (folder.folder_type?.includes('Form') || folder.folder_type?.includes('form')) return 'form';
    if (folder.folder_type?.includes('Financial') || 
        folder.folder_type?.includes('financial') || 
        folder.folder_type?.includes('Income') || 
        folder.folder_type?.includes('Expense')) return 'financial';
    return 'general';
  },

  /**
   * Move document to folder
   */
  async moveDocumentToFolder(documentId: string, folderId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ parent_folder_id: folderId })
        .eq('id', documentId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error moving document:', error);
      toast.error('Failed to move document');
      return false;
    }
  },

  /**
   * Create new folder
   */
  async createFolder(
    name: string,
    folderType: 'client' | 'form' | 'financial' | 'general',
    parentId?: string
  ): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          title: name,
          is_folder: true,
          folder_type: folderType,
          parent_folder_id: parentId || null,
          type: 'folder',
          size: 0
        })
        .select('id')
        .single();

      if (error) throw error;
      toast.success('Folder created successfully');
      return data.id;
    } catch (error) {
      console.error('Error creating folder:', error);
      toast.error('Failed to create folder');
      return null;
    }
  },

  /**
   * Delete folder (only if empty)
   */
  async deleteFolder(folderId: string): Promise<boolean> {
    try {
      // Check if folder has documents
      const { data: documents, error: checkError } = await supabase
        .from('documents')
        .select('id')
        .eq('parent_folder_id', folderId);

      if (checkError) throw checkError;

      if (documents && documents.length > 0) {
        toast.error('Cannot delete non-empty folder');
        return false;
      }

      // Delete the folder
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', folderId);

      if (error) throw error;
      toast.success('Folder deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast.error('Failed to delete folder');
      return false;
    }
  },

  /**
   * Rename folder
   */
  async renameFolder(folderId: string, newName: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ title: newName })
        .eq('id', folderId);

      if (error) throw error;
      toast.success('Folder renamed successfully');
      return true;
    } catch (error) {
      console.error('Error renaming folder:', error);
      toast.error('Failed to rename folder');
      return false;
    }
  },

  /**
   * Get documents in folder
   */
  async getDocumentsInFolder(folderId: string): Promise<Document[]> {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('parent_folder_id', folderId)
        .eq('is_folder', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching documents in folder:', error);
      toast.error('Failed to load documents');
      return [];
    }
  },

  /**
   * Get folder permissions
   */
  async getFolderPermissions(userId: string): Promise<FolderPermissionRule[]> {
    // In a real implementation, this would fetch from a database
    // For now, return simulated permissions (all full access)
    try {
      const { data: folders } = await supabase
        .from('documents')
        .select('id')
        .eq('is_folder', true);

      return (folders || []).map(folder => ({
        folderId: folder.id,
        userId,
        permission: 'full'
      }));
    } catch (error) {
      console.error('Error fetching folder permissions:', error);
      return [];
    }
  },

  /**
   * Get AI folder recommendations for a document
   */
  async getAIFolderRecommendation(documentId: string): Promise<FolderAIRecommendation | null> {
    try {
      // Get document details
      const { data: document, error: docError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (docError) throw docError;

      // In the real implementation, this would call an AI service
      // For now, use title patterns to suggest folders
      const folders = await this.getFolders();
      const flatFolders = this.flattenFolderStructure(folders);

      const clientName = document.metadata?.client_name || '';
      const isFinancial = document.title.toLowerCase().includes('financial') || 
                          document.title.toLowerCase().includes('income') ||
                          document.title.toLowerCase().includes('expense') ||
                          document.title.toLowerCase().includes('balance') ||
                          document.title.toLowerCase().includes('sheet') ||
                          document.type?.includes('excel');
      
      const isForm = document.title.toLowerCase().includes('form') ||
                     document.title.toLowerCase().includes('agreement') ||
                     document.title.toLowerCase().includes('contract');

      // Find matching client folder
      const clientFolder = flatFolders.find(f => 
        f.type === 'client' && 
        f.name.toLowerCase().includes(clientName.toLowerCase())
      );

      if (!clientFolder) return null;

      // Look for matching document type subfolder
      const typeSubfolders = flatFolders.filter(f => 
        f.parentId === clientFolder.id
      );

      let targetFolder: FolderStructure | undefined;
      
      if (isFinancial) {
        targetFolder = typeSubfolders.find(f => f.type === 'financial');
      } else if (isForm) {
        targetFolder = typeSubfolders.find(f => f.type === 'form');
      }

      if (!targetFolder) return null;

      // Build path names
      const path = [clientFolder.name, targetFolder.name];

      return {
        documentId,
        suggestedFolderId: targetFolder.id,
        confidence: 0.85,
        suggestedPath: path,
        alternatives: typeSubfolders
          .filter(f => f.id !== targetFolder?.id)
          .map(f => ({
            folderId: f.id,
            confidence: 0.4,
            path: [clientFolder.name, f.name]
          }))
      };
    } catch (error) {
      console.error('Error getting AI folder recommendation:', error);
      return null;
    }
  },

  /**
   * Flatten folder hierarchy for easy searching
   */
  flattenFolderStructure(folders: FolderStructure[]): FolderStructure[] {
    let result: FolderStructure[] = [];
    
    for (const folder of folders) {
      result.push(folder);
      if (folder.children && folder.children.length > 0) {
        result = result.concat(this.flattenFolderStructure(folder.children));
      }
    }
    
    return result;
  },

  /**
   * Check if user has permission for an action
   */
  hasPermission(
    folderId: string, 
    action: 'view' | 'edit' | 'delete', 
    userRole: UserRole,
    permissions: FolderPermissionRule[]
  ): boolean {
    // Admin has all permissions
    if (userRole === 'admin') return true;
    
    // Check specific folder permission
    const folderPermission = permissions.find(p => p.folderId === folderId);
    if (folderPermission) {
      if (folderPermission.permission === 'full') return true;
      if (folderPermission.permission === 'edit' && (action === 'view' || action === 'edit')) return true;
      if (folderPermission.permission === 'view' && action === 'view') return true;
    }
    
    // Role-based fallback permissions
    if (userRole === 'manager' && action !== 'delete') return true;
    if (userRole === 'reviewer' && action === 'view') return true;
    
    return false;
  }
};
