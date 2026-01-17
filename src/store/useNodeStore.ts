import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import type { Connection, NodeChange, EdgeChange } from 'reactflow';
import type { CustomNode, NodeStore, FlowState, NodeData } from '../types';

const MAX_HISTORY = 50;

const useNodeStore = create<NodeStore>((set, get) => {
  // Initialize with empty state in history
  const initialState: FlowState = { nodes: [], edges: [] };

  return {
    nodes: [],
    edges: [],
    history: [initialState],
    historyIndex: 0,

    // Node management
    setNodes: (nodes: CustomNode[]) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    onNodesChange: (changes: NodeChange[]) => {
      const newNodes = applyNodeChanges(changes, get().nodes) as CustomNode[];
      set({ nodes: newNodes });
      // Auto-save to history on node changes
      get().saveToHistory();
    },

    onEdgesChange: (changes: EdgeChange[]) => {
      const newEdges = applyEdgeChanges(changes, get().edges);
      set({ edges: newEdges });
      // Auto-save to history on edge changes
      get().saveToHistory();
    },

    onConnect: (connection: Connection) => {
      // Edge validation happens here
      const { edges, nodes } = get();

      // Get source and target nodes
      const sourceNode = nodes.find(n => n.id === connection.source);
      const targetNode = nodes.find(n => n.id === connection.target);

      // Validate connection
      if (sourceNode && targetNode) {
        const sourceHandle = connection.sourceHandle;
        const targetHandle = connection.targetHandle;

        // Get port types
        const sourcePort = sourceNode.data?.ports?.find(p => p.id === sourceHandle);
        const targetPort = targetNode.data?.ports?.find(p => p.id === targetHandle);

        // Conditional validation: check if types are compatible
        if (sourcePort && targetPort) {
          const sourceType = sourcePort.dataType;
          const targetType = targetPort.dataType;

          // Allow connection if types match or if target accepts 'any'
          if (sourceType === targetType || targetType === 'any' || sourceType === 'any') {
            set({
              edges: addEdge(connection, edges),
            });
          } else {
            console.warn(`Cannot connect ${sourceType} to ${targetType}`);
            alert(`Cannot connect: ${sourceType} is not compatible with ${targetType}`);
          }
        } else {
          // Default: allow connection if ports exist
          set({
            edges: addEdge(connection, edges),
          });
        }
      }
    },

    addNode: (node: CustomNode) => {
      set({
        nodes: [...get().nodes, node],
      });
    },

    updateNode: (nodeId: string, data: Partial<NodeData>) => {
      set({
        nodes: get().nodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        ),
      });
      get().saveToHistory();
    },

    deleteNode: (nodeId: string) => {
      const { nodes, edges } = get();
      set({
        nodes: nodes.filter((n) => n.id !== nodeId),
        edges: edges.filter((e) => e.source !== nodeId && e.target !== nodeId),
      });
      get().saveToHistory();
    },

    deleteNodes: (nodeIds: string[]) => {
      const { nodes, edges } = get();
      set({
        nodes: nodes.filter((n) => !nodeIds.includes(n.id)),
        edges: edges.filter((e) => !nodeIds.includes(e.source) && !nodeIds.includes(e.target)),
      });
      get().saveToHistory();
    },

    deleteEdge: (edgeId: string) => {
      set({
        edges: get().edges.filter((e) => e.id !== edgeId),
      });
      get().saveToHistory();
    },

    deleteEdges: (edgeIds: string[]) => {
      set({
        edges: get().edges.filter((e) => !edgeIds.includes(e.id)),
      });
      get().saveToHistory();
    },

    duplicateNode: (nodeId: string) => {
      const node = get().nodes.find((n) => n.id === nodeId);
      if (node) {
        const newNode: CustomNode = {
          ...node,
          id: `${node.id}-copy-${Date.now()}`,
          position: {
            x: node.position.x + 50,
            y: node.position.y + 50,
          },
        };
        set({
          nodes: [...get().nodes, newNode],
        });
        get().saveToHistory();
      }
    },

    saveToHistory: () => {
      const { nodes, edges, history, historyIndex } = get();
      const currentState: FlowState = { nodes: [...nodes], edges: [...edges] };

      // Remove any future history if we're not at the end
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(currentState);

      // Limit history size
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
      }

      set({
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
    },

    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) {
        const previousState = history[historyIndex - 1];
        set({
          nodes: previousState.nodes,
          edges: previousState.edges,
          historyIndex: historyIndex - 1,
        });
      }
    },

    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1) {
        const nextState = history[historyIndex + 1];
        set({
          nodes: nextState.nodes,
          edges: nextState.edges,
          historyIndex: historyIndex + 1,
        });
      }
    },

    canUndo: () => {
      return get().historyIndex > 0;
    },

    canRedo: () => {
      const { history, historyIndex } = get();
      return historyIndex < history.length - 1;
    },

    // Save/Load functionality
    saveFlow: () => {
      const { nodes, edges } = get();
      const flowData = {
        nodes: nodes.map(node => ({
          id: node.id,
          type: node.type,
          position: node.position,
          data: node.data,
        })),
        edges: edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
        })),
      };
      return JSON.stringify(flowData, null, 2);
    },

    loadFlow: (jsonString: string) => {
      try {
        const flowData = JSON.parse(jsonString) as { nodes: CustomNode[]; edges: any[] };
        set({
          nodes: flowData.nodes || [],
          edges: flowData.edges || [],
        });
      } catch (error) {
        console.error('Failed to load flow:', error);
      }
      // Save loaded state to history
      get().saveToHistory();
    },
  };
});

export default useNodeStore;
