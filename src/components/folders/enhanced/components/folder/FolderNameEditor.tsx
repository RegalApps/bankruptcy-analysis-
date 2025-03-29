
import { useState, useEffect } from "react";

interface FolderNameEditorProps {
  isEditing: boolean;
  name: string;
  onRename: (newName: string) => void;
  onCancelEdit: () => void;
}

export const FolderNameEditor = ({ isEditing, name, onRename, onCancelEdit }: FolderNameEditorProps) => {
  const [newName, setNewName] = useState(name);

  useEffect(() => {
    setNewName(name);
  }, [name, isEditing]);

  const handleRename = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onRename(newName);
    } else if (e.key === 'Escape') {
      onCancelEdit();
    }
  };

  if (!isEditing) {
    return null;
  }

  return (
    <input
      type="text"
      value={newName}
      onChange={(e) => setNewName(e.target.value)}
      onKeyDown={handleRename}
      onBlur={onCancelEdit}
      autoFocus
      className="text-sm px-1 py-0.5 border border-primary rounded flex-1 outline-none"
      onClick={(e) => e.stopPropagation()}
    />
  );
};
