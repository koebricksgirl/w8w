import { create } from "zustand"
import type { Workflow } from "../types/workflow";

interface WorkflowsType {
 workflows: Workflow[],
 setWorkflows: (workflows: Workflow[]) => void;
}

export const useWorkflowsStore = create<WorkflowsType>((set) => ({
  workflows: [],
  setWorkflows: (workflows) => set({ workflows }),
}));