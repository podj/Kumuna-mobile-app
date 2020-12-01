import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import AuthStackNavigator from "./AuthStackNavigator";
import BottomNavigator from "./BottomNavigator";

import useAuth from "../hooks/useAuth";
import SplashScreen from "../components/SplashScreen";

const AppStack = createStackNavigator();

const AppNavigator = () => {
  const { user, loading } = useAuth();

  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {loading ? (
          <AppStack.Screen name="Splash" component={SplashScreen} />
        ) : user ? (
          <AppStack.Screen name="BottomStack" component={BottomNavigator} />
        ) : (
          <AppStack.Screen name="AuthStack" component={AuthStackNavigator} />
        )}
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
