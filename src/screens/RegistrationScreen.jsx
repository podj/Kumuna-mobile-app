import React, { useContext } from "react";
import { StyleSheet } from "react-native";

import { Formik } from "formik";
import * as yup from "yup";

import { Layout, Text, Input, Button, Spinner } from "@ui-kitten/components";

import { AuthContext } from "../contexts/AuthProvider";
import ScreenLayout from "../components/ScreenLayout";

const RegistrationScreen = ({ navigation }) => {
  const { register, loading, authError } = useContext(AuthContext);

  const formConfig = {
    initialValues: {
      email: "",
      name: "",
      password: "",
    },
    validationSchema: yup.object().shape({
      email: yup.string().email().required(),
      name: yup.string().min(2).required(),
      password: yup.string().min(6).required(),
    }),
  };

  return (
    <ScreenLayout title="Let's get started">
      <Formik
        initialValues={formConfig.initialValues}
        validationSchema={formConfig.validationSchema}
        onSubmit={(values) =>
          register(values.email, values.name, values.password)
        }>
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
                style={styles.submitButton}
                accessoryLeft={
                  loading ? () => <Spinner status="basic" size="tiny" /> : null
                }>
                Register
              </Button>

              <Button
                appearance="ghost"
                status="basic"
                disabled={loading}
                onPress={() => navigation.navigate("Login")}>
                or login
              </Button>
            </Layout>
          );
        }}
      </Formik>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  form: {
    flex: 1,
    paddingTop: 30,
    width: "80%",
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
  submitButton: {
    marginTop: 30,
    width: "50%",
    alignSelf: "center",
  },
});

export default RegistrationScreen;
