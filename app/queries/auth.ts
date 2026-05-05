import { useMutation } from "@tanstack/react-query";
import { api } from "~/lib/api";
import { useAuthStore } from "~/store/auth.store";
import type { User } from "~/types";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

export function useLogin() {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      api.post<AuthResponse>("/auth/login", payload),
    onSuccess: ({ token, user }) => login(token, user),
  });
}

export function useRegister() {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      api.post<AuthResponse>("/auth/register", payload),
    onSuccess: ({ token, user }) => login(token, user),
  });
}
