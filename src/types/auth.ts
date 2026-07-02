export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: "MANGAKA" | "TANTOU" | "ADMIN" | "ASSISTANT";
  avatarUrl: string | null;
}

export interface AuthContextType {
  user: {
    id: number;
    fullName: string;
    email: string;
    role: "MANGAKA" | "TANTOU" | "ADMIN" | "ASSISTANT";
    avatarUrl: string | null;
  } | null;
  isAuthenticated: boolean;
  login: (loginPayload: loginPayload) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;

  updateUser: (partial: Partial<AuthUser>) => void;
}
