import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import type { 
  Workflow, 
  WorkflowInput, 
  WorkflowCredential, 
  WorkflowCredentialInput,
  WorkflowExecution,
  WorkflowRunInput,
  WorkflowForm 
} from '../types/workflow';

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: async (email: string, password: string) => {
    const response = await api.post("/user/signin", { email, password });
    return response.data;
  },
  register: async (email: string, password: string) => {
    const response = await api.post("/user/signup", { email, password });
    return response.data;
  },
  verify: async () => {
    const response = await api.get("/user/verify");
    return response.data;
  },
};


export const workflows = {
  list: async (): Promise<Workflow[]> => {
    const response = await api.get("/workflows/get");
    return response.data.workflows;
  },
  create: async (data: WorkflowInput): Promise<{ message: string; workflow: Workflow; execution?: WorkflowExecution }> => {
    const response = await api.post("/workflows/post", data);
    return response.data;
  },
  get: async (workflowId: string): Promise<{ message: string; workflow: Workflow }> => {
    const response = await api.get(`/workflows/get/${workflowId}`);
    return response.data;
  },
  update: async (workflowId: string, data: Partial<WorkflowInput>): Promise<{ message: string; workflow: Workflow }> => {
    const response = await api.put(`/workflows/update/${workflowId}`, data);
    return response.data;
  },
  delete: async (workflowId: string): Promise<void> => {
    await api.delete(`/workflows/delete/${workflowId}`);
  },
  run: async (input: WorkflowRunInput): Promise<WorkflowExecution> => {
    const response = await api.post(`/workflows/manual/run/${input.workflowId}`, {
      input: input.input
    });
    return response.data;
  }
};

export const credentials = {
  list: async (): Promise<{ message: string; credentials: WorkflowCredential[] }> => {
    const response = await api.get("/credentials/get");
    return response.data;
  },
  create: async (data: WorkflowCredentialInput): Promise<WorkflowCredential> => {
    const response = await api.post("/credentials/post", data);
    return response.data;
  },
  get: async (credentialId: string): Promise<WorkflowCredential> => {
    const response = await api.get(`/credentials/get/${credentialId}`);
    return response.data;
  },
  update: async (credentialId: string, data: Partial<WorkflowCredentialInput>): Promise<WorkflowCredential> => {
    const response = await api.put(`/credentials/update/${credentialId}`, data);
    return response.data;
  },
  delete: async (credentialId: string): Promise<void> => {
    await api.delete(`/credentials/delete/${credentialId}`);
  },
};

export const forms = {
  get: async (formId: string, secret?: string): Promise<{ form: WorkflowForm }> => {
    const response = await api.get(`/forms/${formId}`, {
      params: secret ? { formSecret: secret } : {},
    });
    return response.data;
  },
  submit: async (formId: string, data: Record<string, any>) => {
    const response = await api.post(`/forms/${formId}/submit`, data);
    return response.data;
  },
  responses: async (formId: string) => {
    const response = await api.get(`/forms/${formId}/responses`);
    return response.data;
  },
  open: async (formId: string) => {
    const response = await api.patch(`/forms/${formId}/open`);
    return response.data;
  },
  close: async (formId: string) => {
    const response = await api.patch(`/forms/${formId}/close`);
    return response.data;
  },
};
