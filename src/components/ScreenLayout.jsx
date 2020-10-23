import React from "react";
import { StyleSheet } from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import BottomModal from "./BottomModal";

export default function (props) {

  let bottomModal = <></>;

  if (props.bottomModal) {
    bottomModal = <BottomModal {...props.bottomModal}></BottomModal>;
  }

  return (
    <Layout style={styles.screenContainer}>
      <Text category="h1" style={{ textAlign: "center" }}>
        {props.title}
      </Text>
      <Layout style={styles.contentContainer}>{props.children}</Layout>
      {bottomModal}
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
    justifyContent: "center",
    alignItems: "center",
  },
});
