import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  type NodeTypes,
  type Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';
import useNodeStore from '../store/useNodeStore';
import CustomNode from './CustomNode';
import NodePalette from './NodePalette';
import type { NodeTypeDefinition, CustomNode as CustomNodeType } from '../types';
import { useToast } from '../hooks/useToast';
import KeyboardShortcuts from './KeyboardShortcuts';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const FlowEditorInner: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setNodes,
  } = useNodeStore();

  const { showToast } = useToast();

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const nodeType: NodeTypeDefinition = JSON.parse(
        event.dataTransfer.getData('application/reactflow')
      );

      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 50,
      };

      const newNode: CustomNodeType = {
        id: `${nodeType.id}-${Date.now()}`,
        type: 'custom',
        position,
        data: {
          label: nodeType.label,
          type: nodeType.type,
          color: nodeType.color,
          description: nodeType.description,
          ports: nodeType.ports,
        },
      };

      setNodes([...nodes, newNode]);
      showToast('Node added', 'success');
    },
    [nodes, setNodes, showToast]
  );

  const onConnectWithToast = useCallback(
    (connection: Connection) => {
      onConnect(connection);
      showToast('Nodes connected', 'success');
    },
    [onConnect, showToast]
  );

  return (
    <div className="flex-1 flex overflow-hidden">
      <NodePalette />
      <div className="flex-1 h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnectWithToast}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
          defaultEdgeOptions={{
            type: 'default',
            style: { stroke: '#6366f1', strokeWidth: 2 }
          }}
          deleteKeyCode={null}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
};

const FlowEditor: React.FC = () => {
  return (
    <ReactFlowProvider>
      <FlowEditorInner />
      <KeyboardShortcuts />
    </ReactFlowProvider>
  );
};

export default FlowEditor;
