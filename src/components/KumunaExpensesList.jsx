import React, { useEffect, useState, useContext } from "react";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { getKumunaExpenses } from "../services/backendService";
import { Layout, Text, List } from "@ui-kitten/components";
import ExpenseItem from "./ExpenseItem";
import * as backendService from "../services/backendService";
import { AuthContext } from "../contexts/AuthProvider";


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

export default function ({ kumunaId }) {
  const { user } = useContext(AuthContext);
  const [kumunaMembers, setKumunaMembers] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const addMembers = (item) => {
    const expense = item.item;
    expense.debtors = [];
    for (var i = 0; i < expense.debtorsIds.length; i++) {
      expense.debtors.push(kumunaMembers[expense.debtorsIds[i]]);
    }

    expense.creditor = kumunaMembers[expense.creditorId];

    return item;
  };

  const loadExpenses = () => {
    setLoading(true);
    getKumunaExpenses(kumunaId)
      .then(setExpenses)
      .catch((e) => {
        console.error(e);
        Toast.show({
          type: "error",
          text1: "Oops",
          text2: "Something went wrong",
        });
      })
      .finally(() => setLoading(false));
  };

  const loadKumuna = async () => {
    const kumunaMembers = await backendService.getKumunaMembers(kumunaId);
    const memberIdToMember = kumunaMembers.reduce(
      (members, member) => ((members[member.id] = member), members),
      {}
    );
    setKumunaMembers(memberIdToMember);
  };

  useEffect(() => {
    loadKumuna()
      .then(() => loadExpenses())
      .catch(console.log);
  }, []);

  return (
    <>
        <List
          ListEmptyComponent={listPlaceholder}
          onRefresh={loadExpenses}
          refreshing={isLoading}
          showsVerticalScrollIndicator={false}
          data={expenses}
          renderItem={(item) => ExpenseItem(addMembers(item), user.appUser.id)}
          style={styles.expenses}
        />
    </>
  );
}

const styles = StyleSheet.create({
  expenses: {
    backgroundColor: "transparent",
    marginTop: 10,
    width: "100%",
  },
});
