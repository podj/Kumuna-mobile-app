import React from "react";
import { StyleSheet } from "react-native";
import { Layout, Text } from "@ui-kitten/components";
import BottomModal from "./BottomModal";

export default function (props) {

  let bottomModal = <></>;

  if (props.bottomModal) {
    bottomModal = <BottomModal {...props.bottomModal}></BottomModal>;
  }

  let title = <></>;
  if (props.title) {
    title = (
      <Text category="h1" style={{ textAlign: "center" }}>
        {props.title}
      </Text>
    );
  }

  return (
    <Layout style={styles.screenContainer}>
      {title}
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
