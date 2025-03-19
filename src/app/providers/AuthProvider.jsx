"use client";
import { createContext, useEffect, useState } from "react";
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  return (
    <SessionProvider>
      <AuthContextProvider>{children}</AuthContextProvider>
    </SessionProvider>
  );
};

const AuthContextProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (session) {
      setUser(session.user);
    } else {
      setUser(null);
    }
  }, [session]);

  const login = async (method, credentials = null) => {
    if (method === "google") {
      await signIn("google");
    } else if (method === "credentials" && credentials) {
      await signIn("credentials", {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });
    }
  };

  const logout = async () => {
    await signOut();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, status }}>
      {children}
    </AuthContext.Provider>
  );
};
