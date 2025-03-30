
import React, { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

interface NotesTextareaProps {
  notes: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const NotesTextarea = ({ notes, onChange }: NotesTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  return (
    <Textarea
      ref={textareaRef}
      value={notes}
      onChange={onChange}
      placeholder="Type your meeting notes here..."
      className="h-full min-h-[calc(100vh-120px)] resize-none rounded-t-none border-x-0 border-b-0 focus-visible:ring-0 focus-visible:ring-offset-0"
    />
  );
};
