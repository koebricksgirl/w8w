import { useParams } from 'react-router-dom';
import { ReactFlow, MiniMap, Controls, Background, BackgroundVariant } from '@xyflow/react';
import { useThemeStore } from '../store/useThemeStore';
import { nodeTypes } from '../components/nodes/nodeTypes';
import { useWorkflowEditor } from '../hooks/useWorkflowEditor';
import '@xyflow/react/dist/style.css';

export default function WorkflowEditor() {
  const { id } = useParams();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    isLoading,
  } = useWorkflowEditor(id);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        className={isDark ? 'react-flow-dark' : ''}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          color={isDark ? '#666' : '#eee'}
        />
      </ReactFlow>
    </div>
  );
}