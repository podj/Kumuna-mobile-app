import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { Select, List, ListItem, useTheme } from "@ui-kitten/components";

const Selector = (props) => {
  const {
    data,
    label,
    value,
    toString,
    onValueChange,
    multiSelect,
    onBlur,
  } = props;
  const theme = useTheme();

  const [showList, setShowList] = useState(false);

  const handlePressOut = (item) => {
    console.log("value", value);
    console.log("textValue", toString(item));
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
    return multiSelect ? (
      <ListItem
        title={item.name}
        onPress={() => handlePressOut(item)}
        style={{
          backgroundColor: value.some((i) => i.id === item.id)
            ? theme["background-basic-color-3"]
            : theme["background-basic-color-1"],
        }}
      />
    ) : (
      <ListItem title={item.name} onPress={() => handlePressOut(item)} />
    );
  };

  return (
    <View style={[props.style, styles.container]}>
      <Select
        label={label}
        value={toString(value)}
        // onBlur={onBlur}
        onPressIn={() => setShowList(!showList)}
        placeholder={
          multiSelect ? "Select at least one option" : "Select one option"
        }
        style={{ zIndex: 0 }}
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
    position: "absolute",
    top: 60,
    right: 0,
    width: "100%",
    maxHeight: 120,
  },
});
