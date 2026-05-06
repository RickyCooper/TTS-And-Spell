import React, { useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthState, LoginInput, RegisterInput } from "../../types/AuthTypes";
import { AuthContext } from "./AuthContext";
import * as AuthService from "../../services/AuthService";

const ACCESS_TOKEN_KEY = "tts_access_token";
const REFRESH_TOKEN_KEY = "tts_refresh_token";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  useEffect(() => {
    const restoreSession = async () => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);

      if (!accessToken) {
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      try {
        const user = await AuthService.getMe(accessToken);
        setAuthState({ user, isAuthenticated: true, isLoading: false });
      } catch {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      }
    };

    restoreSession();
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const { accessToken, refreshToken, user } = await AuthService.login(input);

    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    setAuthState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  const signup = useCallback(async (input: RegisterInput) => {
    await AuthService.register(input);

    await login({ identifier: input.username, password: input.password });
  }, [login]);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

    if (refreshToken) {
      await AuthService.logout(refreshToken).catch(() => {});
    }

    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    setAuthState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authState,
        user: authState.user,
        isAuthenticated: authState.isAuthenticated,
        isLoading: authState.isLoading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
