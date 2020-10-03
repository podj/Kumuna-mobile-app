import React, { useContext } from "react";
import { StyleSheet } from "react-native";

import { Formik } from "formik";
import * as yup from "yup";
import { Layout, Text, Input, Button, Spinner } from "@ui-kitten/components";

import { AuthContext } from "../contexts/AuthProvider";

const LoginScreen = ({ navigation }) => {
  const { login, loading, authError } = useContext(AuthContext);

  const formConfig = {
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().min(6).required(),
    }),
  };

  return (
    <Layout style={styles.layout}>
      <Formik
        initialValues={formConfig.initialValues}
        validationSchema={formConfig.validationSchema}
        onSubmit={(values) => login(values.email, values.password)}
      >
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
              <Text style={styles.text}>LOGIN</Text>

              {authError ? (
                <Text status="danger" style={styles.error}>
                  {authError}
                </Text>
              ) : null}

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
                style={styles.button}
                accessoryLeft={
                  loading ? () => <Spinner status="basic" size="tiny" /> : null
                }
              >
                Sign In
              </Button>

              <Button
                appearance="ghost"
                onPress={() => navigation.navigate("Registration")}
                style={styles.button}
                disabled={loading}
              >
                DON'T HAVE AN ACCOUNT? CREATE ONE
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
  error: {
    marginTop: 30,
  },
  input: {
    marginTop: 30,
    width: "100%",
  },
  button: {
    marginTop: 30,
  },
});

export default LoginScreen;
