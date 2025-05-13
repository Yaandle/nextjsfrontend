"use client";

import React, { useState } from "react";
import { FileUpload } from "../components/ui/file-upload";
import { processImage } from "../lib/imageProcessing";
import type { ProcessedResult, ProcessingOptions } from "../lib/imageProcessing";

interface ImageUploadProps {
  onProcessingStart?: () => void;
  onProcessingComplete?: (result: ProcessedResult) => void;
  onError?: (error: Error) => void;
  processingOptions?: ProcessingOptions;
}

const ImageUploader: React.FC<ImageUploadProps> = ({
  onProcessingStart,
  onProcessingComplete,
  onError,
  processingOptions = { 
    modelId: "default",
    enableDetection: true,
    enableSegmentation: false,
    enableKeypoints: false
  } // Default values for ProcessingOptions
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (files: File[]) => {
    if (files.length === 0) return;

    try {
      setIsProcessing(true);
      onProcessingStart?.();

      // Pass both the file and processing options to processImage
      const result = await processImage(files[0], processingOptions);
      onProcessingComplete?.(result);
    } catch (error) {
      console.error("[Upload Error]:", error);
      onError?.(error instanceof Error ? error : new Error("Upload failed"));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full p-4">
      <FileUpload 
        onChange={handleFileChange}
      />
    </div>
  );
};

export default ImageUploader;