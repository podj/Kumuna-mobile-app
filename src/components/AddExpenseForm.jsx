import React, { useEffect, useState } from "react";

import { StyleSheet, View } from "react-native";
import { Button, Input, Text } from "@ui-kitten/components";
import Selector from "./Selector";

import { Formik, useFormik } from "formik";
import * as yup from "yup";

import * as backendService from "../services/backendService";
import Toast from "react-native-toast-message";

const values = [
  { id: "Devin", name: "Devin" },
  { id: "Dan", name: "Dan" },
  { id: "Dominic", name: "Dominic" },
  { id: "Jackson", name: "Jackson" },
  { id: "James", name: "James" },
  { id: "Joel", name: "Joel" },
  { id: "John", name: "John" },
  { id: "Jillian", name: "Jillian" },
  { id: "Jimmy", name: "Jimmy" },
  { id: "Julie", name: "Julie" },
  { id: "Devin2", name: "Devin2" },
  { id: "Dan2", name: "Dan2" },
  { id: "Dominic2", name: "Dominic2" },
  { id: "Jackson2", name: "Jackson2" },
];


const AddExpenseForm = ({ kumuna }) => {
  const [kumunaMembers, setKumunaMembers] = useState([]);


  const formikConfig = {
    initialValues: {
      name: "",
      creditor: null,
      debtors: [],
      amount: null,
    },
    validationSchema: yup.object().shape({
      name: yup.string().required(),
      // creditor: yup.string().min(1).required(),
      debtors: yup.array().min(1).required(),
      amount: yup.number().positive().required().typeError("you must specify a number"),
    }),
    onSubmit: (values) => console.log("values", values),
  };

  const loadKumunaMembers = async () => {
    try {
      const kumunaMembers = await backendService.getKumunaMembers(kumuna.id);
      kumunaMembers.map((member) => {
        member.name = member.displayName;
        return member;
      });
      setKumunaMembers(kumunaMembers);
    } catch (e) {
      Toast.show({"text1": "Oops", "text2": "Something went wrong", "status": "danger",})
    }
    
  };

  useEffect(() => {
    loadKumunaMembers();
  }, []);

  const getDebtorsValue = (debtors) => {
    let finalDebtors = null;
    console.log("debtors before reduce", debtors);
    if (debtors && debtors.length > 0) {
      finalDebtors = debtors.reduce((acc, curr, index) =>
        index === 0 ? acc + curr.name : acc + ", " + curr.name
      );
    }
    finalDebtors = finalDebtors || "";
    console.log("debtors after reduce", debtors);
    return finalDebtors;
  };

  return (
    <View style={styles.container}>
      <Text category="h6" style={{ textAlign: "center" }}>
        Add expense to {kumuna.name}
      </Text>
      <Formik
        validationSchema={formikConfig.validationSchema}
        initialValues={formikConfig.initialValues}
        onSubmit={formikConfig.onSubmit}>
        {({
          isValid,
          errors,
          values,
          handleSubmit,
          handleBlur,
          handleChange,
        }) => (
          <>
            <Input
              label="Name"
              returnKeyType="done"
              value={values.name}
              onChangeText={handleChange("name")}
              onBlur={handleBlur("name")}
              style={styles.input}
              status={!isValid && errors.name ? "danger" : "basic"}
              caption={!isValid && errors.name ? errors.name : ""}
            />

            <Selector
              label="Who paid"
              data={kumunaMembers}
              value={values.creditor}
              toString={(val) => val ? val.name : ""}
              onBlur={handleBlur("creditor")}
              onValueChange={handleChange("creditor")}
              multiSelect={false}
              style={[styles.input, { zIndex: 2 }]}
              status={!isValid && errors.creditor ? "danger" : "basic"}
              caption={!isValid && errors.creditor ? errors.creditor : ""}
            />

            <Selector
              label="Splits between"
              data={kumunaMembers}
              onBlur={handleBlur("debtors")}
              onValueChange={handleChange("debtors")}
              value={values.debtors}
              toString={getDebtorsValue}
              multiSelect={true}
              style={[styles.input, { zIndex: 1 }]}
              status={!isValid && errors.debtors ? "danger" : "basic"}
              caption={!isValid && errors.debtors ? errors.debtors : ""}
            />

            <Input
              label="Amount"
              returnKeyType="done"
              keyboardType="number-pad"
              value={values.amount}
              style={styles.input}
              onChangeText={handleChange("amount")}
              onBlur={handleBlur("amount")}
              status={!isValid && errors.amount ? "danger" : "basic"}
              caption={!isValid && errors.amount ? errors.amount : ""}
            />
            <Button
              style={[styles.input, styles.button]}
              onPress={handleSubmit}>
              Add
            </Button>
          </>
        )}
      </Formik>
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
