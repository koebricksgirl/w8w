import type { WorkflowForm } from "./workflow";

export type NodeStatus = "idle" | "running" | "success" | "failed";

export type Field = {
  label: string;
  type: string;
  key: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
};

export type FormNodeConfigProps = {
  initialFields: Field[];
  onSave: (fields: Field[]) => void;
  formEntry?: WorkflowForm | null;
};

