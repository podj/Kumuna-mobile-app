import React from "react";
import { StyleSheet } from "react-native";

import { Button, Icon } from "@ui-kitten/components";

const FloatButton = ({ onPress, icon }) => {
  return (
    <Button
      onPress={onPress}
      style={styles.floatButton}
      accessoryLeft={
        icon ? icon : (props) => <Icon {...props} name="plus-outline" />
      }
      // status="danger"
    ></Button>
  );
};

export default FloatButton;

const styles = StyleSheet.create({
  floatButton: {
    position: "absolute",
    borderRadius: 50,
    bottom: 10,
    right: 6,
    padding: 0,
    fontSize: 50,
    height: 50,
    width: 50,
    backgroundColor: "#4dabf5",
  },
});
