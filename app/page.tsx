"use client";

import React, { useState } from "react";
import ImageUploader from "../components/ImageUploader";
import ImageDisplay from "../components/ImageDisplay";
import DataDisplay from "../components/DataDisplay";
import { DetectionData } from "../lib/dataProcessing";
import type { ProcessedResult } from "../lib/imageProcessing";
import { processImage, validateOptions } from "../lib/imageProcessing";
import ModelSelector from "../components/ModelSelector";

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
    objectDetection: false,
    imageSegmentation: false,
    keypoints: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [userMessage, setUserMessage] = useState<string | null>(null);

  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
    setDetectionModes({
      objectDetection: false,
      imageSegmentation: false,
      keypoints: false
    });
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

  const handleRunInference = async () => {
    setUserMessage(null);

    if (!imageFile) {
      setUserMessage("Please upload an image first.");
      return;
    }

    if (!selectedModel) {
      setUserMessage("Please select a model.");
      return;
    }

    const options = {
      modelId: selectedModel,
      modelName: selectedModel,
      enableDetection: detectionModes.objectDetection,
      enableSegmentation: detectionModes.imageSegmentation,
      enableKeypoints: detectionModes.keypoints,
    };

    if (!validateOptions(options)) {
      setUserMessage("Please enable at least one processing task.");
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const result = await processImage(imageFile, options);
      handleProcessingComplete(result);
    } catch (error: any) {
      handleError(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold mb-6">Model Inference Testing</h1>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Select Model</h2>
            <ModelSelector
              selectedModel={selectedModel}
              onModelSelect={handleModelSelect}
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Detection Modes</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-gray-700">Object Detection</label>
                <button
                  onClick={() => toggleDetectionMode("objectDetection")}
                  disabled={selectedModel !== 'strawberry'}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    ${detectionModes.objectDetection ? "bg-blue-500" : "bg-gray-200"}
                    ${selectedModel !== 'strawberry' ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white
                      ${detectionModes.objectDetection ? "translate-x-6" : "translate-x-1"}
                    `}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-700">Image Segmentation</label>
                <button
                  onClick={() => toggleDetectionMode("imageSegmentation")}
                  disabled={selectedModel !== 'strawberry'}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    ${detectionModes.imageSegmentation ? "bg-blue-500" : "bg-gray-200"}
                    ${selectedModel !== 'strawberry' ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white
                      ${detectionModes.imageSegmentation ? "translate-x-6" : "translate-x-1"}
                    `}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-gray-700">Keypoints</label>
                <button
                  onClick={() => toggleDetectionMode("keypoints")}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full
                    ${detectionModes.keypoints ? "bg-blue-500" : "bg-gray-200"}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white
                      ${detectionModes.keypoints ? "translate-x-6" : "translate-x-1"}
                    `}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-lg font-semibold mb-4">Upload Images</h2>
            <ImageUploader
              onImageSelect={setImageFile}
            />
            <button
              onClick={handleRunInference}
              className="mt-4 w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
            >
              Run Inference
            </button>
            {userMessage && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded text-yellow-600 text-sm">
                {userMessage}
              </div>
            )}
            {state.error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded text-red-500 text-sm">
                {state.error}
              </div>
            )}
          </div>

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
