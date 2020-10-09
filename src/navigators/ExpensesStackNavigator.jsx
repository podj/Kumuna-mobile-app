import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ExpensesScreen from "../screens/ExpensesScreen";

const { Navigator, Screen } = createStackNavigator();

const ExpensesStackNavigator = () => {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="ExpensesScreen" component={ExpensesScreen} />
    </Navigator>
  );
};

export default ExpensesStackNavigator;
