
import { Document, DocumentNode } from "../types";

export const determineFileType = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf':
      return 'PDF Document';
    case 'doc':
    case 'docx':
      return 'Word Document';
    case 'xls':
    case 'xlsx':
      return 'Excel Spreadsheet';
    case 'ppt':
    case 'pptx':
      return 'PowerPoint Presentation';
    case 'txt':
      return 'Text Document';
    default:
      return 'Other';
  }
};

export const organizeDocumentsIntoTree = (docs: Document[]): DocumentNode[] => {
  // First, group by client (assuming we extract client from metadata)
  const clientGroups = docs.reduce((acc, doc) => {
    const clientName = doc.metadata?.client_name || 'Uncategorized';
    if (!acc[clientName]) {
      acc[clientName] = [];
    }
    acc[clientName].push(doc);
    return acc;
  }, {} as Record<string, Document[]>);

  // Then, for each client, group by document type
  return Object.entries(clientGroups).map(([clientName, clientDocs]) => {
    const typeGroups = clientDocs.reduce((acc, doc) => {
      const type = doc.type || 'Other';
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(doc);
      return acc;
    }, {} as Record<string, Document[]>);

    // Create the tree structure
    return {
      id: clientName,
      title: clientName,
      type: 'client',
      children: Object.entries(typeGroups).map(([type, docs]) => ({
        id: `${clientName}-${type}`,
        title: type,
        type: 'category',
        children: docs.map(doc => ({
          id: doc.id,
          title: doc.title,
          type: 'document'
        }))
      }))
    };
  });
};
