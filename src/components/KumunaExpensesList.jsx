import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import { Layout, Text, List, Spinner } from "@ui-kitten/components";
import ExpenseItem from "./ExpenseItem";
import { inject, observer } from "mobx-react";

const listPlaceholder = (
  <Layout>
    <Text style={{ textAlign: "center" }} category="h5">
      Nothing to show yet 🐣
    </Text>
    <Text style={{ textAlign: "center" }} category="h6">
      Pull to refresh
    </Text>
  </Layout>
);

const KumunaExpensesList = (props) => {
  const { authStore, kumunaStore } = props;
  const { user } = authStore;
  const { isLoading, expenses } = kumunaStore;

  if (isLoading) {
    return (
      <Layout
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 20,
        }}>
        <Spinner status="basic" size="giant" />
      </Layout>
    );
  }

  return (
    <List
      {...props}
      ListEmptyComponent={listPlaceholder}
      showsVerticalScrollIndicator={false}
      data={expenses}
      renderItem={(expense) => (
        <ExpenseItem expense={expense.item} userId={user.appUser.id} />
      )}
      onScroll={props.onScroll}
      style={styles.expenses}
    />
  );
};

const styles = StyleSheet.create({
  expenses: {
    backgroundColor: "transparent",
    marginTop: 10,
    width: "100%",
  },
});

export default inject("authStore")(
  inject("kumunaStore")(observer(KumunaExpensesList))
);
