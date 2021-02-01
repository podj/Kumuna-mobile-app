import React from "react";
import { StyleSheet } from "react-native";
import { Layout, Text, List, Spinner, Button } from "@ui-kitten/components";
import ExpenseItem from "./ExpenseItem";
import { inject, observer } from "mobx-react";


const KumunaExpensesList = (props) => {
  const { kumunaStore } = props;
  const { isLoading, expenses } = kumunaStore;

  const listPlaceholder = (
    <Layout
      style={{
        alignItems: "center",
        flexGrow: 1,
        height: "100%",
      }}>
      <Text category="h5">Nothing to see yet 🐣</Text>
      <Text category="h6">Pull to refresh</Text>
      <Button
        status="basic"
        appearance="ghost"
        size="giant"
        onPress={() => kumunaStore.refreshExpenses(true)}
        style={{ marginTop: 20 }}>
        see settled expenses
      </Button>
    </Layout>
  );

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
      renderItem={(expense) => <ExpenseItem expense={expense.item} />}
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

export default inject("kumunaStore")(observer(KumunaExpensesList));
