import { useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import useNodeStore from '../store/useNodeStore';
import { useToast } from '../hooks/useToast';

const KeyboardShortcuts: React.FC = () => {
  const reactFlow = useReactFlow();
  const { getNodes, getEdges } = reactFlow;
  const { deleteNodes, deleteEdges, undo, redo, canUndo, canRedo, duplicateNode } = useNodeStore();
  const { showToast } = useToast();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      // Delete/Backspace - Delete selected nodes/edges
      if ((event.key === 'Delete' || event.key === 'Backspace') && !event.ctrlKey && !event.metaKey) {
        const selectedNodes = getNodes().filter((n) => n.selected);
        const selectedEdges = getEdges().filter((e) => e.selected);

        if (selectedNodes.length > 0) {
          deleteNodes(selectedNodes.map((n) => n.id));
          showToast(`Deleted ${selectedNodes.length} node(s)`, 'info');
        }
        if (selectedEdges.length > 0) {
          deleteEdges(selectedEdges.map((e) => e.id));
          showToast(`Deleted ${selectedEdges.length} edge(s)`, 'info');
        }
        event.preventDefault();
      }

      // Ctrl/Cmd + Z - Undo
      if ((event.ctrlKey || event.metaKey) && event.key === 'z' && !event.shiftKey) {
        if (canUndo()) {
          undo();
          showToast('Undone', 'success');
        }
        event.preventDefault();
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y - Redo
      if (
        ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'z') ||
        ((event.ctrlKey || event.metaKey) && event.key === 'y')
      ) {
        if (canRedo()) {
          redo();
          showToast('Redone', 'success');
        }
        event.preventDefault();
      }

      // Ctrl/Cmd + D - Duplicate selected node
      if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
        const selectedNodes = getNodes().filter((n) => n.selected);
        if (selectedNodes.length === 1) {
          duplicateNode(selectedNodes[0].id);
          showToast('Node duplicated', 'success');
        }
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [getNodes, getEdges, deleteNodes, deleteEdges, undo, redo, canUndo, canRedo, duplicateNode, showToast]);

  return null;
};

export default KeyboardShortcuts;
