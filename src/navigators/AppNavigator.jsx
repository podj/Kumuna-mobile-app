import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AuthStackNavigator from "./AuthStackNavigator";
import BottomNavigator from "./BottomNavigator";

import useAuth from "../hooks/useAuth";

const AppStack = createStackNavigator();

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {user ? (
          <AppStack.Screen name="BottomStack" component={BottomNavigator} />
        ) : (
          <AppStack.Screen name="AuthStack" component={AuthStackNavigator} />
        )}
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
