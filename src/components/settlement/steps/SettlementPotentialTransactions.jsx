import React from "react";
import { StyleSheet } from "react-native";
import { Layout, List, ListItem, Text } from "@ui-kitten/components";

const SettlementPotentialTransactions = ({ transactions }) => {
  const getSortedTransactions = () => {
    return transactions.sort((t1, t2) =>
      t1.debtor.displayName.localeCompare(t2.debtor.displayName)
    );
  };

  const renderItem = (item) => {
    const creditor = item.creditor;
    const debtor = item.debtor;
    return (
      <ListItem
        title={() => (
          <Text category="h5">
            {debtor.displayName} owes {creditor.displayName} {item.amount}₪
          </Text>
        )}
      />
    );
  };

  return (
    <Layout style={styles.container}>
      <Text category="h4">Who owes who</Text>
      <List
        style={styles.list}
        data={getSortedTransactions()}
        renderItem={({ item }) => renderItem(item)}
      />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  list: {
    backgroundColor: "transparent",
  },
});

export default SettlementPotentialTransactions;
