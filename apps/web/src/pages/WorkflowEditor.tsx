import { useParams, useNavigate } from "react-router-dom";
import type { Node } from '@xyflow/react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import type { FlowNodeData, WorkflowCredential } from '../types/workflow';
import { Platform } from '../types/platform';
import { useThemeStore } from "../store/useThemeStore";
import { nodeTypes } from "../components/nodes/nodeTypes";
import { useWorkflowEditor } from "../hooks/useWorkflowEditor";
import { useCredentials } from "../hooks/useCredentials";
import { useState, useCallback } from "react";
import NodeConfigDialog from "../components/nodes/NodeConfigDialog";
import { nodeIcons } from "../lib/nodeIcons";

import "@xyflow/react/dist/style.css";

function WorkflowEditorContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const isDark = theme === "dark";

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, saveWorkflow, isLoading } =
    useWorkflowEditor(id);

  const { data, isLoading: isLoadingCredentials } = useCredentials();
  const credentials = data?.credentials ?? [];

  const [selectedNode, setSelectedNode] = useState<Node<FlowNodeData> | null>(null);
  const [workflowTitle, setWorkflowTitle] = useState("");
  const [triggerType, setTriggerType] = useState<"Manual" | "Webhook">("Manual");
  const [webhookConfig, setWebhookConfig] = useState({
    title: "",
    method: "POST",
    secret: "",
  });

  const { setNodes } = useReactFlow();

  const availablePlatforms = Array.from(new Set(credentials.map((c: WorkflowCredential) => c.platform)));

  const getNextPosition = useCallback(() => {
    const offset = 150;
    const existingPositions = nodes.map(node => node.position);
    const basePosition = { x: 250, y: 150 };
    
    let newPosition = { ...basePosition };
    while (existingPositions.some(pos => pos.x === newPosition.x && pos.y === newPosition.y)) {
      newPosition.x += offset;
      if (newPosition.x > 800) { 
        newPosition.x = basePosition.x;
        newPosition.y += offset;
      }
    }
    return newPosition;
  }, [nodes]);

  const addNode = useCallback(
    (platform: Platform) => {
      const nodeNumber = nodes.length + 1;
      const nodeId = `node${nodeNumber}`;
      
      setNodes((nds) => [
        ...nds,
        {
          id: nodeId,
          type: platform,
          position: getNextPosition(),
          data: { 
            id: nodeId,
            label: `${platform} ${nodeNumber}`, 
            credentialsId: null, 
            config: {},
            type: platform 
          },
        },
      ]);
    },
    [setNodes, nodes]
  );

  if (isLoading || isLoadingCredentials) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      <aside className="w-full md:w-72 lg:w-80 border-r p-4 space-y-4 bg-white dark:bg-zinc-900 overflow-y-auto">
        <div className="space-y-4">
          <h3 className="font-bold">Add Node</h3>
          <div className="relative">
            <div className={`flex items-center gap-2 p-2 rounded border cursor-pointer ${
              isDark 
                ? 'bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700' 
                : 'bg-white border-zinc-200 text-black hover:bg-zinc-50'
            }`}>
              <select
                onChange={(e) => {
                  const platform = e.target.value as Platform;
                  if (platform) {
                    addNode(platform);
                    e.target.value = ''; 
                  }
                }}
                className="w-full appearance-none bg-transparent cursor-pointer focus:outline-none"
              >
                <option value="" className="hidden">Add a node...</option>
                {availablePlatforms.map((p) => {
                  const hasCredentials = credentials.some(c => c.platform === p);
                  if (!hasCredentials) return null;
                  return (
                    <option key={p} value={p} className="flex items-center">
                      {p}
                    </option>
                  );
                })}
              </select>
              <div className="flex items-center pointer-events-none">
                <svg className="w-4 h-4 fill-current opacity-50" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            
              <div className="flex flex-wrap gap-2 mt-2">
                {availablePlatforms.slice(0, 5).map((p) => {
                  const hasCredentials = credentials.some(c => c.platform === p);
                  if (!hasCredentials) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => addNode(p)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                        isDark 
                          ? 'bg-zinc-800 hover:bg-zinc-700' 
                          : 'bg-zinc-100 hover:bg-zinc-200'
                      }`}
                      title={`Add ${p} node`}
                    >
                      <img src={nodeIcons[p]} alt={p} className="w-4 h-4" />
                      <span>{p}</span>
                    </button>
                  );
                })}
                {availablePlatforms.length > 5 && (
                  <button
                    className={`px-3 py-1.5 rounded-full text-sm ${
                      isDark 
                        ? 'bg-zinc-800 hover:bg-zinc-700' 
                        : 'bg-zinc-100 hover:bg-zinc-200'
                    }`}
                    title="More platforms available"
                  >
                    +{availablePlatforms.length - 5} more
                  </button>
                )}
              </div>
          </div>
        </div>

        <h3 className="font-bold mt-6">Workflow</h3>
        <input
          type="text"
          placeholder="Workflow Title"
          value={workflowTitle}
          onChange={(e) => setWorkflowTitle(e.target.value)}
          className="w-full border px-2 py-1 rounded mb-2"
        />
        <select
          value={triggerType}
          onChange={(e) => setTriggerType(e.target.value as "Manual" | "Webhook")}
          className="w-full border px-2 py-1 rounded mb-2"
        >
          <option value="Manual">Manual</option>
          <option value="Webhook">Webhook</option>
        </select>

        {triggerType === "Webhook" && (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Webhook Title"
              value={webhookConfig.title}
              onChange={(e) => setWebhookConfig(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border px-2 py-1 rounded"
            />
            <select
              value={webhookConfig.method}
              onChange={(e) => setWebhookConfig(prev => ({ ...prev, method: e.target.value }))}
              className="w-full border px-2 py-1 rounded"
            >
              <option value="POST">POST</option>
              <option value="GET">GET</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </select>
            <input
              type="text"
              placeholder="Webhook Secret"
              value={webhookConfig.secret}
              onChange={(e) => setWebhookConfig(prev => ({ ...prev, secret: e.target.value }))}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        )}

        <button
          onClick={async () => {
            if (!workflowTitle) {
              alert("Please enter a workflow title");
              return;
            }
            if (triggerType === "Webhook" && (!webhookConfig.title || !webhookConfig.secret)) {
              alert("Please fill in all webhook details");
              return;
            }
            try {
              const response = await saveWorkflow(workflowTitle, triggerType, triggerType === "Webhook" ? webhookConfig : undefined);
              
              const getWorkflowId = (res: any): string => {
                if (res && typeof res === 'object') {
                  if ('workflow' in res && res.workflow && typeof res.workflow === 'object' && 'id' in res.workflow) {
                    return res.workflow.id;
                  }
                  if ('id' in res) {
                    return res.id;
                  }
                }
                throw new Error('Invalid workflow response');
              };

              const workflowId = getWorkflowId(response);
              navigate(`/workflows/editor/${workflowId}`);
            } catch (error) {
              console.error("Error saving workflow:", error);
              alert("Failed to save workflow. Please try again.");
            }
          }}
          className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Save Workflow
        </button>
      </aside>

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          className={isDark ? "react-flow-dark" : ""}
          fitView
          onNodeClick={(_, node) => setSelectedNode(node)}
        >
          <Controls />
          <MiniMap />
          <Background
            variant={BackgroundVariant.Dots}
            gap={12}
            size={1}
            color={isDark ? "#666" : "#ccc"}
          />
        </ReactFlow>
      </div>

      {selectedNode && (
        <NodeConfigDialog
          node={selectedNode}
          credentials={credentials.filter((c: WorkflowCredential) => c.platform === selectedNode.type)}
          onClose={() => setSelectedNode(null)}
          onSave={(data) => {
            setNodes((nds) =>
              nds.map((n) => (n.id === selectedNode.id ? { ...n, data } : n))
            );
            setSelectedNode(null);
          }}
        />
      )}
    </div>
  );
}

export default function WorkflowEditor() {
  return (
    <ReactFlowProvider>
      <WorkflowEditorContent />
    </ReactFlowProvider>
  );
}
