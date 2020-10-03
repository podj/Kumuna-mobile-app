import React from "react";
import { Text } from "react-native";

import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";

import * as Font from "expo-font";

import { AuthProvider } from "./src/contexts/AuthProvider";
import AppNavigator from "./src/navigators/AppNavigator";
import { default as mapping } from "./src/mapping.json";

const App = () => {
  const [fontsLoaded] = Font.useFonts({
    "Lato-Light": require("./assets/Lato-Light.ttf"),
  });

  if (!fontsLoaded) {
    // TODO: set spinner
    return <Text>Loading...</Text>;
  } else {
    return (
      <ApplicationProvider
        {...eva}
        theme={{ ...eva.dark }}
        customMapping={mapping}
      >
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </ApplicationProvider>
    );
  }
};

export default App;
