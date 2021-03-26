import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { inject, observer } from "mobx-react";
import {
  Button,
  Datepicker,
  Input,
  Spinner,
  Text,
} from "@ui-kitten/components";
import Selector from "./Selector";
import { registerForPushNotifications } from "../services/pushNotificationService";

import * as yup from "yup";

import Toast from "react-native-toast-message";

const AddExpenseForm = ({ kumuna, onDone, kumunaStore }) => {
  const { addExpense, isLoading, members } = kumunaStore;
  const [values, setValues] = useState({
    creditor: null,
    debtors: [],
    amount: null,
    name: "",
    date: new Date(),
  });
  const [errors, setErrors] = useState({});

  const validationSchemes = {
    creditor: yup.object().required().typeError("you must specify a creditor"),
    debtors: yup.array().min(1).required(),
    amount: yup
      .number()
      .positive()
      .required()
      .typeError("you must specify a number"),
    date: yup.date().required(),
    name: yup.string().required(),
  };

  const createExpense = async (expense, kumunaId) => {
    const expenseRequest = {
      name: expense.name,
      date: expense.date,
      amount: parseInt(expense.amount),
      creditorId: expense.creditor.id,
      debtorsIds: expense.debtors.map((debtor) => debtor.id),
      kumunaId,
    };
    await addExpense(expenseRequest);
  };

  const getDebtorsValue = (debtors) => {
    return debtors
      ? debtors.map((debtor) => debtor.displayName).join(", ")
      : "";
  };

  const validateField = (fieldName, newVal) => {
    let error = null;
    try {
      validationSchemes[fieldName].validateSync(newVal);
    } catch (e) {
      error = e.errors[0];
    }

    return error;
  };

  const handleChange = (fieldName) => {
    return (newVal) => {
      const error = validateField(fieldName, newVal);
      setValues({ ...values, [fieldName]: newVal });
      setErrors({ ...errors, [fieldName]: error });
    };
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};
    for (const [fieldName, value] of Object.entries(values)) {
      const error = validateField(fieldName, value);
      errors[fieldName] = error;
      isValid = isValid && !error;
    }

    setErrors(errors);

    return isValid;
  };

  const submitForm = () => {
    let isValid = validateForm();

    if (
      values.debtors.length === 1 &&
      values.debtors[0].id == values.creditor.id
    ) {
      errors["debtors"] = "you must add another debtor";
      errors["creditor"] = "creditor can't owe himself";
      setErrors({ ...errors });
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    createExpense(values, kumuna.id)
      .then(() => {
        onDone();
        registerForPushNotifications();
      })
      .catch(() => {
        Toast.show({ text1: "Damn!", text2: "We messed up", type: "error" });
      });
  };

  return (
    <View style={styles.container}>
      <Text category="h6" style={{ textAlign: "center" }}>
        Add expense to {kumuna.name}
      </Text>
      <Input
        size="large"
        label="Name"
        returnKeyType="done"
        value={values.name}
        onChangeText={handleChange("name")}
        style={styles.input}
        status={errors.name ? "danger" : "basic"}
        caption={errors.name ? errors.name : ""}
      />

      <Selector
        label="Who paid"
        size="large"
        data={Object.values(members)}
        value={values.creditor}
        toString={(val) => (val ? val.displayName : "")}
        onValueChange={handleChange("creditor")}
        multiSelect={false}
        style={styles.input}
        status={errors.creditor ? "danger" : "basic"}
        caption={errors.creditor ? errors.creditor : ""}
      />

      <Selector
        label="Splits between"
        size="large"
        data={Object.values(members)}
        onValueChange={handleChange("debtors")}
        value={values.debtors}
        toString={getDebtorsValue}
        multiSelect={true}
        style={styles.input}
        status={errors.debtors ? "danger" : "basic"}
        caption={errors.debtors ? errors.debtors : ""}
      />

      <Input
        label="Amount"
        size="large"
        returnKeyType="done"
        keyboardType="number-pad"
        value={values.amount}
        style={styles.input}
        onChangeText={handleChange("amount")}
        status={errors.amount ? "danger" : "basic"}
        caption={errors.amount ? errors.amount : ""}
      />

      <Datepicker
        size="large"
        label="Date of purchase"
        style={styles.input}
        date={values.date}
        status={errors.date ? "danger" : "basic"}
        caption={errors.date || ""}
        onSelect={handleChange("date")}
      />

      <Button
        style={[styles.input, styles.button]}
        onPress={submitForm}
        disabled={isLoading}>
        {isLoading ? <Spinner status="basic" size="tiny" /> : "add expense"}
      </Button>
    </View>
  );
};

export default inject("kumunaStore")(observer(AddExpenseForm));

const styles = StyleSheet.create({
  container: {
    height: "100%",
    marginTop: 20,
    paddingBottom: 20,
  },
  input: {
    marginTop: 25,
  },
  button: {
    width: "50%",
    alignSelf: "center",
  },
});
