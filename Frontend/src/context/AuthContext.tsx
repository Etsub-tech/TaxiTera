// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    password: string,
    securityQuestions: any[],
  ) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = "http://localhost:5000/api/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  // On mount: restore user from token if exists
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split(".")[1]));
        setUser({ id: payload.id, username: payload.username });
        setToken(storedToken);
      } catch (err) {
        console.error("Invalid token on load", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Login failed:", data.message);
        return false;
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Decode and update user state immediately
      const payload = JSON.parse(atob(data.token.split(".")[1]));
      setUser({ id: payload.id, username: payload.username });
      setToken(data.token);

      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const register = async (
    username: string,
    password: string,
    securityQuestions: any[],
  ): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, securityQuestions }),
      });

      if (!res.ok) return false;
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
