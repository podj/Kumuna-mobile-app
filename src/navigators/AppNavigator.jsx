import React, { useMemo } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AuthStackNavigator from "./AuthStackNavigator";
import useAuth from "../hooks/useAuth";
import HomeStackNavigator from "./HomeStack";

const AppStack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          <AppStack.Screen name="HomeStack" component={HomeStackNavigator} />
        ) : (
          <AppStack.Screen name="AuthStack" component={AuthStackNavigator} />
        )}
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
