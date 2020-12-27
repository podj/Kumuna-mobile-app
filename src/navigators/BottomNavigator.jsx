import React from "react";
import { StyleSheet } from "react-native";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
} from "@ui-kitten/components";

import ExpensesStackNavigator from "./ExpensesStackNavigator";
import KumunasNavigator from "./KumunasNavigator";

import SharedScheduleScreen from "../screens/SharedScheduleScreen";

const KumunasIcon = (props) => <Icon {...props} name="home" />;
const ExpensesIcon = (props) => <Icon {...props} name="credit-card" />;
const SharedScheduleIcon = (props) => <Icon {...props} name="calendar" />;

const { Navigator, Screen } = createBottomTabNavigator();

const BottomTabBar = ({ navigation, state }) => (
  <BottomNavigation
    style={styles.bottomNavigation}
    selectedIndex={state.index}
    onSelect={(index) => navigation.navigate(state.routeNames[index])}>
    <BottomNavigationTab
      style={styles.bottomNavigationTab}
      title="Kumunas"
      icon={KumunasIcon}
    />
    <BottomNavigationTab
      style={styles.bottomNavigationTab}
      title="Expenses"
      icon={ExpensesIcon}
    />
    <BottomNavigationTab
      style={styles.bottomNavigationTab}
      title="Shared Schedule"
      icon={SharedScheduleIcon}
    />
  </BottomNavigation>
);

export default () => (
  <Navigator
    tabBar={(props) => <BottomTabBar {...props} />}
    initialRouteName="Expenses">
    <Screen name="Kumunas" component={KumunasNavigator} />
    <Screen name="Expenses" component={ExpensesStackNavigator} />
    <Screen name="Shared Schedule" component={SharedScheduleScreen} />
  </Navigator>
);

const styles = StyleSheet.create({
  bottomNavigation: {
    paddingBottom: 30,
  },
  bottomNavigationTab: {
    paddingTop: 5,
  },
});
