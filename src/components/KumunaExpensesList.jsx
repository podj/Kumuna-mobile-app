import React, { useEffect, useState, useRef } from "react";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { getKumunaExpenses } from "../services/backendService";
import { Layout, Text, List, Spinner } from "@ui-kitten/components";
import ExpenseItem from "./ExpenseItem";
import * as backendService from "../services/backendService";
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
  const { kumunaId } = props;
  const { user } = props.authStore;
  const [kumunaMembers, setKumunaMembers] = useState(null);
  const [expenses, setExpenses] = useState(null);
  const _scrollView = useRef(null); // I swear to god I don't remember why that line is here. But removing it breaks things although it's not used. So...

  const populateDebtorsAndCreditor = (item) => {
    const expense = item.item;
    expense.debtors = [];
    for (var i = 0; i < expense.debts.length; i++) {
      expense.debtors.push(kumunaMembers[expense.debts[i].debtorId]);
    }

    expense.creditor = kumunaMembers[expense.creditorId];

    return item;
  };

  const loadExpenses = () => {
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
      .finally(() => {
        props.onDoneLoading();
      });
  };

  const loadKumuna = async () => {
    const kumunaMembers = await backendService.getKumunaMembers(kumunaId);
    const memberIdToMember = kumunaMembers.reduce(
      (members, member) => ((members[member.user.id] = member.user), members),
      {}
    );
    setKumunaMembers(memberIdToMember);
  };

  useEffect(() => {
    if (props.shouldComponentUpdate) {
      loadKumuna()
        .then(() => loadExpenses())
        .catch(() =>
          Toast.show({
            text1: "Oops",
            text2: "We messed up, someone will get fired",
            type: "error",
          })
        );
    }
  }, [props.shouldComponentUpdate]);

  if (props.shouldComponentUpdate) {
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
      renderItem={(item) =>
        ExpenseItem(populateDebtorsAndCreditor(item), user.appUser.id)
      }
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
