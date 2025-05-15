"use client";

import React from "react";
import { FileUpload } from "../components/ui/file-upload";

interface ImageUploadProps {
  onImageSelect?: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploadProps> = ({
  onImageSelect,
}) => {
  const handleFileChange = (files: File[]) => {
    if (files.length === 0) return;
    onImageSelect?.(files[0]);
  };

  return (
    <div className="w-full p-4">
      <FileUpload onChange={handleFileChange} />
    </div>
  );
};

export default ImageUploader;
