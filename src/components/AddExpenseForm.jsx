import React, { useEffect, useState } from "react";

import { Keyboard, StyleSheet, View } from "react-native";
import { Button, Input, Spinner, Text } from "@ui-kitten/components";
import Selector from "./Selector";

import * as yup from "yup";

import * as backendService from "../services/backendService";
import AsyncAlert from "../utils/AsyncAlert";
import * as pushNotificationsServce from "../services/pushNotificationService";
import Toast from "react-native-toast-message";
import DatePicker from "./DatePicker";
import { TouchableOpacity } from "react-native-gesture-handler";

const AddExpenseForm = ({ kumuna, onDone }) => {
  const [isLoading, setLoading] = useState(false);
  const [kumunaMembers, setKumunaMembers] = useState([]);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
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
    setLoading(true);
    const expenseRequest = {
      name: expense.name,
      date: expense.date,
      amount: parseInt(expense.amount),
      creditorId: expense.creditor.id,
      debtorsIds: expense.debtors.map((debtor) => debtor.id),
      kumunaId,
    };

    onDone();
    await backendService.createExpense(expenseRequest);
  };

  const loadKumunaMembers = async () => {
    try {
      let kumunaMembers = await backendService.getKumunaMembers(kumuna.id);
      kumunaMembers = kumunaMembers.map((membership) => {
        const member = membership.user;
        member.name = member.displayName;
        return member;
      });
      setKumunaMembers(kumunaMembers);
    } catch (e) {
      Toast.show({
        text1: "Oops",
        text2: "Something went wrong",
        type: "error",
      });
    }
  };

  useEffect(() => {
    loadKumunaMembers();
  }, []);

  const getDebtorsValue = (debtors) => {
    return debtors ? debtors.map((debtor) => debtor.name).join(", ") : "";
  };

  const validateField = (fieldName, newVal) => {
    let isValid = false;
    try {
      validationSchemes[fieldName].validateSync(newVal);
      delete errors[fieldName];
      isValid = true;
    } catch (e) {
      errors[fieldName] = e.errors[0];
    }
    setErrors({ ...errors });

    return isValid;
  };

  const handleChange = (fieldName) => {
    return (newVal) => {
      validateField(fieldName, newVal);
      const newValues = { ...values };
      newValues[fieldName] = newVal;
      setValues(newValues);
    };
  };

  const submitForm = () => {
    let isValid = true;
    for (const [key, value] of Object.entries(values)) {
      if (!validateField(key, value)) {
        isValid = false;
      }
    }
    
    if (
      values.debtors.length === 1 &&
      values.debtors[0].id == values.creditor.id
    ) {
      errors["debtors"] = "you must add another debtor";
      errors["creditor"] = "creditor can't owe himself";
      setErrors({...errors})
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    createExpense(values, kumuna.id)
      .then(() => {
        Toast.show({
          text1: "Wow! That worked 😄",
          text2: "We are refreshing the page for you",
        });
      })
      .catch((e) => {
        console.log(e);
        Toast.show({ text1: "Damn!", text2: "We messed up", type: "error" });
      });
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          {
            alignItems: "cetner",
            justifyContent: "cetner",
            alignContent: "center",
            flex: 1,
          },
        ]}>
        <Spinner size="large" status="basic" />
      </View>
    );
  }

  if (showDateTimePicker) {
    return (
      <DatePicker
        onClose={() => {
          setShowDateTimePicker(false);
        }}
        value={values.date}
        onChange={handleChange("date")}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text category="h6" style={{ textAlign: "center" }}>
        Add expense to {kumuna.name}
      </Text>
      <Input
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
        data={kumunaMembers}
        value={values.creditor}
        toString={(val) => (val ? val.name : "")}
        onValueChange={handleChange("creditor")}
        multiSelect={false}
        style={[styles.input, { zIndex: 2 }]}
        status={errors.creditor ? "danger" : "basic"}
        caption={errors.creditor ? errors.creditor : ""}
      />

      <Selector
        label="Splits between"
        data={kumunaMembers}
        onValueChange={handleChange("debtors")}
        value={values.debtors}
        toString={getDebtorsValue}
        multiSelect={true}
        style={[styles.input, { zIndex: 1 }]}
        status={errors.debtors ? "danger" : "basic"}
        caption={errors.debtors ? errors.debtors : ""}
      />

      <Input
        label="Amount"
        returnKeyType="done"
        keyboardType="number-pad"
        value={values.amount}
        style={styles.input}
        onChangeText={handleChange("amount")}
        status={errors.amount ? "danger" : "basic"}
        caption={errors.amount ? errors.amount : ""}
      />

      <TouchableOpacity
        onPress={() => {
          Keyboard.dismiss();
          setShowDateTimePicker(true);
        }}>
        <View pointerEvents="none">
          <Input
            label="Date"
            value={values.date.toLocaleDateString()}
            onFocus={() => setShowDateTimePicker(true)}
            onBlur={() => setShowDateTimePicker(false)}
            status={errors.date ? "danger" : "basic"}
            caption={errors.date ? errors.date : ""}
            style={styles.input}
            editable={false}
            showSoftInputOnFocus={false}
          />
        </View>
      </TouchableOpacity>

      <Button style={[styles.input, styles.button]} onPress={submitForm}>
        Add expense
      </Button>
    </View>
  );
};

export default AddExpenseForm;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    marginTop: 20,
  },
  input: {
    marginTop: 25,
  },
  button: {
    width: "50%",
    alignSelf: "center",
  },
});
