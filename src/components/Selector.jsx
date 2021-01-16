import React, { useState } from "react";
import { Keyboard, Modal, Pressable, StyleSheet, View } from "react-native";

import {
  Select,
  List,
  ListItem,
  useTheme,
  Radio,
  Button,
  Input,
} from "@ui-kitten/components";
import { useRef } from "react";

const Selector = (props) => {
  const { data, label, value, toString, onValueChange, multiSelect } = props;
  const theme = useTheme();
  const inputRef = useRef(null);

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
        title={item.displayName}
        onPress={() => handlePressOut(item)}
        style={[
          styles.listItem,
          {
            backgroundColor: isChecked
              ? theme["background-basic-color-3"]
              : theme["background-basic-color-1"],
          },
        ]}
        accessoryLeft={() => (
          <Radio checked={isChecked} onChange={() => handlePressOut(item)} />
        )}
      />
    ) : (
      <ListItem
        title={item.displayName}
        onPress={() => handlePressOut(item)}
        style={styles.listItem}
      />
    );
  };

  return (
    <>
      <Input
        ref={inputRef}
        style={props.style}
        label={label}
        value={toString(value)}
        onFocus={() => {
          inputRef.current.blur();
          setShowList(!showList);
        }}
        placeholder={
          multiSelect ? "Select at least one option" : "Select one option"
        }
        status={props.status}
        caption={props.caption}
      />
      <Modal animationType="fade" visible={showList} transparent={true}>
        <Pressable
          style={styles.centeredView}
          onPress={() => setShowList(false)}>
          <View style={styles.modalView}>
            <List
              ItemSeparatorComponent={() => (
                <View
                  style={[
                    styles.listItemSeperator,
                    { backgroundColor: theme["background-basic-color-2"] },
                  ]}
                />
              )}
              data={data}
              renderItem={renderListItem}
              style={styles.list}
            />
            {multiSelect ? (
              <Button
                onPress={() => setShowList(false)}
                style={{ marginVertical: 10 }}
                status="basic">
                Done
              </Button>
            ) : (
              <></>
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

export default Selector;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    width: "80%",
    borderRadius: 20,
    padding: 3,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  list: {
    borderRadius: 20,
    width: "100%",
    maxHeight: 200,
  },
  listItem: {},
  listItemSeperator: {
    height: 1,
  },
});
