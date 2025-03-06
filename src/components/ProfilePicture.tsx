
import { useCallback, useState } from "react";
import { Camera } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface ProfilePictureProps {
  url: string | null;
  onUpload: (url: string) => void;
  size?: number;
}

export const ProfilePicture = ({ url, onUpload, size = 150 }: ProfilePictureProps) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadAvatar = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      try {
        setUploading(true);

        if (!event.target.files || event.target.files.length === 0) {
          throw new Error("You must select an image to upload.");
        }

        const file = event.target.files[0];
        
        // Validate file type
        const fileType = file.type;
        if (!fileType.startsWith('image/')) {
          throw new Error("Please upload an image file (JPG, PNG, etc.)");
        }
        
        // Check file size (limit to 5MB)
        const fileSizeInMB = file.size / (1024 * 1024);
        if (fileSizeInMB > 5) {
          throw new Error("File size must be less than 5MB");
        }

        const fileExt = file.name.split(".").pop()?.toLowerCase();
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        
        if (fileExt && !allowedExtensions.includes(fileExt)) {
          throw new Error("Please upload an image file with a valid extension (JPG, PNG, GIF, WEBP)");
        }
        
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        // Upload the file to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        console.log("Upload successful, public URL:", publicUrl);
        onUpload(publicUrl);

        toast({
          title: "Success",
          description: "Profile picture uploaded successfully",
        });

      } catch (error: any) {
        console.error("Upload error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      } finally {
        setUploading(false);
      }
    },
    [onUpload, toast]
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative flex items-center justify-center overflow-hidden rounded-full bg-secondary"
        style={{ width: size, height: size }}
      >
        {url ? (
          <img
            src={url}
            alt="Avatar"
            className="h-full w-full object-cover"
            onError={(e) => {
              console.error("Image failed to load:", url);
              // Replace with camera icon if image fails to load
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.classList.add('image-error');
            }}
          />
        ) : (
          <Camera className="h-8 w-8 text-muted-foreground" />
        )}
        {url && <div className="image-error hidden"><Camera className="h-8 w-8 text-muted-foreground" /></div>}
      </div>
      <div>
        <label
          className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors duration-200"
          htmlFor="single"
        >
          {uploading ? "Uploading..." : "Upload"}
        </label>
        <input
          style={{
            visibility: "hidden",
            position: "absolute",
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
};
