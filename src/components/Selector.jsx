import React, { useState } from "react";
import { StyleSheet, View } from "react-native";

import { Select, List, ListItem } from "@ui-kitten/components";

const Selector = ({ data, label, value, onValueChange }) => {
  const [showList, setShowList] = useState(false);

  const handlePressOut = (item) => {
    onValueChange(item.name);
    setShowList(false);
  };

  const renderListItem = ({ item }) => {
    return <ListItem title={item.name} onPress={() => handlePressOut(item)} />;
  };

  return (
    <View>
      <Select
        label={label}
        value={value}
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
