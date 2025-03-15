
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { IncomeExpenseModal } from "../form/IncomeExpenseModal";
import { Client } from "../types";

interface IncomeExpenseButtonProps {
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  selectedClient?: Client | null;
  onClientSelect?: (clientId: string) => void;
}

export const IncomeExpenseButton = ({ 
  variant = "default", 
  size = "lg", 
  className = "",
  selectedClient = null,
  onClientSelect
}: IncomeExpenseButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <>
      <Button 
        variant={variant} 
        size={size}
        className={`flex items-center gap-2 ${className}`}
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="h-4 w-4" />
        <FileText className="h-4 w-4" />
        Create Income & Expense Form
      </Button>
      
      <IncomeExpenseModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedClient={selectedClient}
        onClientSelect={onClientSelect}
      />
    </>
  );
};
