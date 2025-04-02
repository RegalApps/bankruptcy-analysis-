
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LifeBuoy, TicketPlus } from "lucide-react";

export const SupportPage = () => {
  return (
    <MainLayout>
      <div className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Support Center</h1>
            <p className="text-muted-foreground mt-1">
              Get help with your account or application
            </p>
          </div>
          <Button asChild>
            <Link to="/support/new">
              <TicketPlus className="h-4 w-4 mr-2" />
              Create Ticket
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-6">
            <LifeBuoy className="h-6 w-6 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Support Resources</h2>
            <p className="text-muted-foreground mb-4">
              Browse our knowledge base and documentation to find answers to common questions.
            </p>
            <Button variant="outline">View Knowledge Base</Button>
          </div>
          
          <div className="border rounded-lg p-6">
            <TicketPlus className="h-6 w-6 text-primary mb-4" />
            <h2 className="text-xl font-semibold mb-2">Support Tickets</h2>
            <p className="text-muted-foreground mb-4">
              Create a support ticket to get help from our support team.
            </p>
            <Button asChild>
              <Link to="/support/new">
                Create New Ticket
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SupportPage;
