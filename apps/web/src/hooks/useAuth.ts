import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { auth } from "../lib/api";

interface LoginCredentials {
  email: string;
  password: string;
}

export function useLogin() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const data = await auth.login(credentials.email, credentials.password);
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      navigate("/dashboard");
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const data = await auth.register(credentials.email, credentials.password);
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      navigate("/dashboard");
    },
  });
}

export function useVerifyAuth() {
  const { setAuth, clearAuth } = useAuthStore();

  return useMutation({
    mutationFn: async () => {
      const data = await auth.verify();
      return data;
    },
    onSuccess: (data) => {
      setAuth(data.token, data.user);
    },
    onError: () => {
      clearAuth();
    },
  });
}
