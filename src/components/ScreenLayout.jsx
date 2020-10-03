import React from "react";
import { StyleSheet } from "react-native";
import { Layout, Text } from "@ui-kitten/components";

export default function (props) {
  return (
    <Layout style={styles.screenContainer}>
      <Text category="h1" style={{ textAlign: "center" }}>
        {props.title}
      </Text>
      <Layout style={styles.contentContainer}>{props.children}</Layout>
    </Layout>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 80,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    alignItems: "center",
  },
});
