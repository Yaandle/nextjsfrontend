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
  modelId: string;
  enableDetection: boolean;
  enableSegmentation: boolean;
  enableKeypoints: boolean;
}

export async function processImage(
  file: File, 
  options: ProcessingOptions
): Promise<ProcessedResult> {
  try {
    if (!file || !(file instanceof File)) {
      throw new Error("Invalid file provided");
    }

    // Create form data with all required parameters
    const formData = new FormData();
    formData.append("image", file);
    formData.append("modelId", options.modelId);
    formData.append("enableDetection", options.enableDetection.toString());
    formData.append("enableSegmentation", options.enableSegmentation.toString());
    formData.append("enableKeypoints", options.enableKeypoints.toString());

    // Use a hardcoded local URL for the tutorial
    const flaskServerUrl = "http://localhost:5000"; // Flask default port
    
    // Use a single endpoint for processing
    const response = await fetch(`${flaskServerUrl}/process`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    
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