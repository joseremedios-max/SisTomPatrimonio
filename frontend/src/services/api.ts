import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { LoginResponseDTO } from '../types/dtos';

interface ApiErrorPayload {
  message?: string;
  detail?: string;
  title?: string;
}

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/**
 * Access Token mantido estritamente em memória (RAM) para imunização contra XSS (OWASP).
 * O Refresh Token trafega exclusivamente via Cookie HttpOnly com SameSite=Strict.
 */
let inMemoryAccessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  inMemoryAccessToken = token;
}

export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

export const api = axios.create({
  // Garante que a requisição vá para o Spring Boot (porta 8080) caso a variável de ambiente não exista
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',

  // OBRIGATÓRIO: Permite o envio de credenciais (Cookie HttpOnly SameSite=Strict)
  withCredentials: true,

  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  if (inMemoryAccessToken) {
    config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorPayload>) => {
    if (!error.response) {
      return Promise.reject(new Error('Servidor do SIP-MA indisponível. Verifique sua conexão.'));
    }

    const { status, data } = error.response;
    const originalConfig = error.config as RetryableRequestConfig | undefined;
    const requestUrl = originalConfig?.url ?? '';

    if (
      status === 401 &&
      originalConfig &&
      !originalConfig._retry &&
      !requestUrl.includes('/usuarios/autenticar') &&
      !requestUrl.includes('/usuarios/refresh')
    ) {
      originalConfig._retry = true;
      try {
        const refreshResponse = await api.post<LoginResponseDTO>('/usuarios/refresh');
        if (refreshResponse.data.token) {
          setAccessToken(refreshResponse.data.token);
          originalConfig.headers.Authorization = `Bearer ${refreshResponse.data.token}`;
          return api(originalConfig);
        }
      } catch {
        setAccessToken(null);
        localStorage.removeItem('sipma_session_active');
        localStorage.removeItem('sipma_token');
        localStorage.removeItem('sipma_user');
        if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
          window.location.assign('/admin/login?expired=true');
        }
      }
    } else if (status === 401) {
      setAccessToken(null);
      localStorage.removeItem('sipma_session_active');
      localStorage.removeItem('sipma_token');
      localStorage.removeItem('sipma_user');
    }

    if (status >= 502) {
      return Promise.reject(new Error('Servidor do SIP-MA indisponível. Verifique o backend.'));
    }

    return Promise.reject(
      new Error(data?.detail || data?.message || data?.title || `A requisição falhou (HTTP ${status}).`),
    );
  },
);

export default api;
