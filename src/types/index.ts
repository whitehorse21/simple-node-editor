import { Node, Edge, Connection, NodeChange, EdgeChange } from 'reactflow';

export type PortType = 'string' | 'number' | 'boolean' | 'any';
export type PortDirection = 'input' | 'output';

export interface Port {
  id: string;
  name: string;
  type: PortDirection;
  dataType: PortType;
  position?: number;
}

export interface NodeData {
  label: string;
  type?: string;
  color?: string;
  description?: string;
  ports?: Port[];
}

export interface CustomNode extends Node<NodeData> {
  type: 'custom';
  data: NodeData;
}

export interface NodeTypeDefinition {
  id: string;
  label: string;
  type: string;
  color: string;
  description: string;
  ports: Port[];
}

export interface FlowData {
  nodes: CustomNode[];
  edges: Edge[];
}

export interface FlowState {
  nodes: CustomNode[];
  edges: Edge[];
}

export interface NodeStore {
  nodes: CustomNode[];
  edges: Edge[];
  history: FlowState[];
  historyIndex: number;
  setNodes: (nodes: CustomNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: CustomNode) => void;
  updateNode: (nodeId: string, data: Partial<NodeData>) => void;
  deleteNode: (nodeId: string) => void;
  deleteNodes: (nodeIds: string[]) => void;
  deleteEdge: (edgeId: string) => void;
  deleteEdges: (edgeIds: string[]) => void;
  duplicateNode: (nodeId: string) => void;
  saveToHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  saveFlow: () => string;
  loadFlow: (jsonString: string) => void;
}
