
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CreateFormButtonProps {
  clientId?: string;
}

export const CreateFormButton = ({ clientId }: CreateFormButtonProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    // Navigate to the form tab
    navigate('/activity', { state: { switchTab: 'form', clientId } });
  };
  
  return (
    <Button 
      onClick={handleClick} 
      className="flex items-center gap-2 w-full"
      size="lg"
    >
      <Plus className="h-4 w-4" />
      Create New Income & Expense Form
    </Button>
  );
};
