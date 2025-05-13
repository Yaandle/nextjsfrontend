// dataProcessing.ts

export interface DetectionData {
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

export function formatDetectionData(detections: DetectionData[]) {
  return detections
    .filter(detection => detection.box !== null) 
    .map((detection, index) => {
      const [x1, y1, x2, y2] = detection.box || [0, 0, 0, 0]; 
      const width = x2 - x1;
      const height = y2 - y1;
      
      return {
        id: index,
        class: detection.class,
        confidence: detection.confidence ? (detection.confidence * 100).toFixed(1) + '%' : 'N/A',
        boundingBox: {
          x1, y1, x2, y2,
          width, height,
          center: {
            x: x1 + width / 2,
            y: y1 + height / 2
          }
        },
        maskCenter: detection.mask_center 
          ? { x: detection.mask_center[0], y: detection.mask_center[1] }
          : null,
        keypoints: detection.keypoints.map(kp => ({
          id: kp.id,
          x: kp.x,
          y: kp.y,
          confidence: (kp.confidence * 100).toFixed(1) + '%'
        }))
      };
    });
}