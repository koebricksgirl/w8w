import { Platform } from '../types/platform';
import type { Node, Edge } from '@xyflow/react';

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ExecStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
type TriggerType = 'Webhook' | 'Manual' | 'Cron';

export interface WorkflowNode {
  id: string;
  type: Platform;
  config: Record<string, any>;
  credentialsId?: string;
  position?: { x: number; y: number };
}

export interface WorkflowWebhook {
  title: string;
  method: Methods;
  secret?: string;
}

export interface WorkflowForm {
  id: string;
  nodeId: string;
  title: string;
  fields: any[]; 
  userId: string;
  workflowId: string;
  isActive: boolean;
  secret?: string | null;
  createdAt: string;
  updatedAt: string;
}


export interface Workflow {
  id: string;
  title: string;
  enabled: boolean;
  triggerType: TriggerType;
  nodes: Record<string, WorkflowNode>;
  connections: Record<string, string[]>;
  webhook?: WorkflowWebhook;
  webhookId?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;

   form?: WorkflowForm[];
}

export interface WorkflowInput {
  title: string;
  triggerType: TriggerType;
  nodes: Record<string, WorkflowNode>;
  connections: Record<string, string[]>;
  webhook?: WorkflowWebhook;
  enabled?: boolean;
}

export interface WorkflowCredential {
  id: string;
  title: string;
  platform: Platform;
  data: Record<string, any>;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowCredentialInput {
  title: string;
  platform: Platform;
  data: Record<string, any>;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: ExecStatus;
  tasksDone: number;
  totalTasks?: number;
  output?: any;
  logs?: any;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowRunInput {
  workflowId: string;
  input?: Record<string, any>;
}

export interface FlowNodeData {
  [key: string]: unknown;
  id: string;
  label: string;
  type: Platform;
  config: Record<string, any>;
  credentialsId?: string | null;
  workflowId?: string;
}

export type WorkflowEvent =
  | { type: "execution_started"; executionId: string; workflowId: string; totalTasks: number }
  | { type: "execution_finished"; executionId: string; workflowId: string; status: string; tasksDone: number; totalTasks: number}
  | { type: "node_started"; executionId: string; workflowId: string; nodeId: string; nodeType: string }
  | { type: "node_succeeded"; executionId: string; workflowId: string; nodeId: string; nodeType: string }
  | { type: "node_failed"; executionId: string; workflowId: string; nodeId: string; nodeType: string; error: string };


export const flowToWorkflowNodes = (nodes: Node<FlowNodeData>[]): Record<string, WorkflowNode> => {
  return nodes.reduce((acc, node) => {
    if (!node.data) return acc;
    acc[node.id] = {
      id: node.id,
      type: node.data.type,
      config: node.data.config,
      credentialsId: node.data.credentialsId || undefined,
      position: { 
        x: Math.round(node.position.x),
         y: Math.round(node.position.y)
        },
    };
    return acc;
  }, {} as Record<string, WorkflowNode>);
};

export const flowToWorkflowConnections = (edges: Edge[]): Record<string, string[]> => {
  return edges.reduce((acc, edge) => {
    if (!acc[edge.source]) {
      acc[edge.source] = [];
    }
    acc[edge.source].push(edge.target);
    return acc;
  }, {} as Record<string, string[]>);
};

export const workflowToFlowNodes = (workflow: Workflow | null | undefined): Node<FlowNodeData>[] => {
  if (!workflow || !workflow.nodes) return [];
  
  return Object.entries(workflow.nodes).map(([id, node], index) => {
    const nodeWithPosition = node as WorkflowNode & { position?: { x: number; y: number } };

    return {
    id,
    type: node.type,
    position: nodeWithPosition.position ||  { x: 250 * index, y: 100 },
    data: {
      id,
      label: `${node.type} ${index + 1}`,
      type: node.type,
      config: node.config || {},
      credentialsId: node.credentialsId,
    },
  }
});
};

export const workflowToFlowEdges = (workflow: Workflow | null | undefined): Edge[] => {
  if (!workflow || !workflow.connections) return [];
  
  return Object.entries(workflow.connections).flatMap(([source, targets]) =>
    targets.map((target) => ({
      id: `${source}-${target}`,
      source,
      target,
      type: 'smoothstep',
    }))
  );
};

