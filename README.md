# Node Editor - React Flow Prototype

A fully functional visual node-based editor built with React Flow and TypeScript, featuring drag-and-drop nodes, custom node types, edge validation, real-time state management with Zustand, and JSON persistence.

## Features

✅ **Drag-and-Drop Nodes** - Drag nodes from the palette onto the canvas  
✅ **Custom Node Types** - Multiple node types with custom ports (Data Source, Transform, Filter, Aggregate, Output)  
✅ **Edge Validation** - Conditional connections based on port type compatibility  
✅ **Real-time State Sync** - Zustand store for reactive state management  
✅ **Persistence** - Save and load flows as JSON files  

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## Usage

1. **Add Nodes**: Drag nodes from the left palette onto the canvas, or click to add them
2. **Connect Nodes**: Click and drag from output ports (right side) to input ports (left side)
3. **Edge Validation**: Connections are automatically validated - incompatible types will be rejected
4. **Save Flow**: Click "Save" to download your flow as a JSON file
5. **Load Flow**: Click "Load" to import a previously saved flow
6. **Clear Canvas**: Click "Clear" to remove all nodes and edges

## Node Types

- **Data Source**: Input node with output port
- **Transform**: Process data with input and output ports
- **Filter**: Filter data by condition
- **Aggregate**: Aggregate data (outputs number type)
- **Output**: Final destination node with input port

## Port Types

Ports support type validation:
- `string` - String data type
- `number` - Numeric data type
- `boolean` - Boolean data type
- `any` - Accepts any type

Connections are only allowed when types are compatible or one port accepts `any`.

## Project Structure

```
node_editor/
├── src/
│   ├── components/
│   │   ├── CustomNode.tsx      # Custom node component with ports
│   │   ├── FlowEditor.tsx      # Main React Flow editor
│   │   ├── NodePalette.tsx     # Node palette sidebar
│   │   └── Toolbar.tsx         # Save/Load/Clear toolbar
│   ├── store/
│   │   └── useNodeStore.ts     # Zustand state management
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── App.tsx                 # Main app component
│   ├── App.css                 # Styles
│   └── main.tsx                # Entry point
├── package.json
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration
```

## Technologies

- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **React Flow 11** - Node-based editor
- **Zustand 4** - State management
- **Vite** - Build tool
