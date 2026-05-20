import { useMutation } from "@tanstack/react-query";
import { api } from "~/lib/api";
import { useAuthStore } from "~/store/auth.store";
import type { User } from "~/types";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ForgotPasswordPayload {
  email: string;
}

interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

interface GoogleAuthPayload {
  idToken: string;
}

// Matches the real API AuthResponse
interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export function useLogin() {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: (payload: LoginPayload) =>
      api.post<AuthResponse>("/api/auth/login", payload),
    onSuccess: ({ accessToken, user }) => login(accessToken, user),
  });
}

export function useRegister() {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: (payload: RegisterPayload) =>
      api.post<AuthResponse>("/api/auth/register", payload),
    onSuccess: ({ accessToken, user }) => login(accessToken, user),
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  return useMutation({
    mutationFn: () => api.post<string>("/api/auth/logout", {}),
    onSuccess: () => logout(),
    onError: () => logout(), // clear local session even if server call fails
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      api.post<Record<string, string>>("/api/auth/forgot-password", payload),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: ResetPasswordPayload) =>
      api.post<Record<string, string>>("/api/auth/reset-password", payload),
  });
}

export function useGoogleLogin() {
  const login = useAuthStore((s) => s.login);
  return useMutation({
    mutationFn: (payload: GoogleAuthPayload) =>
      api.post<AuthResponse>("/api/auth/google", payload),
    onSuccess: ({ accessToken, user }) => login(accessToken, user),
  });
}
