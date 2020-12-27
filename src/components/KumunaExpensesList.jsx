import React, { useEffect, useState, useRef } from "react";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { getKumunaExpenses } from "../services/backendService";
import { Layout, Text, List, Spinner } from "@ui-kitten/components";
import ExpenseItem from "./ExpenseItem";
import * as backendService from "../services/backendService";
import { inject, observer } from "mobx-react";
import { set } from "mobx";

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
  const { kumunaId, authStore, shouldComponentUpdate } = props;
  const { user } = authStore;
  const [expenses, setExpenses] = useState(null);
  const [isLoading, setLoading] = useState(true);

  const loadExpenses = async (kumunaMembers) => {
    try {
      const expenses = await getKumunaExpenses(kumunaId);
      for (let i = 0; i < expenses.length; i++) {
        const expense = expenses[i];
        expense.debtors = [];
        expense.creditor = kumunaMembers[expense.creditorId];
        for (let j = 0; j < expense.debts.length; j++) {
          expense.debtors.push(kumunaMembers[expense.debts[j].debtorId]);
        }
      }

      setExpenses(expenses);
    } catch (e) {
      console.error(e);
      Toast.show({
        type: "error",
        text1: "Oops",
        text2: "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadKumunaMembers = async () => {
    setLoading(true);
    const kumunaMembers = await backendService.getKumunaMembers(kumunaId);
    const memberIdToMember = kumunaMembers.reduce(
      (members, member) => ((members[member.user.id] = member.user), members),
      {}
    );
    
    loadExpenses(memberIdToMember);
  };

  useEffect(() => {
    if (shouldComponentUpdate) {
      loadKumunaMembers().catch(() =>
        Toast.show({
          text1: "Oops",
          text2: "We messed up, someone will get fired",
          type: "error",
        })
      );
    }
  }, [shouldComponentUpdate]);

  useEffect(() => {
    loadKumunaMembers().catch(() =>
      Toast.show({
        text1: "Oops",
        text2: "We messed up, someone will get fired",
        type: "error",
      })
    );
  }, []);

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

export default inject("authStore")(observer(KumunaExpensesList));
