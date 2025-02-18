
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
        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        // Upload the file to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false
          });

        if (uploadError) {
          throw uploadError;
        }

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);

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
          />
        ) : (
          <Camera className="h-8 w-8 text-muted-foreground" />
        )}
      </div>
      <div>
        <label
          className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
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
