import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadPropertyPhoto } from "@/lib/firebase";
import { getUser } from "@/lib/auth";

interface Step2PhotoUploadProps {
  photo: string | null;
  setPhoto: (photo: string | null) => void;
}

export const Step2PhotoUpload = ({ photo, setPhoto }: Step2PhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10MB");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const user = await getUser();
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      const downloadUrl = await uploadPropertyPhoto(file, user.id);
      console.log("Download URL:", downloadUrl);

      setPhoto(downloadUrl);
    } catch (error: any) {
      setUploadError(error.message || "Failed to upload photo");
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="relative">
        {photo && photo !== "" ? (
          <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
            <img
              src={photo}
              alt="Property preview"
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setPhoto(null)}
              className="absolute top-3 right-3 p-2 bg-foreground/80 text-background rounded-full hover:bg-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="block aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              {uploading ? (
                <>
                  <Loader2 className="w-12 h-12 mb-3 animate-spin" />
                  <span className="font-medium">Uploading...</span>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 mb-3" />
                  <span className="font-medium">Click to upload a photo</span>
                  <span className="text-sm mt-1">PNG, JPG up to 10MB</span>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        )}
      </div>
      {uploadError && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {uploadError}
        </div>
      )}
    </div>
  );
};
