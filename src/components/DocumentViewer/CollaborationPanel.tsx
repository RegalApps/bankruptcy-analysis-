
import { useState } from "react";
import { MessageSquare, ClipboardList, History } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { DocumentDetails } from "./types";
import { Comment } from "./Comments/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskManager } from "./TaskManager";

interface CollaborationPanelProps {
  document: DocumentDetails;
  onCommentAdded: () => void;
}

export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({ document, onCommentAdded }) => {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('document_comments')
        .insert([
          {
            document_id: document.id,
            content: newComment,
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment added successfully"
      });

      setNewComment("");
      onCommentAdded();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment"
      });
    }
  };

  // Properly map document comments to Comment type with all required properties
  const typedComments: Comment[] = document.comments ? document.comments.map(comment => ({
    id: comment.id,
    content: comment.content,
    created_at: comment.created_at,
    user_id: comment.user_id,
    document_id: document.id,
    parent_id: undefined,
    mentions: [],
    is_resolved: false
  })) : [];

  return (
    <div className="rounded-lg h-full flex flex-col">
      <Tabs defaultValue="comments" className="h-full flex flex-col">
        <TabsList className="mx-2 mt-2 mb-2 w-auto justify-start bg-muted/50">
          <TabsTrigger value="comments" className="flex items-center text-xs">
            <MessageSquare className="h-3.5 w-3.5 mr-1" />
            Comments
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center text-xs">
            <ClipboardList className="h-3.5 w-3.5 mr-1" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="versions" className="flex items-center text-xs">
            <History className="h-3.5 w-3.5 mr-1" />
            Versions
          </TabsTrigger>
        </TabsList>
            
        <div className="flex-1 overflow-auto px-2 pb-2">
          <TabsContent value="comments" className="h-full mt-0 data-[state=active]:flex data-[state=active]:flex-col">
            <div className="space-y-2">
              {typedComments.length > 0 ? (
                typedComments.map((comment) => (
                  <div key={comment.id} className="p-2 rounded-md bg-muted/40">
                    <p className="text-sm">{comment.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-3">
                  <p className="text-xs text-muted-foreground">No comments yet</p>
                </div>
              )}

              <div className="flex items-center space-x-1 mt-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 min-w-0 rounded-md border bg-background px-2 py-1.5 text-xs"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <button
                  onClick={handleAddComment}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-2 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </button>
              </div>
            </div>
          </TabsContent>
              
          <TabsContent value="tasks" className="h-full mt-0 data-[state=active]:flex data-[state=active]:flex-col">
            <TaskManager 
              documentId={document.id} 
              tasks={document.tasks || []}
              onTaskUpdate={onCommentAdded} // Using the same callback for task updates
            />
          </TabsContent>

          <TabsContent value="versions" className="h-full mt-0 data-[state=active]:flex data-[state=active]:flex-col">
            <div className="space-y-2">
              <h3 className="text-xs font-medium">Document Versions</h3>
              {document.versions && document.versions.length > 0 ? (
                <ul className="space-y-1">
                  {document.versions.map((version, index) => (
                    <li key={version.id || index} className="flex items-center justify-between bg-muted/40 p-2 rounded-md text-xs">
                      <div>
                        <p className="font-medium">Version {index + 1}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(version.created_at).toLocaleString()}
                        </p>
                      </div>
                      <button className="text-xs text-primary hover:underline">
                        View
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-3">No version history available</p>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
