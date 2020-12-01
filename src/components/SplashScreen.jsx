import React from "react";
import { Layout, Spinner, Text } from "@ui-kitten/components";
import { StyleSheet } from "react-native";

const SplashScreen = () => {
  return (
    <Layout style={styles.container}>
      <Text style={styles.title}>Kumuna</Text>
      <Spinner />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  title: {
    width: "100%",
    textAlign: "center",
    fontSize: 50,
    marginBottom: 10,
  },
});

export default SplashScreen;
