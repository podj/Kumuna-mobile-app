import React from "react";
import { StyleSheet } from "react-native";

import { Layout, Text } from "@ui-kitten/components";
import { getShortMonthName } from "../utils/DateUtils";
import AsyncAlert from "../utils/AsyncAlert";
import Toast from "react-native-toast-message";
import { inject, observer } from "mobx-react";
import { TouchableHighlight } from "react-native-gesture-handler";

const ExpenseItem = function ({ expense, userId, kumunaStore }) {
  const lightGreen = "#66FF99";
  const lightRed = "#FF6699";

  const isCredit = expense.creditorId === userId;

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
      `Deleting an expense is irreversable and will affect users' balances. Are you sure you want to delete ${expense.name}?`,
      true
    );

    if (!confirmed) {
      return;
    }

    try {
      await kumunaStore.deleteExpense(expense);
    } catch (e) {
      console.error(e);
      Toast.show({
        text1: "Oops something went wrong",
        text2: "Someone is getting fired for sure",
        type: "error",
      });
    }
  };

  const getExpensePriceColor = () => {
    if (isCredit) {
      return lightGreen;
    }

    const debtors = expense.debtors;
    const indexOfCurrentUser = debtors.map((d) => d.id).indexOf(userId);

    return indexOfCurrentUser === -1 ? "#fafafa" : lightRed;
  };

  return (
    <TouchableHighlight onLongPress={deleteExpense}>
      <Layout style={styles.row}>
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
    </TouchableHighlight>
  );
};

export default inject("kumunaStore")(observer(ExpenseItem));

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
