import React from "react";
import { Button, Layout, Text } from "@ui-kitten/components";

export default function ({ navigation }) {
  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: "center",
        paddingTop: 80,
      }}>
      <Text category="h1">Hido FS</Text>
      <Button onPress={() => navigation.navigate("KumunaListScreen")}>
        Back
      </Button>
    </Layout>
  );
}
