import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Formik, ErrorMessage } from "formik";
import * as yup from "yup";

import { Layout, Text, Input, Button } from "@ui-kitten/components";

const formConfig = {
  initialValues: {
    email: "",
    name: "",
    password: "",
  },
  validationSchema: yup.object().shape({
    email: yup.string().email().required(),
    name: yup.string().min(4).required(),
    password: yup.string().min(8).required(),
  }),
};

const RegistrationScreen = ({ navigation }) => {
  return (
    <Layout style={styles.layout}>
      <Formik
        initialValues={formConfig.initialValues}
        validationSchema={formConfig.validationSchema}
        onSubmit={(values) => console.log("values", values)}>
        {({
          values,
          errors,
          isValid,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => {
          return (
            <Layout style={styles.form}>
              <Text style={styles.text}>Let's get started</Text>

              <Input
                label="Email Address"
                value={values.email}
                onChangeText={handleChange("email")}
                onBlur={handleBlur("email")}
                status={values.email && errors.email ? "danger" : "basic"}
                caption={values.email && errors.email ? errors.email : ""}
                style={styles.input}
              />

              <Input
                label="Name"
                value={values.name}
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                status={values.name && errors.name ? "danger" : "basic"}
                caption={values.name && errors.name ? errors.name : ""}
                style={styles.input}
              />

              <Input
                label="Password"
                value={values.password}
                onChangeText={handleChange("password")}
                onBlur={handleBlur("password")}
                secureTextEntry={true}
                status={values.password && errors.password ? "danger" : "basic"}
                caption={
                  values.password && errors.password ? errors.password : ""
                }
                style={styles.input}
              />

              <Button
                onPress={handleSubmit}
                disabled={!isValid}
                style={styles.button}>
                Sign up
              </Button>

              <Button
                appearance="ghost"
                onPress={() => navigation.navigate("Login")}
                style={styles.button}>
                ALREADY HAVE AN ACCOUNT? LOGIN
              </Button>
            </Layout>
          );
        }}
      </Formik>
    </Layout>
  );
};

const styles = StyleSheet.create({
  layout: {
    height: "100%",
    paddingHorizontal: 50,
    paddingVertical: 100,
  },
  form: {
    width: "100%",
  },
  text: {
    fontSize: 32,
    textAlign: "center",
  },
  input: {
    marginTop: 30,
    width: "100%",
  },
  button: {
    marginTop: 30,
  },
});

export default RegistrationScreen;
