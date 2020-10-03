import React, { useContext } from "react";
import { StyleSheet } from "react-native";

import { Formik } from "formik";
import * as yup from "yup";

import { Layout, Text, Input, Button } from "@ui-kitten/components";

import { AuthContext } from "../contexts/AuthProvider";

import TinyLoadingSpinner from "../components/TinyLoadingSpinner";

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
      name: yup.string().min(4).required(),
      password: yup.string().min(6).required(),
    }),
  };

  return (
    <Layout style={styles.layout}>
      <Formik
        initialValues={formConfig.initialValues}
        validationSchema={formConfig.validationSchema}
        onSubmit={(values) =>
          register(values.email, values.name, values.password)
        }
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
              <Text style={styles.text}>REGISTER</Text>

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
                style={styles.button}
                accessoryLeft={loading ? TinyLoadingSpinner : null}
              >
                Register
              </Button>

              <Button
                appearance="ghost"
                onPress={() => navigation.navigate("Login")}
                style={styles.button}
              >
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

export default RegistrationScreen;
