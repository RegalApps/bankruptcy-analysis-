
import { Button } from "@/components/ui/button";
import { Upload, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileUpload } from "@/components/FileUpload";
import { SearchBar } from "@/components/DocumentList/SearchBar";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export const MainHeader = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
      
      // Force a page reload to ensure all auth state is cleared
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "There was a problem signing you out. Please try again.",
      });
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-16 items-center px-6 gap-4">
        <div className="flex-1 flex justify-center max-w-2xl mx-auto">
          <div className="w-full">
            <SearchBar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gradient-button">
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-panel max-w-xl">
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
              </DialogHeader>
              <div className="p-4">
                <FileUpload onUploadComplete={() => {}} />
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};
