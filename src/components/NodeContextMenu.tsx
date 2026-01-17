import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useNodeStore from '../store/useNodeStore';
import { useToast } from '../hooks/useToast';

interface NodeContextMenuProps {
  nodeId: string;
  x: number;
  y: number;
  onClose: () => void;
}

const NodeContextMenu: React.FC<NodeContextMenuProps> = ({ nodeId, x, y, onClose }) => {
  const { duplicateNode, deleteNode } = useNodeStore();
  const { showToast } = useToast();
  const menuRef = useRef<HTMLDivElement>(null);

  const handleDuplicate = () => {
    duplicateNode(nodeId);
    showToast('Node duplicated', 'success');
    onClose();
  };

  const handleDelete = () => {
    deleteNode(nodeId);
    showToast('Node deleted', 'info');
    onClose();
  };

  useEffect(() => {
    // Adjust position after render to ensure menu stays in viewport
    const adjustPosition = () => {
      if (menuRef.current) {
        const rect = menuRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        let adjustedX = x;
        let adjustedY = y;
        
        // Adjust if menu would go off right edge
        if (x + rect.width > viewportWidth) {
          adjustedX = viewportWidth - rect.width - 10;
        }
        
        // Adjust if menu would go off bottom edge
        if (y + rect.height > viewportHeight) {
          adjustedY = viewportHeight - rect.height - 10;
        }
        
        // Ensure menu doesn't go off left or top edges
        adjustedX = Math.max(10, adjustedX);
        adjustedY = Math.max(10, adjustedY);
        
        // Update position
        if (menuRef.current) {
          menuRef.current.style.left = `${adjustedX}px`;
          menuRef.current.style.top = `${adjustedY}px`;
        }
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      adjustPosition();
    });
  }, [x, y]);

  const menuContent = (
    <div
      ref={menuRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-[1500] min-w-[160px] overflow-hidden animate-[contextMenuFadeIn_0.15s_ease-out]"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button 
        className="w-full px-4 py-2.5 border-none bg-transparent text-left text-sm text-gray-800 cursor-pointer transition-colors flex items-center gap-2 hover:bg-gray-100"
        onClick={handleDuplicate}
      >
        📋 Duplicate
      </button>
      <button 
        className="w-full px-4 py-2.5 border-none bg-transparent text-left text-sm text-red-500 cursor-pointer transition-colors flex items-center gap-2 hover:bg-red-50"
        onClick={handleDelete}
      >
        🗑️ Delete
      </button>
    </div>
  );

  // Render using portal to document body for proper positioning
  return createPortal(menuContent, document.body);
};

export default NodeContextMenu;
