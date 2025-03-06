
import { ProfilePicture } from '../ProfilePicture';
import { useToast } from "@/hooks/use-toast";

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
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium">
          Full Name
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="userId" className="block text-sm font-medium">
          User ID
        </label>
        <input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">
          Profile Picture
        </label>
        <div className="flex flex-col items-center">
          <ProfilePicture
            url={avatarUrl}
            onUpload={(url) => {
              setAvatarUrl(url);
              toast({
                title: "Success",
                description: "Profile picture selected successfully",
              });
            }}
            size={100}
          />
          <p className="text-xs text-muted-foreground mt-2">
            Optional: Upload an image (JPG, PNG, GIF) up to 5MB
          </p>
        </div>
      </div>
    </div>
  );
};
