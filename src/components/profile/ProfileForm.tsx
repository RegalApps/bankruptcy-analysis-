
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfilePicture } from "@/components/ProfilePicture";
import { UserProfile } from "@/hooks/use-profile";

interface ProfileFormProps {
  profile: UserProfile | null;
  onProfileChange: (field: keyof UserProfile, value: string) => void;
  onAvatarUpload: (url: string) => void;
}

export const ProfileForm = ({
  profile,
  onProfileChange,
  onAvatarUpload
}: ProfileFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={profile?.full_name || ''}
            onChange={(e) => onProfileChange('full_name', e.target.value)}
            placeholder="Enter your full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profile?.email || ''}
            onChange={(e) => onProfileChange('email', e.target.value)}
            placeholder="Enter your email"
            readOnly
          />
        </div>
      </div>
      <div className="flex flex-col items-center mt-6">
        <h3 className="text-sm font-medium mb-2">Profile Picture</h3>
        <ProfilePicture
          url={profile?.avatar_url || null}
          onUpload={onAvatarUpload}
          size={120}
        />
        <p className="text-xs text-muted-foreground mt-2">
          Upload an image (JPG, PNG, GIF) up to 5MB
        </p>
      </div>
    </div>
  );
};
