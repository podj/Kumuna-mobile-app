import React, { createContext, useState, useEffect } from "react";

import * as backendService from "../services/backendService";
import * as firebaseService from "../services/firebaseService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);

    try {
      await firebaseService.login(email, password);
      setAuthError(null);
    } catch (e) {
      setAuthError(e.message);
    }

    setLoading(false);
  };

  const register = async (email, displayName, password) => {
    setLoading(true);

    try {
      await backendService.createUser({ email, displayName, password });
      await firebaseService.login(email, password);
      setAuthError(null);
    } catch (e) {
      setAuthError(e.message);
    }

    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);

    try {
      await firebaseService.logout();
      setAuthError(null);
    } catch (e) {
      setAuthError(e.message);
    }

    setLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        authError,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
