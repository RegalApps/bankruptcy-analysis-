
import { Button } from "@/components/ui/button";
import { Search, Upload } from "lucide-react";
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

export const MainHeader = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-16 items-center px-6 gap-8">
        <div className="w-64">
          <Button 
            variant="ghost" 
            className="font-semibold text-xl p-0 hover:bg-transparent"
            onClick={() => navigate('/')}
          >
            Document Management
          </Button>
        </div>
        
        <div className="flex-1 flex justify-center max-w-2xl mx-auto">
          <div className="w-full max-w-md">
            <SearchBar 
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>

        <div className="w-64 flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
              </DialogHeader>
              <div className="p-4">
                <FileUpload onUploadComplete={() => {}} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
};
