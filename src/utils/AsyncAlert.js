import { Alert } from "react-native";

export default function (title, message, isAction = false) {
  return new Promise((resolve) => {
    const buttons = [];

    if (isAction) {
      buttons.push({ text: "I'm sure", onPress: () => resolve(true) });
      buttons.push({ text: "Cancel", onPress: () => resolve(false) });
    } else {
      buttons.push({ text: "Got it!", onPress: () => resolve() });
    }

    Alert.alert(
      title,
      message,
      buttons,
      { cancelable: false }
    );
  });
}
