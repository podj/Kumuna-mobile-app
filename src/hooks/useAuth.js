import React, { useContext, useEffect } from "react";

import axios from "axios";

import * as firebaseService from "../services/firebaseService";
import * as backendService from "../services/backendService";

import { AuthContext } from "../contexts/AuthProvider";

const useAuth = () => {
  const { user, setUser } = useContext(AuthContext);

  const handleAuthStateChange = (user) => {
    setUser(user);

    if (!user) {
      axios.defaults.headers.common["Authorization"] = undefined;
      return;
    } else {
        firebaseService.getUserToken().then(async (token) => {
          axios.defaults.headers.common["Authorization"] = "Bearer " + token;
          let appUser = await backendService.getCurrentUser();
          user.appUser = appUser;
        });
    }

    setUser(user);

  };

  useEffect(() => {
    const subscriber = firebaseService.onAuthStateChanged(
      handleAuthStateChange
    );
    return subscriber; // unsubscribe on unmount
  }, []);

  return { user };
};

export default useAuth;
