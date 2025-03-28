
import React, { useState } from 'react';
import { Document } from '@/components/DocumentList/types';
import { FolderStructure } from '@/types/folders';
import { mapDocumentsToFolderStructure } from './hooks/utils/folderMapperUtils';

// Basic skeleton for EnhancedFolderTab component
const EnhancedFolderTab = ({ 
  documents, 
  onDocumentOpen,
  onRefresh,
  onClientSelect,
  clients
}: { 
  documents: Document[]; 
  onDocumentOpen: (id: string) => void;
  onRefresh: () => void;
  onClientSelect?: (id: string) => void;
  clients?: any[];
}) => {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  
  // Convert documents to folder structures
  const folderStructures = mapDocumentsToFolderStructure(documents);
  
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">Document Management</h2>
      <p>Total Folders: {folderStructures.length}</p>
      <p>Total Documents: {documents.filter(doc => !doc.is_folder).length}</p>
      
      {/* Display a list of folder names for debugging */}
      <div className="mt-4">
        <h3 className="font-medium mb-2">Folders:</h3>
        <ul className="space-y-1">
          {folderStructures.map(folder => (
            <li key={folder.id} className="text-sm">
              {folder.title || folder.name}
            </li>
          ))}
        </ul>
      </div>
      
      {/* Show clients if available */}
      {clients && clients.length > 0 && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">Clients:</h3>
          <ul className="space-y-1">
            {clients.map(client => (
              <li key={client.id} className="text-sm">
                <button 
                  onClick={() => onClientSelect?.(client.id)}
                  className="text-blue-500 hover:underline"
                >
                  {client.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Basic refresh button */}
      <button
        onClick={onRefresh}
        className="mt-4 px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-sm"
      >
        Refresh
      </button>
    </div>
  );
};

export { EnhancedFolderTab };
