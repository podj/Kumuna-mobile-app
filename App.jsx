import React from "react";
import { Text } from "react-native";

import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";
import AppNavigator from "./src/navigators/AppNavigator";
import { default as mapping } from "./src/mapping.json";
import * as Font from "expo-font";

const App = () => {
  let [fontsLoaded] = Font.useFonts({
    "Lato-Light": require("./assets/Lato-Light.ttf"),
  });

  if (!fontsLoaded) {
    // TODO Create real loading page
    return <Text>Loading...</Text>;
  } else {
    return (
      <ApplicationProvider
        {...eva}
        theme={{ ...eva.dark }}
        customMapping={mapping}
      >
        <AppNavigator />
      </ApplicationProvider>
    );
  }
};

export default App;
