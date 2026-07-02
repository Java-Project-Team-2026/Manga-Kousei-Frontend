import { createContext } from "react";

export type ThemeMode = "system" | "light" | "dark";

export interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined,
);
