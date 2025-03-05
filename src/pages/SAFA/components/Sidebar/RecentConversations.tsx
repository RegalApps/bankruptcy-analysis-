
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Conversation {
  id: string;
  title: string;
  last_message: string;
  timestamp: Date;
}

export const RecentConversations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;
        
        // Get conversations from localStorage for now as a placeholder
        // In a real app, you would fetch from the database
        const storedConversations = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.includes('_messages')) {
            const moduleType = key.split('_')[0];
            const messages = JSON.parse(localStorage.getItem(key) || '[]');
            if (messages.length > 0) {
              storedConversations.push({
                id: moduleType + '_' + Date.now(),
                title: moduleType.charAt(0).toUpperCase() + moduleType.slice(1) + ' Conversation',
                last_message: messages[messages.length - 1].content,
                timestamp: new Date(messages[messages.length - 1].timestamp || Date.now())
              });
            }
          }
        }
        
        setConversations(storedConversations);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const filteredConversations = conversations.filter(
    convo => 
      convo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      convo.last_message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Recent Conversations</h2>
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input 
          className="pl-8" 
          placeholder="Search conversations..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <ScrollArea className="h-[200px] pr-4">
        {isLoading ? (
          <div className="py-2 text-sm text-muted-foreground">Loading conversations...</div>
        ) : filteredConversations.length > 0 ? (
          <div className="space-y-2">
            {filteredConversations.map((convo) => (
              <div 
                key={convo.id}
                className="p-2 rounded-md hover:bg-muted cursor-pointer text-sm"
              >
                <div className="font-medium">{convo.title}</div>
                <div className="text-xs text-muted-foreground truncate">{convo.last_message}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {convo.timestamp.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-2 text-sm text-muted-foreground">No conversations found</div>
        )}
      </ScrollArea>
    </div>
  );
};
