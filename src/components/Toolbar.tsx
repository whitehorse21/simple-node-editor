import React, { useRef } from 'react';
import useNodeStore from '../store/useNodeStore';
import { useToast } from '../hooks/useToast';

const Toolbar: React.FC = () => {
  const saveFlow = useNodeStore((state) => state.saveFlow);
  const loadFlow = useNodeStore((state) => state.loadFlow);
  const setNodes = useNodeStore((state) => state.setNodes);
  const setEdges = useNodeStore((state) => state.setEdges);
  const undo = useNodeStore((state) => state.undo);
  const redo = useNodeStore((state) => state.redo);
  const canUndo = useNodeStore((state) => state.canUndo);
  const canRedo = useNodeStore((state) => state.canRedo);
  const nodes = useNodeStore((state) => state.nodes);
  const edges = useNodeStore((state) => state.edges);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const handleSave = () => {
    const flowJson = saveFlow();
    const blob = new Blob([flowJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flow-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Flow saved successfully', 'success');
  };

  const handleLoad = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          try {
            loadFlow(content);
            showToast('Flow loaded successfully', 'success');
          } catch (error) {
            showToast('Failed to load flow', 'error');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleClear = () => {
    if (window.confirm('Are you sure you want to clear the canvas?')) {
      setNodes([]);
      setEdges([]);
      showToast('Canvas cleared', 'info');
    }
  };

  const handleUndo = () => {
    if (canUndo()) {
      undo();
      showToast('Undone', 'success');
    }
  };

  const handleRedo = () => {
    if (canRedo()) {
      redo();
      showToast('Redone', 'success');
    }
  };

  return (
    <div className="h-[60px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-between px-6 shadow-md z-10">
      <div className="text-xl font-semibold text-white">Node Editor</div>
      <div className="flex gap-4 text-white text-sm">
        <span className="opacity-90">Nodes: {nodes.length}</span>
        <span className="opacity-90">Edges: {edges.length}</span>
      </div>
      <div className="flex gap-3 items-center">
        <button
          onClick={handleUndo}
          className="px-4 py-2 rounded-md bg-white/20 text-white text-sm font-medium cursor-pointer transition-all backdrop-blur-sm hover:bg-white/30 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          disabled={!canUndo()}
          title="Undo (Ctrl+Z)"
        >
          ↶ Undo
        </button>
        <button
          onClick={handleRedo}
          className="px-4 py-2 rounded-md bg-white/20 text-white text-sm font-medium cursor-pointer transition-all backdrop-blur-sm hover:bg-white/30 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          disabled={!canRedo()}
          title="Redo (Ctrl+Shift+Z)"
        >
          ↷ Redo
        </button>
        <div className="w-px h-6 bg-white/30" />
        <button onClick={handleSave} className="px-4 py-2 rounded-md bg-white/20 text-white text-sm font-medium cursor-pointer transition-all backdrop-blur-sm hover:bg-white/30 hover:-translate-y-px" title="Save flow">
          💾 Save
        </button>
        <button onClick={handleLoad} className="px-4 py-2 rounded-md bg-white/20 text-white text-sm font-medium cursor-pointer transition-all backdrop-blur-sm hover:bg-white/30 hover:-translate-y-px" title="Load flow">
          📂 Load
        </button>
        <button onClick={handleClear} className="px-4 py-2 rounded-md bg-white/20 text-white text-sm font-medium cursor-pointer transition-all backdrop-blur-sm hover:bg-white/30 hover:-translate-y-px" title="Clear canvas">
          🗑️ Clear
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default Toolbar;
