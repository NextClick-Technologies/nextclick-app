"use client";

import { Label } from "@/shared/components/ui/label";
import { Input } from "@/shared/components/ui/input";
import { Avatar } from "@/shared/components/ui/avatar";
import { Button } from "@/shared/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import Image from "next/image";
import { compressImage, isImageFile } from "@/shared/utils/image-compress";
import { supabase } from "@/shared/lib/supabase/client";

interface PhotoUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  employeeName?: string;
}

export function PhotoUpload({
  value,
  onChange,
  employeeName,
}: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!isImageFile(file)) {
      alert("Please select a valid image file");
      return;
    }

    try {
      setIsUploading(true);

      // Compress image
      const compressedFile = await compressImage(file, {
        maxSizeKB: 50,
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.9,
      });

      // Generate unique filename
      const fileExt = compressedFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}.${fileExt}`;
      const filePath = `employees/${fileName}`;

      // Upload to Supabase
      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(filePath, compressedFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("photos")
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;

      setPreviewUrl(publicUrl);
      onChange(publicUrl);
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    if (value) {
      try {
        // Extract file path from URL
        const url = new URL(value);
        const pathParts = url.pathname.split("/");
        const filePath = pathParts.slice(-2).join("/"); // Get "employees/filename.jpg"

        // Delete from Supabase
        await supabase.storage.from("photos").remove([filePath]);
      } catch (error) {
        console.error("Error removing photo:", error);
      }
    }

    setPreviewUrl(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>Photo</Label>
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20 bg-primary/10 flex items-center justify-center overflow-hidden">
          {isUploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : previewUrl ? (
            <Image
              src={previewUrl}
              alt="Employee photo"
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-2xl font-medium">
              {employeeName?.[0]?.toUpperCase() || "?"}
            </span>
          )}
        </Avatar>

        <div className="flex-1 space-y-2">
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="hidden"
            id="photo-upload"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </>
              )}
            </Button>
            {previewUrl && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={isUploading}
              >
                <X className="mr-2 h-4 w-4" />
                Remove
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Max 50KB. Will be automatically compressed.
          </p>
        </div>
      </div>
    </div>
  );
}
