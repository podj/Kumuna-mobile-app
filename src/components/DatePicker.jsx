import React from "react";
import { TouchableOpacity, Platform, StyleSheet, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Text } from "@ui-kitten/components";

export default class DatePicker extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { onClose, onChange } = this.props;
    return (
      <View onPress={onClose} style={styles.container}>
        {Platform.OS === "ios" && (
          <View>
            <TouchableOpacity onPress={onClose}>
              <Text>Done</Text>
            </TouchableOpacity>
          </View>
        )}
        <DateTimePicker
          value={this.props.value}
          mode="date"
          display="default"
          onChange={(e, d) => {
            onChange(d);
            if (Platform.OS !== "ios") {
              onClose();
            }
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contianer: {
    backgroundColor: "#fff",
    position: "absolute",
    justifyContent: "flex-end",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  header: {
    width: "100%",
    padding: 16,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "grey",
  },
});
