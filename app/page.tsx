"use client";

import React, { useState } from "react";
import ImageUploader from "@/components/processing/ImageUploader";
import ImageDisplay from "@/components/processing/ImageDisplay";
import DataDisplay from "@/components/processing/DataDisplay";
import { DetectionData } from "@/lib/dataProcessing";
import type { ProcessedResult } from "@/lib/imageProcessing";
import ModelSelector from "@/components/processing/ModelSelector";

interface ProcessState {
  processedImage: string | null;
  detectionData: DetectionData[] | null;
  isLoading: boolean;
  error: string | null;
}

interface DetectionModes {
  objectDetection: boolean;
  imageSegmentation: boolean;
  keypoints: boolean;
}

export default function ProcessPage() {
  const [state, setState] = useState<ProcessState>({
    processedImage: null,
    detectionData: null,
    isLoading: false,
    error: null,
  });

  const [selectedModel, setSelectedModel] = useState<string>("");
  const [detectionModes, setDetectionModes] = useState<DetectionModes>({
    objectDetection: true,
    imageSegmentation: false,
    keypoints: false,
  });

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
  };

  const toggleDetectionMode = (mode: keyof DetectionModes) => {
    setDetectionModes(prev => ({
      ...prev,
      [mode]: !prev[mode]
    }));
  };

  const handleProcessingComplete = (result: ProcessedResult) => {
    const processedDetections = result.detectionData.map(detection => ({
      ...detection,
      mask_center: detection.mask_center || null,
      keypoints: detection.keypoints || []
    })) as DetectionData[];

    setState(prev => ({
      ...prev,
      processedImage: result.processedImage,
      detectionData: processedDetections,
      isLoading: false,
      error: null,
    }));
  };

  const handleError = (error: Error) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: error.message,
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-6">MiFood Image Testing</h1>
      
      {/* Model Selection and Detection Modes */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Model Selector */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Select Model</h2>
            <ModelSelector 
              selectedModel={selectedModel}
              onModelSelect={handleModelSelect}
            />
          </div>

          {/* Detection Mode Toggles */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Detection Modes</h2>
            <div className="space-y-4">
              {/* Object Detection Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-gray-700">Object Detection</label>
                <button
                  onClick={() => toggleDetectionMode('objectDetection')}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    ${detectionModes.objectDetection ? 'bg-blue-500' : 'bg-gray-200'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white
                      ${detectionModes.objectDetection ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>

              {/* Image Segmentation Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-gray-700">Image Segmentation</label>
                <button
                  onClick={() => toggleDetectionMode('imageSegmentation')}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    ${detectionModes.imageSegmentation ? 'bg-blue-500' : 'bg-gray-200'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white
                      ${detectionModes.imageSegmentation ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>

              {/* Keypoints Toggle */}
              <div className="flex items-center justify-between">
                <label className="text-gray-700">Keypoints</label>
                <button
                  onClick={() => toggleDetectionMode('keypoints')}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    ${detectionModes.keypoints ? 'bg-blue-500' : 'bg-gray-200'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white
                      ${detectionModes.keypoints ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">Upload Images</h2>
            <ImageUploader
              onProcessingStart={() => setState(prev => ({ ...prev, isLoading: true, error: null }))}
              onProcessingComplete={handleProcessingComplete}
              onError={handleError}
            />
            {state.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded text-red-500 text-sm">
                {state.error}
              </div>
            )}
          </div>
          
          {/* Detection Data Display */}
          <DataDisplay detectionData={state.detectionData} />
        </div>

        <div className="lg:col-span-2">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>
            <ImageDisplay 
              processedImage={state.processedImage} 
              isLoading={state.isLoading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}