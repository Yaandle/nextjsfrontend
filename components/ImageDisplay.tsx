// ImageDisplay.tsx
"use client";

import React from 'react';

interface ImageDisplayProps {
  processedImage: string | null;
  isLoading?: boolean;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  processedImage, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="w-full h-64 border rounded-lg flex items-center justify-center bg-gray-50">
        <div className="text-gray-400">Processing image...</div>
      </div>
    );
  }

  if (!processedImage) {
    return (
      <div className="w-full h-64 border rounded-lg flex items-center justify-center bg-gray-50">
        <div className="text-gray-400">No image to display</div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <img 
        src={processedImage} 
        alt="Processed result" 
        className="w-full h-auto object-contain"
      />
    </div>
  );
};

export default ImageDisplay;