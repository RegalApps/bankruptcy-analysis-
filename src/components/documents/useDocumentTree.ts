
import { useEffect, useState } from 'react';
import { DocumentTreeNode } from '@/utils/documents/types';
import { setupDocumentSync, buildDocumentTree } from '@/utils/documents/documentSync';

export const useDocumentTree = () => {
  const [documentTree, setDocumentTree] = useState<DocumentTreeNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshTree = async () => {
    setIsLoading(true);
    try {
      const tree = await buildDocumentTree();
      setDocumentTree(tree);
    } catch (error) {
      console.error('Error refreshing document tree:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshTree();
    const cleanup = setupDocumentSync(refreshTree);
    return cleanup;
  }, []);

  return {
    documentTree,
    isLoading,
    refreshTree
  };
};
