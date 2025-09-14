import { Dialog, DialogClose, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { useState, useMemo } from "react";
import { useThemeStore } from "../../store/useThemeStore";
import { useWorkflowEditor } from "../../hooks/useWorkflowEditor";
import type { Node } from '@xyflow/react';
import type { FlowNodeData, WorkflowCredential } from '../../types/workflow';

interface VariableOption {
  label: string;
  value: string;
  tooltip?: string;
}

type NodeConfigDialogProps = {
  node: Node<FlowNodeData>;
  credentials: WorkflowCredential[];
  onClose: () => void;
  onSave: (data: FlowNodeData) => void;
};

export default function NodeConfigDialog({ node, credentials, onClose, onSave }: NodeConfigDialogProps) {
  const [credentialId, setCredentialId] = useState<string>(node.data.credentialsId || "");
  const [config, setConfig] = useState<Record<string, any>>(() => {
    const defaultConfig: Record<string, string> = {};

    switch (node.type) {
      case 'ResendEmail':
        defaultConfig.to = node.data.config?.to || '';
        defaultConfig.subject = node.data.config?.subject || '';
        defaultConfig.body = node.data.config?.body || '';
        break;
      case 'Telegram':
        defaultConfig.message = node.data.config?.message || '';
        break;
      case 'Gemini':
        defaultConfig.prompt = node.data.config?.prompt || '';
        defaultConfig.memory = node.data.config?.memory ?? false;
        break;
    }

    return defaultConfig;
  });

  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const { nodes, edges, workflow } = useWorkflowEditor();

  const availableVariables = useMemo(() => {
    const variables: VariableOption[] = [];

    if (workflow?.triggerType === 'Webhook') {
      variables.push({
        label: 'Webhook Body Data',
        value: '{{ $json.body }}',
        tooltip: 'Access any data from the webhook body'
      });
    }

    const incomingNodes = edges
      .filter(edge => edge.target === node.id)
      .map(edge => nodes.find(n => n.id === edge.source))
      .filter(Boolean);

    incomingNodes.forEach(sourceNode => {
      if (!sourceNode) return;

      let outputFields = '';
      switch (sourceNode.type) {
        case 'Gemini':
          outputFields = '.text';
          break;
        case 'ResendEmail':
          outputFields = '';
          break;
        case 'Telegram':
          outputFields = '';
          break;
      }

      variables.push({
        label: `${sourceNode.id} (${sourceNode.data?.label || sourceNode.type})`,
        value: `{{ $node.${sourceNode.id}${outputFields} }}`,
        tooltip: `Node Type: ${sourceNode.type}\nPosition in Flow: ${sourceNode.id}`
      });
    });

    return variables;
  }, [nodes, edges, workflow, node.id]);

  const getFieldInfo = (key: string) => {
    switch (node.type) {
      case 'ResendEmail':
        switch (key) {
          case 'to':
            return {
              label: 'To Email',
              placeholder: 'recipient@example.com or use variables',
              type: 'text',
              helper: 'Email address or variable from webhook/connected nodes'
            };
          case 'subject':
            return {
              label: 'Subject',
              placeholder: 'Email subject with optional variables',
              type: 'text',
              helper: 'Can include variables for dynamic content'
            };
          case 'body':
            return {
              label: 'Body',
              placeholder: 'Email body with optional variables',
              type: 'textarea',
              helper: 'Supports variables from webhook or connected nodes'
            };
        }
        break;
      case 'Telegram':
        return {
          label: 'Message',
          placeholder: 'Message text with optional variables',
          type: 'textarea',
          helper: 'Can include variables for dynamic content'
        };
      case 'Gemini':
        return {
          label: 'Prompt',
          placeholder: 'Prompt text with optional variables',
          type: 'textarea',
          helper: 'Can include variables from webhook or connected nodes'
        };
    }
    return {
      label: key,
      placeholder: `Enter ${key}`,
      type: 'text',
      helper: ''
    };
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className={`${isDark ? "bg-zinc-900" : "bg-white"} p-6 rounded-lg`}>
        <DialogTitle className="font-bold mb-4">
          Configure {node.type}
        </DialogTitle>

        <div className="space-y-4">
          <div>
            <label className="block mb-2">Credential</label>
            <select
              value={credentialId}
              onChange={(e) => setCredentialId(e.target.value)}
              className={`w-full border rounded p-2 ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-200'
                }`}
            >
              <option value="">Select Credential</option>
              {credentials.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {Object.entries(config).map(([key, value]) => {
              if (node.type === 'Gemini' && key === 'memory') {
                return null; 
              }
            
            const fieldInfo = getFieldInfo(key);

            return (
              <div key={key}>
                <label className="block mb-2 font-medium">{fieldInfo.label}</label>
                <div className="space-y-2">
                  {fieldInfo.type === 'textarea' ? (
                    <textarea
                      value={value}
                      onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                      className={`w-full border rounded p-2 min-h-[100px] ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-200'
                        }`}
                      placeholder={fieldInfo.placeholder}
                    />
                  ) : (
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                      className={`w-full border rounded p-2 ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-200'
                        }`}
                      placeholder={fieldInfo.placeholder}
                    />
                  )}
                  {fieldInfo.helper && (
                    <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                      {fieldInfo.helper}
                    </p>
                  )}
                  {availableVariables.length > 0 && (
                    <select
                      onChange={(e) => {
                        if (!e.target.value) return;
                        const newValue = value ? `${value} ${e.target.value}` : e.target.value;
                        setConfig({ ...config, [key]: newValue });
                        e.target.value = '';
                      }}
                      className={`w-full border rounded p-2 ${isDark ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-200'
                        }`}
                    >
                      <option value="">Insert variable...</option>
                      {availableVariables.map((v) => (
                        <option key={v.value} value={v.value} title={v.tooltip || v.label}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            );
          })}

          {node.type === 'Gemini' && (
            <div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.memory === true}
                  onChange={(e) => setConfig({ ...config, memory: e.target.checked })}
                />
                Enable Memory
              </label>
              <p className="text-sm text-zinc-500">
                If enabled, Gemini will recall the last 25 exchanges for this workflow.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <DialogClose asChild>
              <button className={`px-4 py-2 rounded ${isDark ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-100 hover:bg-zinc-200'
                }`}>
                Cancel
              </button>
            </DialogClose>
            <button
              onClick={() => onSave({ ...node.data, credentialsId: credentialId, config })}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}