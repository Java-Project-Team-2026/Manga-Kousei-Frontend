import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Role } from "../constants/roles";
import { AuthContext } from "../contexts/AuthContext";
import type { AuthContextType, AuthUser } from "../types/auth";
import api from "../services/api";
import axios from "axios";

interface AuthUserResponse {
  id: number;
  fullName: string;
  email: string;
  roles: Role[];
  avatarUrl: string | null;
}

const mapAuthUser = (data: AuthUserResponse): AuthUser => ({
  id: data.id,
  fullName: data.fullName,
  email: data.email,
  role: data.roles.at(0) ?? "MANGAKA",
  avatarUrl: data.avatarUrl,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const response = await api.get<ApiResponse<AuthUserResponse>>("/auth/me");
    const nextUser = mapAuthUser(response.data.data);
    setUser(nextUser);
    return nextUser;
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await refreshUser();
      } catch (error) {
        if (
          axios.isAxiosError(error) &&
          (error.response?.status === 401 || error.response?.status === 403)
        ) {
          setUser(null);
        } else {
          console.error("checkAuth error:", error);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [refreshUser]);
  const login = async (loginPayload: loginPayload) => {
    try {
      const response = await api.post<ApiResponse<AuthUserResponse>>(
        "/auth/login",
        loginPayload,
      );

      setUser(mapAuthUser(response.data.data));
    } catch (error) {
      console.error("Login function error in Provider:", error);
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);

    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("logout function error in Provider:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
    updateUser: setUser,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
