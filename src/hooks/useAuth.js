import React, { useContext, useEffect } from "react";

import axios from "axios";

import * as firebaseService from "../services/firebaseService";
import * as backendService from "../services/backendService";

import { AuthContext } from "../contexts/AuthProvider";

const useAuth = () => {
  const { user, setUser, loading, setLoading } = useContext(AuthContext);

  const handleAuthStateChange = (user) => {
    if (!user) {
      axios.defaults.headers.common["Authorization"] = undefined;
      setUser(user);
      setLoading(false);
      return;
    }

    firebaseService.getUserToken().then(async (token) => {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      let appUser = await backendService.getCurrentUser();
      user.appUser = appUser;
      setUser(user);
      setLoading(false);
    });
  };

  useEffect(() => {
    const subscriber = firebaseService.onAuthStateChanged(
      handleAuthStateChange
    );
    return subscriber; // unsubscribe on unmount
  }, []);

  return { user, loading };
};

export default useAuth;
