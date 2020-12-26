import React from "react";
import { StyleSheet } from "react-native";

import { Layout, Text } from "@ui-kitten/components";
import { getShortMonthName } from "../utils/DateUtils";

export default ({ item }, userId) => {
  const lightGreen = "#66FF99";
  const lightRed = "#FF6699";

  const isDebt = item.creditorId !== userId;

  item.createdTime = new Date(item.createdTime);
  item.date = new Date(item.date);

  const getDebtorsNames = (debtors) => {
    const names = debtors.map((d) => d.displayName);
    const indexOfCurrentUser = debtors.map((d) => d.id).indexOf(userId);
    if (indexOfCurrentUser !== -1) {
      names.splice(indexOfCurrentUser, 1);
      names.push("you");
    }

    const lastDebtorName = names.pop();
    return (
      (names.length > 0 ? names.join(", ") + " and " : "") + lastDebtorName
    );
  };

  return (
    <Layout style={styles.row}>
      <Layout style={styles.date}>
        <Text category="h6">{item.date.getDate()}</Text>
        <Text category="p1">{getShortMonthName(item.date)}.</Text>
      </Layout>
      <Layout style={styles.content}>
        <Text category="h6" ellipsizeMode="tail" numberOfLines={1}>
          {item.name}
        </Text>
        <Text
          category="p1"
          ellipsizeMode="tail"
          numberOfLines={1}
          appearance="hint">
          {getDebtorsNames(item.debtors)} owe
          {!isDebt && item.debtors.length === 1 ? "s" : ""}{" "}
          {isDebt ? item.creditor.displayName : "you"}
        </Text>
      </Layout>
      <Layout style={styles.price}>
        <Text category="p1" style={{ color: isDebt ? lightRed : lightGreen }}>
          {item.totalAmount.toLocaleString("en")}₪
        </Text>
      </Layout>
    </Layout>
  );
};

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
    flex: 1,
    alignItems: "center",
    marginRight: 10,
    padding: 8,
    borderRadius: 5,
  },
  content: {
    minWidth: 0,
    flex: 7,
  },
  price: {
    flex: 2,
    alignItems: "flex-end",
  },
});
