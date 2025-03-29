
interface FolderBadgesProps {
  folderType: string;
  form47Count: number;
  formDocumentsCount: number;
  documentsCount: number;
}

export const FolderBadges = ({ folderType, form47Count, formDocumentsCount, documentsCount }: FolderBadgesProps) => {
  // Special highlight for Form 47 documents in Forms folder
  if (folderType === 'form' && form47Count > 0) {
    return (
      <span className="ml-auto text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
        Form 47 ({form47Count})
      </span>
    );
  }
  
  // Show form documents count with special badge for Forms folder
  if (folderType === 'form' && form47Count === 0 && formDocumentsCount > 0) {
    return (
      <span className="ml-auto text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
        {formDocumentsCount}
      </span>
    );
  }
  
  // Show regular document count for other folders
  if (folderType !== 'form' && documentsCount > 0) {
    return (
      <span className="ml-auto text-xs text-muted-foreground">{documentsCount}</span>
    );
  }
  
  return null;
};
