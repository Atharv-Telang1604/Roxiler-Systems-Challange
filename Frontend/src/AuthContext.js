import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAuthMeta,
  getAuthToken,
  setAuthMeta,
  setAuthToken,
} from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getAuthToken());
  const [user, setUser] = useState(() => getAuthMeta());

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  useEffect(() => {
    setAuthMeta(user);
  }, [user]);

  const login = (tokenValue, userMeta) => {
    setTokenState(tokenValue);
    setUser(userMeta);
  };

  const logout = () => {
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

