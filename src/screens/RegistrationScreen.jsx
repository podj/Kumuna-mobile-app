import React, { useState } from "react";
import { StyleSheet } from "react-native";

import * as yup from "yup";

import { Layout, Input, Button, Spinner } from "@ui-kitten/components";
import * as firebaseService from "../services/firebaseService";
import * as backendService from "../services/backendService";

import ScreenLayout from "../components/ScreenLayout";
import Toast from "react-native-toast-message";

const RegistrationScreen = ({ navigation }) => {
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState({
    email: null,
    name: null,
    password: null,
  });
  const [errors, setErrors] = useState({
    email: "",
    name: "",
    password: "",
  });
  const validations = {
    email: yup.string().required().email().typeError("email is required"),
    name: yup.string().required().min(2).typeError("name is required"),
    password: yup.string().required().min(6).typeError("password is required"),
  };

  const validateField = (fieldName, newVal) => {
    let error = null;

    try {
      validations[fieldName].validateSync(newVal);
    } catch (e) {
      error = e.errors[0];
    }

    return error;
  };

  const handleChange = (fieldName) => {
    return (newVal) => {
      setValues({ ...values, [fieldName]: newVal });
      const error = validateField(fieldName, newVal);
      setErrors({ ...errors, [fieldName]: error });
    };
  };

  const validateForm = () => {
    let isValid = true;
    const errors = {};
    for (const [fieldName, value] of Object.entries(values)) {
      const error = validateField(fieldName, value);
      isValid = isValid && !error;
      errors[fieldName] = error;
    }
    setErrors(errors);
    return isValid;
  };

  const register = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await backendService.createUser({
        email: values.email,
        password: values.email,
        displayName: values.name,
      });
      await firebaseService.login(values.email, values.password);
    } catch (e) {
      Toast.show({
        text1: "Oops 🙊",
        text2: e.message || "Something went wrong",
        type: "error",
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <ScreenLayout title="Let's get started">
      <Layout style={styles.container}>
        <Layout style={styles.form}>
          <Input
            label="Email Address"
            value={values.email}
            keyboardType="email-address"
            returnKeyType="done"
            onChangeText={handleChange("email")}
            status={errors.email ? "danger" : "basic"}
            caption={errors.email ? errors.email : ""}
            style={styles.input}
          />

          <Input
            label="Name"
            value={values.name}
            returnKeyType="done"
            onChangeText={handleChange("name")}
            status={errors.name ? "danger" : "basic"}
            caption={errors.name ? errors.name : ""}
            style={styles.input}
          />

          <Input
            label="Password"
            value={values.password}
            returnKeyType="done"
            onChangeText={handleChange("password")}
            secureTextEntry={true}
            status={errors.password ? "danger" : "basic"}
            caption={errors.password ? errors.password : ""}
            style={styles.input}
          />

          <Button
            onPress={register}
            disabled={isLoading}
            style={styles.submitButton}
            accessoryLeft={
              isLoading ? () => <Spinner status="basic" size="tiny" /> : null
            }>
            Register
          </Button>

          <Button
            appearance="ghost"
            status="basic"
            disabled={isLoading}
            onPress={() => navigation.navigate("Login")}>
            or login
          </Button>
        </Layout>
      </Layout>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    height: "100%",
  },
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
