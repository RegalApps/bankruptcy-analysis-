
import { useState } from "react";
import { ChevronDown, Users, Shield, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

// Mock client data
const clients = [
  { id: 1, name: "Acme Corporation", avatar: "/placeholder.svg" },
  { id: 2, name: "Globex Industries", avatar: "/placeholder.svg" },
  { id: 3, name: "Oceanic Airlines", avatar: "/placeholder.svg" },
  { id: 4, name: "Stark Enterprises", avatar: "/placeholder.svg" },
  { id: 5, name: "Wayne Industries", avatar: "/placeholder.svg" },
];

interface AuditTrailHeaderProps {
  onClientChange: (clientId: number) => void;
}

export const AuditTrailHeader = ({ onClientChange }: AuditTrailHeaderProps) => {
  const [selectedClient, setSelectedClient] = useState(clients[0]);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const handleClientSelect = (client: typeof clients[0]) => {
    setSelectedClient(client);
    onClientChange(client.id);
  };

  const handleVerifyCompliance = () => {
    setIsVerifyDialogOpen(true);
  };

  const handleConfirmVerification = () => {
    setIsVerifying(true);
    
    // Simulate the verification process
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerifyDialogOpen(false);
      
      // Show success toast
      toast({
        title: "Compliance Report Sent",
        description: "The audit compliance report has been securely emailed to the authorized recipients.",
        variant: "default",
      });
    }, 2000);
  };

  return (
    <div className="flex items-center justify-between py-4 border-b">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">SecureFiles AI Audit Trail</h2>
        <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          Secure • Compliant • Immutable
        </span>
        <Button 
          onClick={handleVerifyCompliance}
          className="flex items-center gap-2"
          variant="outline"
          size="sm"
        >
          <Shield className="h-4 w-4" />
          <span>Verify Compliance & Email</span>
        </Button>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-accent/20 transition-colors">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={selectedClient.avatar} alt={selectedClient.name} />
              <AvatarFallback><Users className="h-4 w-4" /></AvatarFallback>
            </Avatar>
            <span>{selectedClient.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px]">
          {clients.map((client) => (
            <DropdownMenuItem 
              key={client.id}
              onClick={() => handleClientSelect(client)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Avatar className="h-6 w-6">
                <AvatarImage src={client.avatar} alt={client.name} />
                <AvatarFallback><Users className="h-4 w-4" /></AvatarFallback>
              </Avatar>
              <span>{client.name}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Compliance Verification Dialog */}
      <Dialog open={isVerifyDialogOpen} onOpenChange={setIsVerifyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Verify Compliance & Send Report
            </DialogTitle>
            <DialogDescription>
              This will generate a secure, encrypted compliance audit report and email it to authorized government recipients.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="bg-muted p-3 rounded-md">
                <h4 className="font-medium text-sm mb-1">Report Information</h4>
                <p className="text-sm text-muted-foreground">
                  Client: {selectedClient.name}<br />
                  Period: Last 30 days<br />
                  Format: Secure Encrypted PDF
                </p>
              </div>
              
              <div className="bg-muted p-3 rounded-md">
                <h4 className="font-medium text-sm mb-1">Authorized Recipients</h4>
                <p className="text-sm text-muted-foreground">
                  • Federal Regulatory Commission<br />
                  • Department of Financial Oversight<br />
                  • Client Authorized Representative
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-between">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleConfirmVerification} 
              disabled={isVerifying}
              className="gap-2"
            >
              {isVerifying ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                  Verifying...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Confirm & Send Report
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
