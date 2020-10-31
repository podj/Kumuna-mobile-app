import React from "react";
import { StyleSheet } from "react-native";

import { Button, Icon } from "@ui-kitten/components";

const FloatButton = ({ onPress, icon, style }) => {
  return (
    <Button
      onPress={onPress}
      style={[styles.floatButton, style]}
      accessoryLeft={
        icon ? icon : (props) => <Icon {...props} name="plus-outline" />
      }></Button>
  );
};

export default FloatButton;

const styles = StyleSheet.create({
  floatButton: {
    position: "absolute",
    borderRadius: 50,
    borderWidth: 0,
    bottom: 10,
    right: 6,
    padding: 0,
    fontSize: 50,
    height: 60,
    width: 60,
    backgroundColor: "#4dabf5",
  },
});
