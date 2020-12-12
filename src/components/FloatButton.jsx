import React from "react";
import { StyleSheet } from "react-native";

import { Button, Icon } from "@ui-kitten/components";

const FloatButton = ({
  onPress,
  style,
  disabled = false,
  filled = true,
  bottom = true,
  right = true,
  icon = "plus-outline",
}) => {
  let propBasedStyle = {};
  propBasedStyle[bottom ? "bottom" : "top"] = 20;
  propBasedStyle[right ? "right" : "left"] = 26;
  propBasedStyle.backgroundColor = filled ? "#4dabf5" : "transparent";

  return (
    <Button
      disabled={disabled}
      onPress={onPress}
      style={[styles.floatButton, style, propBasedStyle]}
      accessoryLeft={(props) => <Icon name={icon} {...props}  />}></Button>
  );
};

export default FloatButton;

const styles = StyleSheet.create({
  floatButton: {
    position: "absolute",
    borderRadius: 50,
    borderWidth: 0,
    padding: 0,
    fontSize: 50,
    height: 60,
    width: 60,
  },
});
