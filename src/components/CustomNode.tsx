import React, { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { NodeData } from '../types';
import NodeEditModal from './NodeEditModal';
import NodeContextMenu from './NodeContextMenu';

interface CustomNodeProps extends NodeProps {
  data: NodeData;
}

const CustomNode: React.FC<CustomNodeProps> = ({ id, data, selected }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const inputPorts = data.ports?.filter(p => p.type === 'input') || [];
  const outputPorts = data.ports?.filter(p => p.type === 'output') || [];
  const headerHeight = 48;
  const descriptionHeight = data.description ? 32 : 0;
  const portRowHeight = 32;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenu && !nodeRef.current?.contains(event.target as Node)) {
        setContextMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [contextMenu]);
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Use clientX/Y for fixed positioning relative to viewport
    const x = e.clientX;
    const y = e.clientY;
    setContextMenu({ x, y });
  };
  
  return (
    <>
      <div
        ref={nodeRef}
        className={`bg-white border-2 rounded-lg min-w-[200px] shadow-md transition-all ${
          selected ? 'border-indigo-500 shadow-lg shadow-indigo-500/30' : 'border-gray-200'
        }`}
        onContextMenu={handleContextMenu}
      >
        <div 
          className="px-4 py-3 rounded-t-lg text-white flex items-center justify-between"
          style={{ backgroundColor: data.color || '#6366f1' }}
        >
          <div className="font-semibold text-sm">{data.label}</div>
          <div className="flex items-center gap-2">
            {data.type && (
              <div className="text-[11px] opacity-90 bg-white/20 px-2 py-0.5 rounded">
                {data.type}
              </div>
            )}
            <button
              className="bg-white/20 border-none rounded px-2 py-1 text-xs transition-all flex items-center justify-center hover:bg-white/30 hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditModalOpen(true);
              }}
              title="Edit node"
            >
              ✏️
            </button>
          </div>
        </div>
      
        <div className="p-3">
          {data.description && (
            <div className="text-xs text-gray-500 mb-3">{data.description}</div>
          )}
          
          {/* Input Ports */}
          {inputPorts.length > 0 && (
            <div className="flex flex-col gap-2">
              {inputPorts.map((port, index) => {
                const topPosition = headerHeight + descriptionHeight + (index * portRowHeight) + (portRowHeight / 2);
                return (
                  <div key={port.id} className="flex items-center gap-2 relative min-h-8 py-1 pl-5">
                    <Handle
                      type="target"
                      position={Position.Left}
                      id={port.id}
                      className="absolute"
                      style={{
                        top: `${topPosition}px`,
                        background: getPortColor(port.dataType),
                        width: '12px',
                        height: '12px',
                        border: '2px solid #fff',
                      }}
                    />
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-800 font-medium">{port.name}</span>
                      <span className="text-gray-500 text-[11px] bg-gray-100 px-1.5 py-0.5 rounded">
                        {port.dataType}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Output Ports */}
          {outputPorts.length > 0 && (
            <div className="flex flex-col gap-2">
              {outputPorts.map((port, index) => {
                const topPosition = headerHeight + descriptionHeight + (index * portRowHeight) + (portRowHeight / 2);
                return (
                  <div key={port.id} className="flex items-center gap-2 relative min-h-8 py-1 pr-5 justify-end">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-800 font-medium">{port.name}</span>
                      <span className="text-gray-500 text-[11px] bg-gray-100 px-1.5 py-0.5 rounded">
                        {port.dataType}
                      </span>
                    </div>
                    <Handle
                      type="source"
                      position={Position.Right}
                      id={port.id}
                      className="absolute"
                      style={{
                        top: `${topPosition}px`,
                        background: getPortColor(port.dataType),
                        width: '12px',
                        height: '12px',
                        border: '2px solid #fff',
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      <NodeEditModal
        nodeId={id}
        nodeData={data}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
      {contextMenu && (
        <NodeContextMenu
          nodeId={id}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
};

// Helper function to get port color based on type
const getPortColor = (type: string): string => {
  const colors: Record<string, string> = {
    'string': '#10b981',
    'number': '#3b82f6',
    'boolean': '#f59e0b',
    'any': '#8b5cf6',
    'input': '#6b7280',
  };
  return colors[type] || colors['any'];
};

export default CustomNode;
