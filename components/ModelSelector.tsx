import React from 'react';

export interface Model {
  id: string;
  name: string;
  capabilities: ('detection' | 'segmentation' | 'keypoints')[];
}

interface ModelSelectorProps {
  selectedModel: string;
  onModelSelect: (model: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, onModelSelect }) => {
  const models: Model[] = [
    {
      id: 'strawberry',
      name: 'Strawberry',
      capabilities: ['detection', 'segmentation', 'keypoints']
    }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Select Model</h2>
      <div className="space-y-4">
        {models.map(model => (
          <div 
            key={model.id}
            className={`
              relative p-4 rounded-lg border-2 cursor-pointer transition-all
              ${selectedModel === model.id 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'}
            `}
            onClick={() => onModelSelect(model.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{model.name}</h3>
                <div className="flex gap-2 mt-2">
                  {model.capabilities.map(capability => (
                    <span 
                      key={capability}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {capability.charAt(0).toUpperCase() + capability.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
              <div className={`
                w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${selectedModel === model.id 
                  ? 'border-green-500 bg-green-500' 
                  : 'border-gray-300'}
              `}>
                {selectedModel === model.id && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ModelSelector;