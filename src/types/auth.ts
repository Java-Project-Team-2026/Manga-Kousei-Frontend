export interface AuthContextType {
  user: {
    id: number;
    fullName: string;
    email: string;
    role: "MANGAKA" | "TANTOU" | "ADMIN" | "ASSISTANT";
  } | null;
  isAuthenticated: boolean;
  login: (loginPayload: loginPayload) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}
