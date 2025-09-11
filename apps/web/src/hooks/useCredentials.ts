import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { credentials } from "../lib/api";

export function useCredentials() {
  return useQuery({
    queryKey: ["credentials"],
    queryFn: credentials.list,
  });
}

export function useCredential(id: string) {
  return useQuery({
    queryKey: ["credentials", id],
    queryFn: () => credentials.get(id),
  });
}

export function useCreateCredential() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: credentials.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
    },
  });
}

export function useUpdateCredential() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return credentials.update(id, data);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
      queryClient.invalidateQueries({ queryKey: ["credentials", id] });
    },
  });
}

export function useDeleteCredential() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: credentials.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credentials"] });
    },
  });
}
