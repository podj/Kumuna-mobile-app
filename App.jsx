import { I18nManager } from "react-native";

I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

import React, { useEffect } from "react";

import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import axios from "axios";

import * as eva from "@eva-design/eva";
import * as Font from "expo-font";
import Toast from "react-native-toast-message";

import { default as mapping } from "./src/mapping.json";

import AppNavigator from "./src/navigators/AppNavigator";
import * as firebaseService from "./src/services/firebaseService";
import * as backendService from "./src/services/backendService";
import { Provider } from "mobx-react";
import authStore from "./src/stores/AuthStore";
import * as Sentry from "sentry-expo";
import kumunaStore from "./src/stores/KumunaStore";
import SplashScreen from "./src/components/SplashScreen";

Sentry.init({
  dsn:
    "https://1177cefcf1fb4755b95281e49361098f@o493127.ingest.sentry.io/5561611",
  enableInExpoDevelopment: true,
  debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
});

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

  useEffect(() => {
    const unsbscribe = firebaseService.onAuthStateChanged(
      handleAuthStateChange
    );

    return () => {
      unsbscribe();
    };
  }, []);

  if (!fontsLoaded) {
    return <SplashScreen />;
  } else {
    return (
      <>
        <IconRegistry icons={EvaIconsPack} />
        <Provider authStore={authStore} kumunaStore={kumunaStore}>
          <ApplicationProvider
            {...eva}
            theme={{ ...eva.dark }}
            customMapping={mapping}>
            <AppNavigator />
          </ApplicationProvider>
        </Provider>
        <Toast topOffset={50} ref={(ref) => Toast.setRef(ref)} />
      </>
    );
  }
};

export default App;
