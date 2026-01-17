import React from 'react';
import useNodeStore from '../store/useNodeStore';
import type { NodeTypeDefinition, CustomNode } from '../types';

const nodeTypes: NodeTypeDefinition[] = [
  {
    id: 'data-source',
    label: 'Data Source',
    type: 'source',
    color: '#10b981',
    description: 'Input data node',
    ports: [
      { id: 'output-1', name: 'Data', type: 'output', dataType: 'any', position: 0 },
    ],
  },
  {
    id: 'transform',
    label: 'Transform',
    type: 'transform',
    color: '#3b82f6',
    description: 'Transform data',
    ports: [
      { id: 'input-1', name: 'Input', type: 'input', dataType: 'any', position: 0 },
      { id: 'output-1', name: 'Output', type: 'output', dataType: 'any', position: 0 },
    ],
  },
  {
    id: 'filter',
    label: 'Filter',
    type: 'filter',
    color: '#f59e0b',
    description: 'Filter data by condition',
    ports: [
      { id: 'input-1', name: 'Data', type: 'input', dataType: 'any', position: 0 },
      { id: 'output-1', name: 'Filtered', type: 'output', dataType: 'any', position: 0 },
    ],
  },
  {
    id: 'aggregate',
    label: 'Aggregate',
    type: 'aggregate',
    color: '#8b5cf6',
    description: 'Aggregate data',
    ports: [
      { id: 'input-1', name: 'Data', type: 'input', dataType: 'any', position: 0 },
      { id: 'output-1', name: 'Result', type: 'output', dataType: 'number', position: 0 },
    ],
  },
  {
    id: 'output',
    label: 'Output',
    type: 'output',
    color: '#ef4444',
    description: 'Output destination',
    ports: [
      { id: 'input-1', name: 'Data', type: 'input', dataType: 'any', position: 0 },
    ],
  },
];

const NodePalette: React.FC = () => {
  const addNode = useNodeStore((state) => state.addNode);
  const nodes = useNodeStore((state) => state.nodes);

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: NodeTypeDefinition) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeType));
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleAddNode = (nodeType: NodeTypeDefinition) => {
    const newNode: CustomNode = {
      id: `${nodeType.id}-${Date.now()}`,
      type: 'custom',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 400 + 100,
      },
      data: {
        label: nodeType.label,
        type: nodeType.type,
        color: nodeType.color,
        description: nodeType.description,
        ports: nodeType.ports,
      },
    };
    addNode(newNode);
  };

  return (
    <div className="w-[250px] bg-gray-50 border-r border-gray-200 flex flex-col shadow-[2px_0_8px_rgba(0,0,0,0.05)]">
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Node Types</h3>
        <div className="flex flex-col gap-2">
          {nodeTypes.map((nodeType) => (
            <div
              key={nodeType.id}
              className="bg-white border border-gray-200 border-l-4 rounded-md p-3 cursor-grab transition-all hover:shadow-md hover:translate-x-0.5 active:cursor-grabbing"
              draggable
              onDragStart={(e) => onDragStart(e, nodeType)}
              onClick={() => handleAddNode(nodeType)}
              style={{ borderLeftColor: nodeType.color }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-gray-800 text-sm">{nodeType.label}</span>
              </div>
              <div className="text-xs text-gray-500">{nodeType.description}</div>
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500">
          <p>Drag nodes to canvas or click to add</p>
          <p>Nodes: {nodes.length}</p>
        </div>
      </div>
      <div className="p-4 border-t border-gray-200 flex justify-center">
        <a
          href="https://github.com/whitehorse21"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              clipRule="evenodd"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default NodePalette;
