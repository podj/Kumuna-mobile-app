import { Button, Input, Layout, Spinner, Text } from "@ui-kitten/components";
import { Formik } from "formik";
import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import * as yup from "yup";
import { AuthContext } from "../contexts/AuthProvider";
import ScreenLayout from "../components/ScreenLayout";

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
    <ScreenLayout title="Login">
      <Formik
        initialValues={formConfig.initialValues}
        validationSchema={formConfig.validationSchema}
        onSubmit={(values) => login(values.email, values.password)}>
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
                style={styles.submitButton}>
                {loading ? <Spinner status="basic" size="tiny" /> : "Sign In"}
              </Button>

              <Button
                appearance="ghost"
                status="basic"
                onPress={() => navigation.navigate("Registration")}>
                or register
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
    paddingTop: 30,
    flex: 1,
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

export default LoginScreen;
