
import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useIsTablet } from "@/hooks/use-tablet";

export const BackNavigation = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="mb-4">
      <Button 
        variant="ghost" 
        size={isMobile ? "sm" : "default"}
        onClick={handleBack}
        className="flex items-center text-xs sm:text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        {(!isMobile || isTablet) && "Back to Documents"}
        {isMobile && !isTablet && "Back"}
      </Button>
    </div>
  );
};
