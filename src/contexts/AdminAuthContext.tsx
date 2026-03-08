import { createContext, useContext, useState, ReactNode } from "react";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  token: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("admin_auth") === "true"
  );
  const [token, setToken] = useState<string | null>(
    () => sessionStorage.getItem("admin_token")
  );

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        setIsAuthenticated(true);
        setToken(data.token);
        sessionStorage.setItem("admin_auth", "true");
        sessionStorage.setItem("admin_token", data.token);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    sessionStorage.removeItem("admin_auth");
    sessionStorage.removeItem("admin_token");
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, token }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}
