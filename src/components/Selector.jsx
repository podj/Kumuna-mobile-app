import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Select, List, ListItem, useTheme } from "@ui-kitten/components";

const Selector = ({ data, label, value, textValue, onValueChange, multiSelect }) => {
  const theme = useTheme();

  const [showList, setShowList] = useState(false);

  const handlePressOut = (item) => {
    if (!multiSelect) {
      onValueChange(item.name);
      setShowList(false);
    } else {
      console.log('value.some((i) => i.id === item.id)', value.some((i) => i.id === item.id));
      if (value.some((i) => i.id === item.id)) {
        console.log("object");
        onValueChange(value.filter((i) => i.id !== item.id));
      } else {
        console.log('value.concat([item])', value.concat([item]));
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
            ? theme['background-basic-color-3']
            : theme['background-basic-color-1'],
        }}
      />
    ) : (
      <ListItem title={item.name} onPress={() => handlePressOut(item)} />
    );
  };

  return (
    <View>
      <Select
        label={label}
        value={multiSelect ? textValue : value}
        onPressIn={() => setShowList(!showList)}
      />
      <List
        data={data}
        renderItem={renderListItem}
        style={{
          ...styles.list,
          display: showList ? "flex" : "none",
          height: showList ? null : 0,
        }}
      />
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
    zIndex: 100,
  },
});
