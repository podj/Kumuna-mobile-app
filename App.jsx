import { I18nManager } from "react-native";

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

import React, { useEffect } from "react";

import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import axios from "axios";

import * as eva from "@eva-design/eva";
import * as Font from "expo-font";
import { Text } from "react-native-svg";
import Toast from "react-native-toast-message";

import { default as mapping } from "./src/mapping.json";

import AppNavigator from "./src/navigators/AppNavigator";
import * as firebaseService from "./src/services/firebaseService";
import * as backendService from "./src/services/backendService";
import { Provider } from "mobx-react";
import authStore from "./src/stores/AuthStore";

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

const App = () => {
  const [fontsLoaded] = Font.useFonts({
    "Lato-Light": require("./assets/Lato-Light.ttf"),
  });

  const handleAuthStateChange = (user) => {
    if (!user) {
      axios.defaults.headers.common["Authorization"] = undefined;
      authStore.setUser(null);

      return;
    }

    firebaseService.getUserToken().then(async (token) => {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      let appUser = await backendService.getCurrentUser();
      user.appUser = appUser;
      authStore.setUser(user);
    });
  };

  useEffect(
    () => firebaseService.onAuthStateChanged(handleAuthStateChange),
    []
  );

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
          <Provider authStore={authStore}>
            <AppNavigator />
          </Provider>
        </ApplicationProvider>
        <Toast topOffset={50} ref={(ref) => Toast.setRef(ref)} />
      </>
    );
  }
};

export default App;
