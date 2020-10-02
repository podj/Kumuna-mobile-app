import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AddKumunaScreen from "../screens/AddKumunaScreen";
import KumunaListScreen from "../screens/KumunaListScreen";

const Stack = createStackNavigator();

export default function () {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="KumunaListScreen" component={KumunaListScreen} />
      <Stack.Screen name="AddKumunaScreen" component={AddKumunaScreen} />
    </Stack.Navigator>
  );
}
