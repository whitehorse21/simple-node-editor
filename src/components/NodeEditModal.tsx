import React, { useState, useEffect } from 'react';
import useNodeStore from '../store/useNodeStore';
import type { NodeData, Port } from '../types';

interface NodeEditModalProps {
    nodeId: string;
    nodeData: NodeData;
    isOpen: boolean;
    onClose: () => void;
}

const NodeEditModal: React.FC<NodeEditModalProps> = ({ nodeId, nodeData, isOpen, onClose }) => {
    const updateNode = useNodeStore((state) => state.updateNode);
    const [formData, setFormData] = useState<NodeData>(nodeData);
    const [ports, setPorts] = useState<Port[]>(nodeData.ports || []);

    useEffect(() => {
        if (isOpen) {
            setFormData(nodeData);
            setPorts(nodeData.ports || []);
        }
    }, [isOpen, nodeData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateNode(nodeId, {
            ...formData,
            ports: ports,
        });
        onClose();
    };

    const handlePortChange = (portId: string, field: keyof Port, value: string) => {
        setPorts(
            ports.map((port) =>
                port.id === portId ? { ...port, [field]: value } : port
            )
        );
    };

    const handleColorChange = (color: string) => {
        setFormData({ ...formData, color });
    };

    const presetColors = [
        '#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6',
        '#ec4899', '#06b6d4', '#84cc16', '#f97316'
    ];

    return (
        <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-xl shadow-2xl w-[90%] min-w-[800px] max-w-[1200px] max-h-[85vh] overflow-y-auto m-5 animate-[modalSlideIn_0.2s_ease-out] max-[900px]:w-[calc(100%-40px)] max-[900px]:min-w-0 max-[900px]:max-w-[calc(100%-40px)]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="m-0 text-xl font-semibold text-gray-800">Edit Node</h2>
                    <button 
                        className="bg-transparent border-none text-3xl text-gray-500 cursor-pointer p-0 w-8 h-8 flex items-center justify-center rounded-md transition-all hover:bg-gray-100 hover:text-gray-800"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 grid grid-cols-2 gap-5">
                    <div className="mb-0">
                        <label htmlFor="label" className="block text-sm font-medium text-gray-700 mb-2">
                            Label
                        </label>
                        <input
                            id="label"
                            type="text"
                            value={formData.label}
                            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm transition-colors font-inherit focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                            required
                        />
                    </div>

                    <div className="mb-0">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                        <div className="flex gap-2 items-center flex-wrap max-w-full">
                            {presetColors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`w-9 h-9 border-2 rounded-md cursor-pointer transition-all p-0 hover:scale-110 ${
                                        formData.color === color 
                                            ? 'border-gray-800 shadow-[0_0_0_2px_white,0_0_0_4px_#1f2937]' 
                                            : 'border-transparent hover:border-gray-800'
                                    }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => handleColorChange(color)}
                                    title={color}
                                />
                            ))}
                            <input
                                type="color"
                                value={formData.color || '#6366f1'}
                                onChange={(e) => handleColorChange(e.target.value)}
                                className="w-9 h-9 border-2 border-gray-300 rounded-md cursor-pointer p-0.5"
                            />
                        </div>
                    </div>

                    <div className="mb-0 col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={3}
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm transition-colors font-inherit focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                        />
                    </div>

                    {ports.length > 0 && (
                        <div className="mb-0 col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ports</label>
                            <div className="flex flex-col gap-2">
                                {ports.map((port) => (
                                    <div key={port.id} className="flex gap-2 items-center flex-wrap max-[640px]:flex-col max-[640px]:items-stretch">
                                        <input
                                            type="text"
                                            value={port.name}
                                            onChange={(e) => handlePortChange(port.id, 'name', e.target.value)}
                                            placeholder="Port name"
                                            className="flex-1 min-w-[120px] px-2.5 py-2 border border-gray-300 rounded-md text-[13px] box-border max-[640px]:w-full max-[640px]:min-w-0"
                                        />
                                        <select
                                            value={port.dataType}
                                            onChange={(e) => handlePortChange(port.id, 'dataType', e.target.value)}
                                            className="px-2.5 py-2 border border-gray-300 rounded-md text-[13px] bg-white cursor-pointer min-w-[100px] flex-shrink-0 box-border max-[640px]:w-full max-[640px]:min-w-0"
                                        >
                                            <option value="string">String</option>
                                            <option value="number">Number</option>
                                            <option value="boolean">Boolean</option>
                                            <option value="any">Any</option>
                                        </select>
                                        <span className="px-3 py-2 bg-gray-100 rounded-md text-xs font-medium text-gray-500 min-w-[60px] text-center flex-shrink-0 box-border max-[640px]:w-full max-[640px]:min-w-0">
                                            {port.type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 justify-end mt-6 pt-5 border-t border-gray-200 col-span-2">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-md text-sm font-medium cursor-pointer transition-all border-none bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="px-5 py-2.5 rounded-md text-sm font-medium cursor-pointer transition-all border-none bg-indigo-500 text-white hover:bg-indigo-600"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NodeEditModal;
