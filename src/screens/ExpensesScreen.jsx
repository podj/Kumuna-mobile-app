import React, { useEffect, useState } from "react";

import ScreenLayout from "../components/ScreenLayout";
import FloatButton from "../components/FloatButton";
import KumunaExpensesList from "../components/KumunaExpensesList";
import { Layout, Tab, TabBar, TabView, Text } from "@ui-kitten/components";
import { getKumunas } from "../services/backendService";
import { StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";

const child = <Text>Hi!</Text>;
const noExpenses = (
  <Tab title="">
    <Text>Nothing to show yet</Text>
  </Tab>
);


const ExpensesScreen = () => {
  const [visible, setVisible] = useState(false);
  const [kumunas, setKumunas] = useState([]);

  const loadKumunas = async () => {
    try {
      let kumunas = await getKumunas();
      setKumunas(kumunas);
    } catch (e) {
      console.log(`Error: ${e}`);
      Toast.show({
        type: "error",
        text1: "Oops",
        text2: "Something went wrong",
      });
    }
  };

  useEffect(() => {
    loadKumunas();
  }, []);

  return (
    <ScreenLayout
      bottomModal={{
        visible,
        onDismiss: () => {
          setVisible(false);
        },
        child,
      }}>
      <KumunaExpensesList kumunaId={1} />
      <FloatButton onPress={() => setVisible(true)} />
    </ScreenLayout>
  );
};

export default ExpensesScreen;


const styles = StyleSheet.create({
  topBar: {
    color: "#4dabf5",
    paddingBottom: 5,
    paddingTop: 5,
    paddingRight: 10,
    paddingLeft: 10,
    textAlign: "center",
  },
  activeTopBar: {
    color: "#ffffff",
    backgroundColor: "#4dabf5",
    borderRadius: 20,
  },
});