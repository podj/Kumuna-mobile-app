import React from "react";
import { StyleSheet, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "@ui-kitten/components";

export default function ({ kumuna }) {
  return (
    <ImageBackground
      source={
        kumuna.thumbnailUrl
          ? {
              uri: kumuna.thumbnailUrl,
            }
          : require("../../assets/default_kumuna_pic.jpg")
      }
      style={styles.kumunaBackground}>
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.7)"]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "100%",
          width: "100%",
        }}
      />
      <Text
        style={{ position: "absolute", bottom: 10, left: 10, fontSize: 24 }}>
        {kumuna.name}
      </Text>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  kumunaBackground: {
    resizeMode: "cover",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    margin: 0,
    padding: 0,
  },
});
