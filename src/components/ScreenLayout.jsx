import React from "react";
import { StyleSheet } from "react-native";
import { Layout } from "@ui-kitten/components";

export default function (props) {
  return (
    <Layout style={styles.screenContainer}>
      {title}
      <Layout style={styles.contentContainer}>{props.children}</Layout>
    </Layout>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
  },
});
