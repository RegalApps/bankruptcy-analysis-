
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Header: React.FC = () => {
  return (
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Document Management</h1>
          <p className="text-lg text-muted-foreground">
            Upload, organize, and manage your documents efficiently
          </p>
        </div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};
