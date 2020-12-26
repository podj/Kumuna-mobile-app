import React from "react";
import { Layout, Spinner } from "@ui-kitten/components";

export default function () {
  return (
    <Layout
      style={{
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
      }}>
      <Spinner status="basic" size="large" />
    </Layout>
  );
}
