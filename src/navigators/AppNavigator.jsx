import React from "react";

import { NavigationContainer } from "@react-navigation/native";

import AuthStackNavigator from "./AuthStackNavigator";
import BottomNavigator from "./BottomNavigator";

import { inject, observer } from "mobx-react";
import SplashScreen from "../components/SplashScreen";

const AppNavigator = ({ authStore }) => {
  const { isLoggedIn, isLoading } = authStore;

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <BottomNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

export default inject("authStore")(observer(AppNavigator));
