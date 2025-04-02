
import { MainLayout } from "@/components/layout/MainLayout";
import { NewTicketForm } from "@/components/support/NewTicketForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const NewSupportTicket = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4"
            asChild
          >
            <Link to="/support">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Support
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Create Support Ticket</h1>
          <p className="text-muted-foreground mt-1">
            Describe your issue and we'll connect you with the right support
          </p>
        </div>
        
        <NewTicketForm />
      </div>
    </MainLayout>
  );
};

export default NewSupportTicket;
