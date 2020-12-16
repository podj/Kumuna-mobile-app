import React, { useContext } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AuthStackNavigator from "./AuthStackNavigator";
import BottomNavigator from "./BottomNavigator";

import { inject, observer } from "mobx-react";

const AppStack = createStackNavigator();

const AppNavigator = ({ authStore }) => {
  const { isLoggedIn } = authStore;

  return (
    <NavigationContainer>
      {isLoggedIn ? <BottomNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

export default inject("authStore")(observer(AppNavigator));
