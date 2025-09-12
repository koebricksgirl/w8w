import { Platform } from '@w8w/db';
import type { Node, Edge } from '@xyflow/react';

type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';
type ExecStatus = 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
type TriggerType = 'Webhook' | 'Manual' | 'Cron';

export interface WorkflowNode {
  id: string;
  type: Platform;
  config: Record<string, any>;
  credentialsId?: string;
}

export interface WorkflowWebhook {
  title: string;
  method: Methods;
  secret?: string;
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
  label: string;
  type: Platform;
  config: Record<string, any>;
  credentialsId?: string;
}

export const flowToWorkflowNodes = (nodes: Node<FlowNodeData>[]): Record<string, WorkflowNode> => {
  return nodes.reduce((acc, node) => {
    if (!node.data) return acc;
    acc[node.id] = {
      id: node.id,
      type: node.data.type,
      config: node.data.config,
      credentialsId: node.data.credentialsId,
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

export const workflowToFlowNodes = (workflow: Workflow): Node<FlowNodeData>[] => {
  return Object.entries(workflow.nodes).map(([id, node], index) => ({
    id,
    type: node.type,
    position: { x: 250 * index, y: 100 },
    data: {
      label: node.type,
      type: node.type,
      config: node.config,
      credentialsId: node.credentialsId,
    },
  }));
};

export const workflowToFlowEdges = (workflow: Workflow): Edge[] => {
  return Object.entries(workflow.connections).flatMap(([source, targets]) =>
    targets.map((target) => ({
      id: `${source}-${target}`,
      source,
      target,
      type: 'smoothstep',
    }))
  );
};