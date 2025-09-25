import { Link, useNavigate } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';
import { PlusIcon, PlayIcon, TrashIcon, Pencil2Icon } from '@radix-ui/react-icons';
import { renderWorkflowSequence } from '../utils/renderWorkflowSequence';
import { nodeIcons } from '../lib/nodeIcons';
import { useDeleteWorkflow, useWorkflows } from '../hooks/useWorkflows';
import { useState } from 'react';
import type { Workflow } from '../types/workflow';
import { Modal } from './Credentials/Modal';

export default function Dashboard() {
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  const { data: workflowsList = [], isLoading, isError } = useWorkflows();
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [modalType, setModalType] = useState<null | "delete">(null);
  const deleteWorkflow = useDeleteWorkflow();

  return (
    <div className="pb-32 pt-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="lg:flex max-lg:space-y-4 justify-between items-center mb-8">
          <h1 className="flex items-center gap-3 text-3xl font-bold">
            <img src={nodeIcons.Workflow} alt="Workflow" className="w-8 h-8" />
            My Workflows
          </h1>
          <p>
            Go to this <span className="text-yellow-400 cursor-pointer" onClick={() => {
              navigate(`/docs/1`)
            }}>Workflows Docs</span> for knowing how create workflows and examples with all details
          </p>
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
          {isLoading && (
            <div className="col-span-full text-center text-zinc-400">
              Loading workflows...
            </div>
          )}
          {isError && (
            <div className="col-span-full text-center text-red-500">
              Failed to load workflows.
            </div>
          )}
          {!isLoading && workflowsList.length === 0 && (
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
                  } transition-colors`}
                  onClick={() => {
                    navigate(`/workflows/editor/${workflow.id}`)
                  }}
                >
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
                  <Pencil2Icon className='h-5 w-5' />
                </Link>
                <button className={`px-3 py-1 rounded text-sm ${isDark
                  ? 'hover:bg-white/10 text-red-400'
                  : 'hover:bg-zinc-100 text-red-500'
                  } transition-colors`}
                  onClick={() => {
                    setSelectedWorkflow(workflow);
                    setModalType("delete");
                  }}
                >
                  <TrashIcon className='h-5 w-5' />
                </button>
              </div>
            </div>
          ))}
        </div>

        {modalType === "delete" && selectedWorkflow && (
          <Modal onClose={() => setModalType(null)}>
            <h2 className="text-lg font-semibold mb-4">Delete Workflow</h2>
            <p>Are you sure you want to delete <span className="font-bold">{selectedWorkflow.title}</span>?</p>
            <div className="flex gap-2 mt-6 justify-end">
              <button
                className={`px-4 py-2 text-white rounded ${isDark?"bg-blue-600 hover:bg-blue-800":" bg-blue-500 hover:bg-blue-400"} cursor-pointer`}
                onClick={() => setModalType(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                onClick={() => {
                  deleteWorkflow.mutate(selectedWorkflow.id!, {
                    onSuccess: () => {
                      setModalType(null);
                      setSelectedWorkflow(null);
                    }
                  });
                }}
              >
                Delete
              </button>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}
