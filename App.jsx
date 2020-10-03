import React from "react";

import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

import * as eva from "@eva-design/eva";
import * as Font from "expo-font";
import { Text } from "react-native-svg";

import { default as mapping } from "./src/mapping.json";

import { AuthProvider } from "./src/contexts/AuthProvider";
import AppNavigator from "./src/navigators/AppNavigator";

const App = () => {
  const [fontsLoaded] = Font.useFonts({
    "Lato-Light": require("./assets/Lato-Light.ttf"),
  });

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  } else {
    return (
      <>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider
          {...eva}
          theme={{ ...eva.dark }}
          customMapping={mapping}
        >
          <AuthProvider>
            <AppNavigator />
          </AuthProvider>
        </ApplicationProvider>
      </>
    );
  }
};

export default App;
