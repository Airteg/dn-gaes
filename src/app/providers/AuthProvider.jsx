"use client";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);

    if (storedToken) {
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) setUser(data);
        })
        .catch((err) =>
          console.error(
            "❌ [AuthProvider] Помилка отримання користувача:",
            err,
          ),
        );
    }
  }, []);

  const login = async (newToken) => {
    // console.log("📌 [AuthProvider] Викликано login(), токен:", newToken);
    localStorage.setItem("token", newToken);
    setToken(newToken);

    try {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      const data = await res.json();
      // console.log("📌 [AuthProvider] Дані користувача після входу:", data);

      if (!data.error) {
        setUser(data);
      } else {
        console.error(
          "❌ [AuthProvider] Помилка отримання користувача:",
          data.error,
        );
      }
    } catch (error) {
      console.error("❌ [AuthProvider] Помилка запиту:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // console.log("🚀 AuthContext ~ user:", user);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
