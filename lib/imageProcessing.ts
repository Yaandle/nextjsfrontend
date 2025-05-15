import { Model } from "../components/ModelSelector";

export interface Detection {
  box: number[];
  class: string;
  confidence: number;
  mask_center: [number, number] | null;
  keypoints: {
    id: number;
    x: number;
    y: number;
    confidence: number;
  }[];
}

export interface ProcessedResult {
  processedImage: string;
  detectionData: Detection[];
}

export interface ProcessingOptions {
  modelId?: string;
  modelName: string;
  enableDetection: boolean;
  enableSegmentation: boolean;
  enableKeypoints: boolean;
}

/**
 * Processes an image using the YOLOv8 models running on the Flask backend.
 * Sends image and capability flags to the '/process' route.
 * 
 * @param file - The image file to process
 * @param options - Processing options specifying enabled tasks
 * @returns ProcessedResult including base64 image and detection data
 */
export async function processImage(
  file: File,
  options: ProcessingOptions
): Promise<ProcessedResult> {
  try {
    if (!file || !(file instanceof File)) {
      throw new Error("Invalid file provided");
    }

    if (!options.modelName) {
      throw new Error("modelName is required but missing");
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("modelName", options.modelName);
    formData.append("enableDetection", options.enableDetection.toString());
    formData.append("enableSegmentation", options.enableSegmentation.toString());
    formData.append("enableKeypoints", options.enableKeypoints.toString());

    const flaskServerUrl = "http://localhost:5000";

    const response = await fetch(`${flaskServerUrl}/process`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error (${response.status}): ${errorText}`);
    }

    const data: {
      success: boolean;
      image?: string;
      detections?: Detection[];
      error?: string;
    } = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Image processing failed");
    }

    return {
      processedImage: `data:image/jpeg;base64,${data.image}`,
      detectionData: data.detections || [],
    };
  } catch (error) {
    console.error("[Image Processing Error]:", error);
    throw error;
  }
}

/**
 * Checks if a given task is enabled in the options.
 */
export function isTaskEnabled(
  options: ProcessingOptions,
  task: "detection" | "segmentation" | "keypoints"
): boolean {
  switch (task) {
    case "detection":
      return options.enableDetection;
    case "segmentation":
      return options.enableSegmentation;
    case "keypoints":
      return options.enableKeypoints;
    default:
      return false;
  }
}

/**
 * Returns the count of enabled tasks.
 */
export function getEnabledTaskCount(options: ProcessingOptions): number {
  return [
    options.enableDetection,
    options.enableSegmentation,
    options.enableKeypoints,
  ].filter(Boolean).length;
}

/**
 * Validates if at least one task is enabled.
 */
export function validateOptions(options: ProcessingOptions): boolean {
  return getEnabledTaskCount(options) > 0;
}
