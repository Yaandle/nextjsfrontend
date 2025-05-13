// DataDisplay.tsx
"use client";

import React from 'react';
import { formatDetectionData, DetectionData } from '@/../lib/dataProcessing';

interface DataDisplayProps {
  detectionData: DetectionData[] | null;
}

const DataDisplay: React.FC<DataDisplayProps> = ({ detectionData }) => {
  if (!detectionData || detectionData.length === 0) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50">
        <p className="text-gray-400">No detection data available</p>
      </div>
    );
  }

  const formattedData = formatDetectionData(detectionData);

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-2 font-medium">
        Detection Results ({formattedData.length})
      </div>
      <div className="divide-y max-h-[600px] overflow-y-auto">
        {formattedData.map((item) => (
          <div key={item.id} className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{item.class}</h3>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {item.confidence}
              </span>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Bounding Box</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>X1, Y1: {item.boundingBox.x1}, {item.boundingBox.y1}</div>
                  <div>X2, Y2: {item.boundingBox.x2}, {item.boundingBox.y2}</div>
                  <div>Width: {item.boundingBox.width}px</div>
                  <div>Height: {item.boundingBox.height}px</div>
                </div>
              </div>
              
              {item.maskCenter && (
                <div>
                  <p className="text-gray-500 mb-1">Mask Center</p>
                  <div>X, Y: {item.maskCenter.x}, {item.maskCenter.y}</div>
                </div>
              )}
              
              {item.keypoints.length > 0 && (
                <div>
                  <p className="text-gray-500 mb-1">Keypoints ({item.keypoints.length})</p>
                  <div className="grid grid-cols-1 gap-1 max-h-40 overflow-y-auto">
                    {item.keypoints.map(kp => (
                      <div key={kp.id} className="flex justify-between text-xs bg-gray-50 p-1 rounded">
                        <span>Keypoint {kp.id}</span>
                        <span>X: {Math.round(kp.x)}, Y: {Math.round(kp.y)}</span>
                        <span>{kp.confidence}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataDisplay;