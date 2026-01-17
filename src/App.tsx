import React from 'react';
import FlowEditor from './components/FlowEditor';
import Toolbar from './components/Toolbar';
import ToastContainer from './components/ToastContainer';
import { useToast } from './hooks/useToast';

const App: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="w-screen h-screen flex flex-col">
      <Toolbar />
      <FlowEditor />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default App;
