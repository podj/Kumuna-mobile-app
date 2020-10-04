import React from "react";
import { StyleSheet } from "react-native";

import { Layout, Text } from "@ui-kitten/components";

const ExpenseItem = ({ title, description, price, date, isDebt }) => {
  const lightGreen = "#66FF99";
  const lightRed = "#FF6699";

  return (
    <Layout style={styles.row}>
      <Layout style={styles.date}>
        <Text category="h6">{date.day}</Text>
        <Text category="p1">{date.month}</Text>
      </Layout>
      <Layout style={styles.content}>
        <Text category="h6">{title}</Text>
        <Text category="p1">{description}</Text>
      </Layout>
      <Layout style={styles.price}>
        <Text category="p1" style={{ color: isDebt ? lightRed : lightGreen }}>
          {price}
        </Text>
      </Layout>
    </Layout>
  );
};

export default ExpenseItem;

const styles = StyleSheet.create({
  row: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  date: {
    width: 50,
    alignItems: "center",
    marginRight: 10,
    padding: 8,
    borderRadius: 5,
    backgroundColor: "black",
  },
  content: {
    flex: 1,
  },
  price: {
    width: 50,
    marginLeft: 10,
    alignItems: "flex-end",
  },
});
