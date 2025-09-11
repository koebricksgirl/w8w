import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useThemeStore } from '../../store/useThemeStore';
import type { FlowNodeData } from '../../types/workflow';

type CustomNodeProps = {
  data: FlowNodeData;
  selected?: boolean;
};

const BaseNode = ({ data }: CustomNodeProps) => {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  if (!data) return null;

  return (
    <div
      className={`px-4 py-2 shadow-md rounded-md border ${
        isDark ? 'border-zinc-700' : 'border-zinc-200'
      } ${
        isDark ? 'bg-zinc-800 text-white' : 'bg-white text-zinc-900'
      }`}
    >
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-2 ${
          data.credentialsId 
            ? 'bg-green-500' 
            : 'bg-yellow-500'
        }`} />
        <div className="text-sm font-bold">{data.label}</div>
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className={`w-2 h-2 ${
          isDark ? '!bg-zinc-600' : '!bg-zinc-300'
        }`}
      />
      
      <Handle
        type="source"
        position={Position.Right}
        className={`w-2 h-2 ${
          isDark ? '!bg-zinc-600' : '!bg-zinc-300'
        }`}
      />
    </div>
  );
};

export default memo(BaseNode);