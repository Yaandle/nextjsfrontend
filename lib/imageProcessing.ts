import { Model } from "@/components/processing/ModelSelector";

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

// Helper function to determine the appropriate endpoint based on enabled capabilities
function getProcessingEndpoint({ enableDetection, enableSegmentation, enableKeypoints }: ProcessingOptions): string {
  const key = [enableDetection, enableSegmentation, enableKeypoints].map(v => (v ? "1" : "0")).join("");
  const endpointMap: Record<string, string> = {
    "111": "/process_all",
    "110": "/process_detection_segmentation",
    "101": "/process_detection_keypoints",
    "011": "/process_segmentation_keypoints",
    "100": "/process_detection",
    "010": "/process_segmentation",
    "001": "/process_keypoints"
  };
  const endpoint = endpointMap[key];
  if (!endpoint) throw new Error('At least one capability must be enabled');
  return endpoint;
}


export async function processImage(
  file: File, 
  options: ProcessingOptions
): Promise<ProcessedResult> {
  try {
    if (!file || !(file instanceof File)) {
      throw new Error("Invalid file provided");
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("modelId", options.modelId);
    formData.append("enableDetection", options.enableDetection.toString());
    formData.append("enableSegmentation", options.enableSegmentation.toString());
    formData.append("enableKeypoints", options.enableKeypoints.toString());

    const flaskServerUrl = process.env.NEXT_PUBLIC_FLASK_SERVER_URL;
    if (!flaskServerUrl) {
      throw new Error("Flask server URL is not configured");
    }

    // Get the appropriate endpoint based on enabled capabilities
    const endpoint = getProcessingEndpoint(options);
    
    const response = await fetch(`${flaskServerUrl}${endpoint}`, {
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

    console.log("Response data:", data);
    if (!data.image) {
      throw new Error("No image data returned from server");
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
