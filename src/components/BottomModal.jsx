import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Modal,
  Dimensions,
  PanResponder,
  Animated,
  TouchableOpacity,
  View,
  Pressable,
  Easing,
} from "react-native";

export default function (props) {
  const { visible, children, onDismiss } = props;
  const [panY, setPanY] = useState(
    new Animated.Value(Dimensions.get("screen").height)
  );

  const top = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const resetPosition = Animated.timing(panY, {
    toValue: 0,
    duration: 200,
    useNativeDriver: false,
  });

  const closeAnim = Animated.timing(panY, {
    toValue: Dimensions.get("screen").height,
    duration: 300,
    useNativeDriver: false,
    easing: Easing.inOut(Easing.linear),
  });

  const panResponders = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => false,
    onPanResponderMove: Animated.event([null, { dy: panY }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (e, gs) => {
      if (gs.dy > 0 && gs.vy > 0.5) {
        return dismiss();
      }
      return resetPosition.start();
    },
  });

  const dismiss = () => {
    return closeAnim.start(onDismiss);
  };

  useEffect(() => {
    if (visible) {
      resetPosition.start();
    }
  }, [visible]);

  return (
    <Modal
      animationType="fade"
      visible={visible}
      transparent
      onRequestClose={dismiss}
    >
      <Pressable style={styles.overlay} onPress={dismiss}>
        <Animated.View
          style={[styles.container, { top }]}
          {...panResponders.panHandlers}
        >
          {children}
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.3)",
    flex: 1,
    justifyContent: "flex-end",
  },
  container: {
    height: "80%",
    backgroundColor: "#23395d",
    paddingTop: 12,
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
    padding: 20,
  },
});
