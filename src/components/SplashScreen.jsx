import React from "react";
import { StyleSheet, View, Image } from "react-native";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require("../../assets/icon.png")} style={styles.logo} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#2a324d",
  },
  logo: {
    height: 256,
    width: 256,
  },
});

export default SplashScreen;
