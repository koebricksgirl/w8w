import { useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import type { Edge, Connection, Node } from '@xyflow/react';
import { useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import { workflows } from '../lib/api';
import type { FlowNodeData, WorkflowInput } from '../types/workflow';
import { flowToWorkflowNodes, flowToWorkflowConnections, workflowToFlowNodes, workflowToFlowEdges } from '../types/workflow';

export function useWorkflowEditor(id?: string) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<FlowNodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const { data, isLoading } = useQuery({
    queryKey: ['workflow', id],
    queryFn: () => workflows.get(id!),
    enabled: !!id,
  });

  const workflow = data?.workflow;

  const createMutation = useMutation({
    mutationFn: (data: WorkflowInput) => workflows.create(data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WorkflowInput> }) =>
      workflows.update(id, data),
  });

  useEffect(() => {
    if (workflow) {
      const flowNodes = workflowToFlowNodes(workflow);
      const flowEdges = workflowToFlowEdges(workflow);
      setNodes(flowNodes);
      setEdges(flowEdges);
    }
  }, [workflow, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const saveWorkflow = useCallback(
    async (title: string, triggerType: 'Manual' | 'Webhook', webhookConfig?: any) => {
      const workflowNodes = flowToWorkflowNodes(nodes);
      const workflowConnections = flowToWorkflowConnections(edges);

      const data: WorkflowInput = {
        title,
        triggerType,
        nodes: workflowNodes,
        connections: workflowConnections,
        ...(webhookConfig && { webhook: webhookConfig }),
      };

      if (id) {
        const updated = await updateMutation.mutateAsync({ id, data });
        return updated;
      } else {
        const created = await createMutation.mutateAsync(data);
        return created;
      }
    },
    [nodes, edges, id, createMutation, updateMutation],
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    saveWorkflow,
    isLoading,
    workflow,
  };
}