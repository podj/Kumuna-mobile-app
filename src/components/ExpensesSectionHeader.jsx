import React from "react";
import { StyleSheet } from "react-native";

import { Layout, Text } from "@ui-kitten/components";

const ExpensesSectionHeader = () => {
  const lightGreen = "#66FF99";
  const lightRed = "#FF6699";

  return (
    <Layout style={styles.row}>
      <Text style={styles.date}>September, 2020</Text>
      <Text style={styles.balance}>100$</Text>
    </Layout>
  );
};

export default ExpensesSectionHeader;

const styles = StyleSheet.create({
  row: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#254EDB",
    color: "grey",
    padding: 4,
    borderRadius: 5,
  },
  date: {},
  balance: {},
});
