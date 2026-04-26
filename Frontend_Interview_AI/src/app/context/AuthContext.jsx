import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authService } from "../services/auth.service.js";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function checkAuth() {
      try {
        const currentUser = await authService.getCurrentUser();
        if (!ignore) {
          setUser(currentUser);
        }
      } catch (error) {
        if (!ignore) {
          setUser(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    checkAuth();

    const handleExpired = () => setUser(null);
    window.addEventListener("auth:expired", handleExpired);

    return () => {
      ignore = true;
      window.removeEventListener("auth:expired", handleExpired);
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      async login(email, password) {
        const data = await authService.login({ email, password });
        setUser(data.user);
      },
      async register(username, email, password) {
        const data = await authService.register({ username, email, password });
        setUser(data.user);
      },
      async logout() {
        await authService.logout();
        setUser(null);
      },
      setUser,
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
