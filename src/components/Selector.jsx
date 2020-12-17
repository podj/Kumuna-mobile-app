import React, { useState } from "react";
import { Keyboard, Platform, StyleSheet, View } from "react-native";

import {
  Select,
  List,
  ListItem,
  useTheme,
  Radio,
  Button,
} from "@ui-kitten/components";

const Selector = (props) => {
  const { data, label, value, toString, onValueChange, multiSelect } = props;
  const theme = useTheme();

  const [showList, setShowList] = useState(false);

  const handlePressOut = (item) => {
    if (!multiSelect) {
      onValueChange(item ? item : null);
      setShowList(false);
    } else {
      if (value.some((i) => i.id === item.id)) {
        onValueChange(value.filter((i) => i.id !== item.id));
      } else {
        onValueChange(value.concat([item]));
      }
    }
  };

  const renderListItem = ({ item }) => {
    const isChecked = multiSelect && value.some((i) => i.id === item.id);
    return multiSelect ? (
      <ListItem
        title={item.name}
        onPress={() => handlePressOut(item)}
        style={{
          backgroundColor: isChecked
            ? theme["background-basic-color-3"]
            : theme["background-basic-color-1"],
        }}
        accessoryLeft={() => (
          <Radio checked={isChecked} onChange={() => handlePressOut(item)} />
        )}
      />
    ) : (
      <ListItem title={item.name} onPress={() => handlePressOut(item)} />
    );
  };

  return (
    <View style={[props.style]}>
      <Select
        label={label}
        value={toString(value)}
        onBlur={() => {
          setShowList(false);
        }}
        onPressIn={() => {
          setShowList(!showList);
          Keyboard.dismiss();
        }}
        placeholder={
          multiSelect ? "Select at least one option" : "Select one option"
        }
        status={props.status}
        caption={props.caption}
      />
      <View
        style={{
          ...styles.list,
          display: showList ? "flex" : "none",
          height: showList ? null : 0,
        }}>
        <List data={data} renderItem={renderListItem} bounces={false} />
      </View>
    </View>
  );
};

export default Selector;

const styles = StyleSheet.create({
  list: {
    position: Platform.OS == "ios" ? "absolute" : "relative",
    top: Platform.OS == "ios" ? 60 : 0,
    right: 0,
    width: "100%",
    maxHeight: 120,
  },
});
