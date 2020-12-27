import React, { useState } from "react";
import { StyleSheet, Pressable } from "react-native";

import { Layout, Text, useTheme } from "@ui-kitten/components";
import { getShortMonthName } from "../utils/DateUtils";
import AsyncAlert from "../utils/AsyncAlert";
import * as backendService from "../services/backendService";
import Toast from "react-native-toast-message";

export default function ({ expense, userId }) {
  console.log("user id", userId);
  const lightGreen = "#66FF99";
  const lightRed = "#FF6699";
  const theme = useTheme();
  const [pressed, setPressed] = useState(false);

  const isCredit = expense.creditorId === userId;

  expense.createdTime = new Date(expense.createdTime);
  expense.date = new Date(expense.date);

  const getDebtorsNames = () => {
    const debtors = expense.debtors;
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

  const deleteExpense = async () => {
    const confirmed = await AsyncAlert(
      "Deleting expense",
      `Deleting an expense is irreversable and will affect users balance. Are you sure you want to delete ${expense.name}?`,
      true
    );

    if (!confirmed) {
      return;
    }

    try {
      await backendService.deleteExpense(expense);
    } catch (e) {
      Toast.show({
        text1: "Oops something went wrong",
        text2: "Someone is getting fired for sure",
        type: "error",
      });
    }
  };

  const togglePress = () => {
    setPressed(!pressed);
  };

  const getExpensePriceColor = () => {
    if (isCredit) {
      return lightGreen;
    }

    const debtors = expense.debtors;
    console.log(debtors);
    const indexOfCurrentUser = debtors.map((d) => d.id).indexOf(userId);

    return indexOfCurrentUser === -1 ? "#fafafa" : lightRed;
  };

  return (
    <Pressable
      onLongPress={deleteExpense}
      onPressIn={togglePress}
      onPressOut={togglePress}>
      <Layout
        style={[
          styles.row,
          {
            backgroundColor: pressed
              ? theme["background-basic-color-4"]
              : theme["background-basic-color-1"],
          },
        ]}>
        <Layout style={styles.date}>
          <Text category="h6">{expense.date.getDate()}</Text>
          <Text category="p1">{getShortMonthName(expense.date)}.</Text>
        </Layout>
        <Layout style={styles.content}>
          <Text category="h6" ellipsizeMode="tail" numberOfLines={1}>
            {expense.name}
          </Text>
          <Text
            category="p1"
            ellipsizeMode="tail"
            numberOfLines={1}
            appearance="hint">
            {getDebtorsNames()} owe
            {expense.debtors.length === 1 && expense.debtors[0].id !== userId
              ? "s"
              : ""}{" "}
            {isCredit ? "you" : expense.creditor.displayName}
          </Text>
        </Layout>
        <Layout style={styles.price}>
          <Text category="p1" style={{ color: getExpensePriceColor() }}>
            {expense.totalAmount.toLocaleString("en")}₪
          </Text>
        </Layout>
      </Layout>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  date: {
    flex: 1,
    alignItems: "center",
    marginRight: 10,
    padding: 8,
    borderRadius: 5,
    backgroundColor: "transparent",
  },
  content: {
    minWidth: 0,
    flex: 7,
    backgroundColor: "transparent",
  },
  price: {
    flex: 2,
    alignItems: "flex-end",
    backgroundColor: "transparent",
  },
});
