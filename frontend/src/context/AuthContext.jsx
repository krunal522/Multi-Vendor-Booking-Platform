import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.name.split(" ")[0]}! ??`);
      return data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
      throw err;
    } finally { setLoading(false); }
  }, []);

  const register = useCallback(async (formData) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", formData);
      localStorage.setItem("token", data.token);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      toast.success("Account created successfully! ??");
      return data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
      throw err;
    } finally { setLoading(false); }
  }, []);

  const logout = useCallback(async () => {
    try { await api.post("/auth/logout"); } catch {}
    localStorage.clear();
    setUser(null);
    toast.success("Logged out successfully");
    window.location.href = "/";
  }, []);

  const updateUser = useCallback((updatedUser) => {
    const newUser = { ...user, ...updatedUser };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
