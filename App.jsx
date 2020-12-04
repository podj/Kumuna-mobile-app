import { I18nManager } from "react-native";

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

import React, { useEffect } from "react";

import {
  ApplicationProvider,
  IconRegistry,
  Layout,
} from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

import * as eva from "@eva-design/eva";
import * as Font from "expo-font";
import { Text } from "react-native-svg";
import Toast from "react-native-toast-message";

import { default as mapping } from "./src/mapping.json";

import { AuthProvider } from "./src/contexts/AuthProvider";
import AppNavigator from "./src/navigators/AppNavigator";
import {
  registerForPushNotifications,
  isRegisteredForPushNotifications,
} from "./src/services/pushNotificationService";
import AsyncAlert from "./src/utils/AsyncAlert";

const App = () => {
  const [fontsLoaded] = Font.useFonts({
    "Lato-Light": require("./assets/Lato-Light.ttf"),
  });

    useEffect(() => {
      AsyncAlert(
        "Let's keep in touch!",
        "We want to update you about important activities in your Kumunas"
      );
      registerForPushNotifications();
      isRegisteredForPushNotifications().then((isRegistered) => {
        if (isRegistered) {
          return;
        }
        AsyncAlert(
          "Let's keep in touch!",
          "We want to update you about important activities in your Kumunas"
        );
        registerForPushNotifications();
      });
    }, []);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  } else {
    return (
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider
          {...eva}
          theme={{ ...eva.dark }}
          customMapping={mapping}>
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </ApplicationProvider>
        <Toast topOffset={50} ref={(ref) => Toast.setRef(ref)} />
      </>
    );
  }
};

export default App;
