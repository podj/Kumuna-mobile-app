import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { Layout, Text, Input, Button } from "@ui-kitten/components";

export default function ({ navigation }) {
  return (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text category="h1">Shared Schedule</Text>
    </Layout>
  );
}
