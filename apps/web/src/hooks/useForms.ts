import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { forms } from "../lib/api";
import type { WorkflowForm } from "../types/workflow";

type UseFormResult =
  | { kind: "form"; form: WorkflowForm }
  | { kind: "requiresSecret" };


export function useForm(formId: string, secret?: string) {
  return useQuery<UseFormResult>({
    queryKey: ["form", formId, secret],
    queryFn: async () => {
      const res = await forms.get(formId, secret);
      if ((res as any)?.message === "Access it via form secret") {
        return { kind: "requiresSecret" };
      }
       return { kind: "form", form: res.form as WorkflowForm };
    },
    enabled: !!formId,
    retry: false,
  });
}

export function useFormResponses(formId:string) {
  return useQuery({
    queryKey: ["form", formId],
    queryFn: async () => {
      const res = await forms.responses(formId);
      return { responses: res.formResponses}
    }
  })
}

export function useSubmitForm(formId: string) {
  return useMutation({
    mutationFn: (data: Record<string, any>) => forms.submit(formId, data),
  });
}

export function useOpenForm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formId: string) => forms.open(formId),
    onSuccess: (_, formId) => {
      qc.invalidateQueries({ queryKey: ["form", formId] });
      qc.invalidateQueries({ queryKey: ["workflows"] }); 
    },
  });
}

export function useCloseForm() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (formId: string) => forms.close(formId),
    onSuccess: (_, formId) => {
      qc.invalidateQueries({ queryKey: ["form", formId] });
      qc.invalidateQueries({ queryKey: ["workflows"] }); 
    },
  });
}

export function useUpdateFormSecret() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ formId, secret }: { formId: string; secret: string | null }) =>
      forms.updateSecret(formId, secret),
    onSuccess: (_, { formId }) => {
      qc.invalidateQueries({ queryKey: ["form", formId] });
      qc.invalidateQueries({ queryKey: ["workflows"] });
    },
  });
}
