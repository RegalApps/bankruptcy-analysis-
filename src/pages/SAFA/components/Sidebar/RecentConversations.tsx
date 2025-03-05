
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const RecentConversations = () => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Recent Conversations</h2>
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-8" placeholder="Search conversations..." />
      </div>
    </div>
  );
};
