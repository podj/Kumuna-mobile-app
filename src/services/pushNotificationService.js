import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { Platform } from "react-native";
import AsyncAlert from "../utils/AsyncAlert";
import * as backendService from "./backendService";
import Constants from "expo-constants";

export const registerForPushNotifications = async () => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  if (finalStatus === "undetermined" && Constants.isDevice) {
    await AsyncAlert(
      "Let's keep in touch!",
      "We want to update you about important activities in your Kumunas"
    );
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  backendService.updatePushNotificationToken(token);

  if (Platform.OS == "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
};