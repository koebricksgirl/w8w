import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';
import { PlusIcon, PlayIcon } from '@radix-ui/react-icons';
import { useEffect } from 'react';
import { workflows } from '../lib/api';
import { useWorkflowsStore } from '../store/useWorkflowStore';
import { renderWorkflowSequence } from '../utils/renderWorkflowSequence';
import { nodeIcons } from '../lib/nodeIcons';

export default function Dashboard() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const setWorkflows = useWorkflowsStore(state => state.setWorkflows);
  const workflowsList = useWorkflowsStore(state => state.workflows)

  useEffect(() => {
    (async () => {
      const data = await workflows.list();
      setWorkflows(data);
    })();
  }, [setWorkflows]);

  return (
    <div className="py-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            <img src={nodeIcons.Workflow} alt="Workflow" className="w-8 h-8" />
            My Workflows
          </h1>
          <Link
            to="/workflows/editor"
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${isDark
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-500 hover:bg-blue-600'
              } text-white transition-colors`}
          >
            <PlusIcon className="w-5 h-5" />
            Create Workflow
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workflowsList.length === 0 && (
            <div className="col-span-full text-center text-zinc-400">
              No workflows found.
            </div>
          )}
          {workflowsList.map((workflow) => (
            <div
              key={workflow.id}
              className={`p-6 rounded-lg border ${isDark ? 'border-zinc-800' : 'border-zinc-200'
                }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  {renderWorkflowSequence(workflow)}
                  <h3 className="font-semibold mb-1">{workflow.title}</h3>
                  <p className={`text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-600'
                    }`}>
                    {workflow.triggerType} trigger
                  </p>
                </div>
                <button className={`p-2 rounded-lg ${isDark
                    ? 'hover:bg-white/10'
                    : 'hover:bg-zinc-100'
                  } transition-colors`}>
                  <PlayIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/workflows/editor/${workflow.id}`}
                  className={`px-3 py-1 rounded text-sm ${isDark
                      ? 'hover:bg-white/10'
                      : 'hover:bg-zinc-100'
                    } transition-colors`}
                >
                  Edit
                </Link>
                <button className={`px-3 py-1 rounded text-sm ${isDark
                    ? 'hover:bg-white/10 text-red-400'
                    : 'hover:bg-zinc-100 text-red-500'
                  } transition-colors`}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
