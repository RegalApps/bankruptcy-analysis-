
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import { IncomeExpenseModal } from "../form/IncomeExpenseModal";
import { Client } from "../types";

interface IncomeExpenseButtonProps {
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  onClientCreated?: (clientId: string, clientName: string) => void;
}

export const IncomeExpenseButton = ({ 
  variant = "default", 
  size = "lg", 
  className = "",
  onClientCreated
}: IncomeExpenseButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleOpenModal = () => {
    console.log("Opening Income & Expense Form Modal");
    setIsModalOpen(true);
  };
  
  const handleClientCreated = (clientId: string, clientName: string) => {
    if (onClientCreated) {
      onClientCreated(clientId, clientName);
    }
  };
  
  return (
    <>
      <Button 
        variant={variant} 
        size={size}
        className={`flex items-center gap-2 ${className}`}
        onClick={handleOpenModal}
      >
        <Plus className="h-4 w-4" />
        <FileText className="h-4 w-4" />
        Create Income & Expense Form
      </Button>
      
      <IncomeExpenseModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onClientCreated={handleClientCreated}
      />
    </>
  );
};
