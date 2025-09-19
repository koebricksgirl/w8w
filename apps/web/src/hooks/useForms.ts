import { useQuery, useMutation } from "@tanstack/react-query";
import { forms } from "../lib/api";

export function useForm(formId: string, secret?: string) {
  return useQuery({
    queryKey: ["form", formId, secret],
    queryFn: () => forms.get(formId, secret),
    enabled: !!formId,
  });
}

export function useSubmitForm(formId: string) {
  return useMutation({
    mutationFn: (data: Record<string, any>) => forms.submit(formId, data),
  });
}
