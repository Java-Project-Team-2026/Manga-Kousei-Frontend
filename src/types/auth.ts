export type AuthUser = {
  id: number;
  fullName: string;
  email: string;
  role: "MANGAKA" | "TANTOU" | "ADMIN" | "ASSISTANT";
  avatarUrl: string | null;
};

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (loginPayload: loginPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<AuthUser>;
  updateUser: (user: AuthUser) => void;
  loading: boolean;
}
