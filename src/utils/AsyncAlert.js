import { Alert } from "react-native";

export default function (title, message) {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [{ text: "Got it!", onPress: () => resolve() }],
      { cancelable: false }
    );
  });
}
