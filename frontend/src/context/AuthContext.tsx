import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { api, setAccessToken } from '../services/api';
import type { LoginResponseDTO } from '../types/dtos';

export type PerfilUsuario = 'ADMIN' | 'TECNICO' | 'CONSULTOR' | 'LEITOR' | 'JURIDICO';

export interface UsuarioDTO {
  id: string;
  nome: string;
  email: string;
  perfil: PerfilUsuario;
  registroProfissional?: string;
  organizacaoId?: string;
  ativo: boolean;
  doisFatores: boolean;
}

interface AuthContextType {
  usuario: UsuarioDTO | null;
  token: string | null;
  autenticado: boolean;
  carregando: boolean;
  desafio2FA: boolean;
  login: (email: string, senha: string) => Promise<boolean>;
  renovarSessao: () => Promise<boolean>;
  confirmar2FA: (codigo: string) => Promise<void>;
  logout: () => void;
  possuiPerfil: (...perfisPermitidos: PerfilUsuario[]) => boolean;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<UsuarioDTO | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState<boolean>(
    () => typeof localStorage !== 'undefined' && localStorage.getItem('sipma_session_active') === 'true',
  );
  const [desafio2FA, setDesafio2FA] = useState<boolean>(false);

  const limparSessaoLocal = useCallback(() => {
    setAccessToken(null);
    setToken(null);
    setUsuario(null);
    setDesafio2FA(false);
    localStorage.removeItem('sipma_session_active');
    localStorage.removeItem('sipma_token');
    localStorage.removeItem('sipma_user');
  }, []);

  const renovarSessao = useCallback(async (): Promise<boolean> => {
    try {
      const { data } = await api.post<LoginResponseDTO>('/usuarios/refresh');
      if (!data.token) {
        limparSessaoLocal();
        return false;
      }
      const userDTO: UsuarioDTO = data;
      setAccessToken(data.token);
      setToken(data.token);
      setUsuario(userDTO);
      localStorage.setItem('sipma_session_active', 'true');
      return true;
    } catch {
      limparSessaoLocal();
      return false;
    }
  }, [limparSessaoLocal]);

  useEffect(() => {
    // Limpa tokens legados em localStorage para garantir conformidade OWASP (Zero Token em Web Storage)
    localStorage.removeItem('sipma_token');
    localStorage.removeItem('sipma_user');

    const sessaoAtiva = localStorage.getItem('sipma_session_active') === 'true';
    if (!sessaoAtiva) {
      return;
    }

    void renovarSessao().finally(() => {
      setCarregando(false);
    });
  }, [renovarSessao]);

  const login = async (email: string, senha: string): Promise<boolean> => {
    setCarregando(true);
    try {
      // Autentica e recebe Refresh Token via Cookie HttpOnly (SameSite=Strict) + Access Token em memória
      const { data } = await api.post<LoginResponseDTO>('/usuarios/autenticar', { email, senha });
      if (!data.token) throw new Error('A autenticação não retornou um token válido.');
      const userDTO: UsuarioDTO = data;

      setAccessToken(data.token);
      setToken(data.token);
      setUsuario(userDTO);
      localStorage.setItem('sipma_session_active', 'true');
      localStorage.removeItem('sipma_token');
      localStorage.removeItem('sipma_user');
      setDesafio2FA(false);
      return true;
    } finally {
      setCarregando(false);
    }
  };

  const confirmar2FA = async (codigo: string) => {
    if (!usuario) throw new Error('Usuário não identificado para verificação 2FA.');
    setCarregando(true);
    try {
      throw new Error(`A confirmação 2FA ainda não está disponível no backend. Código recebido: ${codigo}`);
    } finally {
      setCarregando(false);
    }
  };

  const logout = () => {
    limparSessaoLocal();
    void api.post('/usuarios/logout').catch(() => undefined);
  };

  const possuiPerfil = (...perfisPermitidos: PerfilUsuario[]): boolean => {
    if (!usuario) return false;
    if (usuario.perfil === 'ADMIN') return true; // ADMIN possui acesso pleno aos recursos
    return perfisPermitidos.includes(usuario.perfil);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        autenticado: !!token && !!usuario,
        carregando,
        desafio2FA,
        login,
        renovarSessao,
        confirmar2FA,
        logout,
        possuiPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
