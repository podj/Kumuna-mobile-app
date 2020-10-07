import React from "react";
import { Alert, ImageBackground, StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { List, ListItem, Text } from "@ui-kitten/components";

import FloatButton from "../components/FloatButton";
import ScreenLayout from "../components/ScreenLayout";
import * as backendService from "../services/backendService";

const renderKumuna = ({ item }) => (
  <ListItem
    style={styles.card}
    onPress={() => Alert.alert("You clicked on a card", item.name)}
  >
    <ImageBackground
      source={item.picture || require("../../assets/default_kumuna_pic.jpg")}
      style={styles.kumunaBackground}
    >
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.7)"]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "100%",
          width: "100%",
        }}
      />
      <Text
        style={{ position: "absolute", bottom: 10, left: 10, fontSize: 24 }}
      >
        {item.name}
      </Text>
    </ImageBackground>
  </ListItem>
);

export default function ({ navigation }) {
  const [kumunas, setKumunas] = useState([]);

  useEffect(() => {
    backendService.getKumunas().then((data) => setKumunas(data));
  }, []);

  let content = null;
  if (!kumunas || !kumunas.length) {
    content = (
      <Text style={{ textAlign: "center" }} category="h5">
        Nothing to show yet 🐣
      </Text>
    );
  } else {
    content = (
      <List
        showsVerticalScrollIndicator={false}
        data={kumunas}
        renderItem={renderKumuna}
        style={styles.kumunas}
      />
    );
  }

  return (
    <ScreenLayout title="Kumunas">
      {content}
      <FloatButton onPress={() => navigation.navigate("AddKumunaScreen")} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 200,
    marginTop: 10,
    padding: 0,
    position: "relative",
  },
  kumunas: {
    backgroundColor: "transparent",
    marginTop: 10,
  },
  kumunaBackground: {
    resizeMode: "cover",
    justifyContent: "center",
    height: "100%",
    width: "100%",
    margin: 0,
    padding: 0,
  },
});
