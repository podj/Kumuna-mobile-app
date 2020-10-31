import React, { useState } from "react";

import { StyleSheet, View } from "react-native";
import { Input } from "@ui-kitten/components";
import Selector from "./Selector";

import { useFormik } from "formik";

// import AutoComplete from "./AutoComplete";

const values = [
  { id: "Devin", name: "Devin" },
  { id: "Dan", name: "Dan" },
  { id: "Dominic", name: "Dominic" },
  // { id: "Jackson", name: "Jackson" },
  // { id: "James", name: "James" },
  // { id: "Joel", name: "Joel" },
  // { id: "John", name: "John" },
  // { id: "Jillian", name: "Jillian" },
  // { id: "Jimmy", name: "Jimmy" },
  // { id: "Julie", name: "Julie" },
  // { id: "Devin2", name: "Devin2" },
  // { id: "Dan2", name: "Dan2" },
  // { id: "Dominic2", name: "Dominic2" },
  // { id: "Jackson2", name: "Jackson2" },
  // { id: "James2", name: "James2" },
  // { id: "Joel2", name: "Joel2" },
  // { id: "John2", name: "John2" },
  // { id: "Jillian2", name: "Jillian2" },
  // { id: "Jimmy2", name: "Jimmy2" },
  // { id: "Julie2", name: "Julie2" },
];

const items = [
  { label: "itachi", value: "1" },
  { label: "kakashi", value: "2" },
  { label: "madara", value: "3" },
  { label: "menato", value: "4" },
  { label: "naruto", value: "5" },
  { label: "hinata", value: "6" },
  { label: "jiraya", value: "7" },
  { label: "tsunade", value: "8" },
  { label: "naruto", value: "9" },
  { label: "sasuke", value: "10" },
  { label: "hashirama", value: "11" },
  { label: "tobirama", value: "12" },
  { label: "pain", value: "13" },
  { label: "sarada", value: "14" },
  { label: "sakura", value: "15" },
  { label: "asura", value: "16" },
  { label: "indra", value: "17" },
];

const AddExpenseForm = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      creditor: "",
    },
    onSubmit: (values) => console.log("values", values),
  });

  const [debtors, setDebtors] = useState([]);

  const getDebtorsValue = () => {
    return debtors.reduce((acc, curr, index) => {
      console.log('curr', curr);
      return index === 0 ? acc + curr.name : acc + ", " + curr.name
    }, "");
  }

  return (
    <View style={styles.container}>
      <Input
        label="Name"
        value={formik.values.name}
        onChangeText={formik.handleChange("name")}
        onBlur={formik.handleBlur("name")}
        style={styles.input}
      />

      <Selector
        label={"Creditor"}
        data={values}
        value={formik.values.creditor}
        onValueChange={formik.handleChange("creditor")}
        multiSelect={false}
      />

      <Selector
        label={"Debtors"}
        data={values}
        value={debtors}
        textValue={getDebtorsValue()}
        onValueChange={setDebtors}
        multiSelect={true}
      />

      {/* <Text>{getDebtorsValue()}</Text> */}

    </View>
  );
};

export default AddExpenseForm;

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});
