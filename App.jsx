import React from "react";
import * as eva from "@eva-design/eva";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import AppNavigator from "./src/navigators/AppNavigator";
import { default as mapping } from "./src/mapping.json";
import * as Font from "expo-font";
import { Text } from "react-native-svg";

const App = () => {
  let [fontsLoaded] = Font.useFonts({
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
          customMapping={mapping}>
          <AppNavigator />
        </ApplicationProvider>
      </>
    );
  }
};

export default App;
