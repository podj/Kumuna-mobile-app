import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Input, Layout, Spinner } from "@ui-kitten/components";
import * as yup from "yup";
import * as firebaseService from "../services/firebaseService";
import ScreenLayout from "../components/ScreenLayout";
import Toast from "react-native-toast-message";

export default ({ navigation }) => {
  const [isLoading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({
    email: null,
    password: null,
  });

  const validations = {
    email: yup.string().required().email().typeError("email is required"),
    password: yup.string().required().min(6).typeError("password is required"),
  };

  const validateField = (fieldName, value) => {
    let error = null;
    
    try {
      validations[fieldName].validateSync(value);
    } catch (e) {
      error = e.errors[0];
    }

    return error;
  };

  const handleChange = (fieldName) => {
    return (newVal) => {
      setValues({ ...values, [fieldName]: newVal });
      const error = validateField(fieldName, newVal);
      setErrors({...errors, [fieldName]: error});
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

  const login = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await firebaseService.login(values.email, values.password);
    } catch (e) {
      Toast.show({
        text1: "Something is not right 🙊",
        text2: e.message,
        type: "info",
        position: "bottom",
        visibilityTime: 6000,
      });
      setLoading(false);
    }
  };

  return (
    <ScreenLayout title="Login">
      <Layout style={styles.container}>
        <Layout style={styles.form}>
          <Input
            label="Email Address"
            keyboardType="email-address"
            returnKeyType="done"
            value={values.email}
            onChangeText={handleChange("email")}
            status={errors.email ? "danger" : "basic"}
            caption={errors.email}
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
            onPress={login}
            disabled={isLoading}
            style={styles.submitButton}>
            {isLoading ? <Spinner status="basic" size="tiny" /> : "Sign In"}
          </Button>

          <Button
            appearance="ghost"
            status="basic"
            disabled={isLoading}
            onPress={() => navigation.navigate("Registration")}>
            or register
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
