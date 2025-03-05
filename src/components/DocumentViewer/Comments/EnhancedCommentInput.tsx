
import { useState, useRef, useEffect } from 'react';
import { Send, User, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommentInputProps, MentionData } from './types';
import { useToast } from "@/hooks/use-toast";

export const EnhancedCommentInput = ({
  currentUser,
  userProfile,
  onSubmit,
  isSubmitting,
  parentId,
  onCancel,
  placeholder = "Add a comment..."
}: CommentInputProps) => {
  const [content, setContent] = useState('');
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionUsers, setMentionUsers] = useState<MentionData[]>([]);
  const [mentions, setMentions] = useState<string[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  // This would be replaced with actual user data from your system
  const availableUsers: MentionData[] = [
    { id: '1', display: 'John Doe', avatar: '/avatar1.png' },
    { id: '2', display: 'Jane Smith', avatar: '/avatar2.png' },
    { id: '3', display: 'Robert Johnson', avatar: '/avatar3.png' },
  ];

  useEffect(() => {
    if (mentionQuery) {
      const filteredUsers = availableUsers.filter(
        user => user.display.toLowerCase().includes(mentionQuery.toLowerCase())
      );
      setMentionUsers(filteredUsers);
    } else {
      setMentionUsers([]);
    }
  }, [mentionQuery]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    
    // Check if we should show mention suggestions
    const lastWord = value.split(' ').pop() || '';
    if (lastWord.startsWith('@')) {
      setMentionQuery(lastWord.substring(1));
      setShowMentionSuggestions(true);
    } else {
      setShowMentionSuggestions(false);
    }
  };

  const insertMention = (user: MentionData) => {
    const contentWords = content.split(' ');
    contentWords.pop(); // Remove the @query part
    const newContent = [...contentWords, `@${user.display} `].join(' ');
    setContent(newContent);
    setShowMentionSuggestions(false);
    setMentions([...mentions, user.id]);
    inputRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive"
      });
      return;
    }
    
    await onSubmit(content, parentId, mentions);
    setContent('');
    setMentions([]);
    if (onCancel && parentId) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex items-start gap-2 relative">
        <Avatar className="h-8 w-8 mt-1">
          {userProfile?.avatar_url ? (
            <AvatarImage src={userProfile.avatar_url} alt={userProfile.full_name} />
          ) : (
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 relative">
          <Textarea
            ref={inputRef}
            value={content}
            onChange={handleContentChange}
            placeholder={placeholder}
            className="min-h-[80px] p-2 text-sm"
            data-testid="comment-input"
          />
          
          {showMentionSuggestions && mentionUsers.length > 0 && (
            <div className="absolute z-10 bg-card border rounded-md shadow-md w-full mt-1 max-h-[200px] overflow-y-auto">
              {mentionUsers.map(user => (
                <div 
                  key={user.id}
                  className="flex items-center gap-2 p-2 hover:bg-muted cursor-pointer"
                  onClick={() => insertMention(user)}
                >
                  <Avatar className="h-6 w-6">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={user.display} />
                    ) : (
                      <AvatarFallback>{user.display.charAt(0)}</AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-sm">{user.display}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end gap-2">
        {parentId && onCancel && (
          <Button 
            type="button" 
            variant="ghost" 
            onClick={onCancel}
            size="sm"
          >
            <X className="h-4 w-4 mr-1" />
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isSubmitting || !content.trim()} 
          size="sm"
        >
          <Send className="h-4 w-4 mr-1" />
          {parentId ? 'Reply' : 'Comment'}
        </Button>
      </div>
    </form>
  );
};
