
import { ProfilePicture } from '../ProfilePicture';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, UserSquare } from "lucide-react";

interface SignUpFieldsProps {
  fullName: string;
  setFullName: (value: string) => void;
  userId: string;
  setUserId: (value: string) => void;
  avatarUrl: string | null;
  setAvatarUrl: (url: string) => void;
}

export const SignUpFields = ({
  fullName,
  setFullName,
  userId,
  setUserId,
  avatarUrl,
  setAvatarUrl
}: SignUpFieldsProps) => {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-sm font-medium flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-muted-foreground" />
          Full Name
        </Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="John Doe"
          className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="userId" className="text-sm font-medium flex items-center gap-1.5">
          <UserSquare className="h-3.5 w-3.5 text-muted-foreground" />
          User ID
        </Label>
        <Input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="johndoe123"
          className="w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm"
        />
      </div>
      
      <div className="space-y-3">
        <Label className="text-sm font-medium mb-2 block">
          Profile Picture
        </Label>
        <div className="flex flex-col items-center">
          <div className="bg-secondary/10 p-2 rounded-full border border-border mb-2">
            <ProfilePicture
              url={avatarUrl}
              onUpload={(url) => {
                setAvatarUrl(url);
                toast({
                  title: "Success",
                  description: "Profile picture selected successfully",
                });
              }}
              size={80}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Optional: Upload an image (JPG, PNG, GIF) up to 5MB
          </p>
        </div>
      </div>
    </div>
  );
};
