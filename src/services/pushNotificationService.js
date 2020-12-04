import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import { Platform } from "react-native";
import { updatePushNotificationToken } from "./backendService";

export const registerForPushNotifications = async () => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;
  if (finalStatus !== "granted") {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    console.log("Failed to get push notifications permission");
    return;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  updatePushNotificationToken(token);

  if (Platform.OS == "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndoridImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
};

export const isRegisteredForPushNotifications = async () => {
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return Boolean(token);
};
