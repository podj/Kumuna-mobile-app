import React, { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";

export default function ({ onAnimationDone }) {
  const [visible, setVisible] = useState(true);

  const onAnimationFinished = () => {
    setVisible(false);
    onAnimationDone();
  };

  return (
    <Modal transparent={true} visible={visible} animationType="none">
      <View style={styles.center}>
        <LottieView
          autoPlay={true}
          onAnimationFinish={onAnimationFinished}
          loop={false}
          style={styles.animation}
          source={require("../../assets/animations/success.json")}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  center: {
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  animation: {
    width: 300,
    height: 300,
  },
});
