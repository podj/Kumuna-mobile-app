import React from "react";
import { Alert, ImageBackground, StyleSheet } from "react-native";

import { LinearGradient } from "expo-linear-gradient";

import { List, ListItem, Text } from "@ui-kitten/components";

import FloatButton from "../components/FloatButton";
import ScreenLayout from "../components/ScreenLayout";

const data1 = [
  {
    name: "LAN Party",
    picture: {
      uri:
        "https://images.pexels.com/photos/4614987/pexels-photo-4614987.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
  },
  {
    name: "Minecraft Gamers",
    picture: {
      uri:
        "https://images.pexels.com/photos/6069/grass-lawn-green-wooden-6069.jpg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
  },
  {
    name: "Cocaine & Hoes",
    picture: {
      uri:
        "https://images.pexels.com/photos/1089423/pexels-photo-1089423.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
  },
  {
    name: "Allenby 31",
    picture: {
      uri:
        "https://images.pexels.com/photos/1089423/pexels-photo-1089423.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
  },
];

const data = [];

const renderKumuna = ({ item }) => (
  <ListItem
    style={styles.card}
    onPress={() => Alert.alert("Fuck you itamar", item.name)}
  >
    <ImageBackground source={item.picture} style={styles.kumunaBackground}>
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
  let content = null;
  if (!data || !data.length) {
    content = (
      <Text style={{ textAlign: "center" }} category="h5">
        Nothing to show yet 🐣
      </Text>
    );
  } else {
    content = (
      <List
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={renderKumuna}
        style={styles.kumunas}
      />
    );
  }

  return (
    <ScreenLayout title="Kumunas">
      {content}
      <FloatButton
        onPress={() => navigation.navigate("AddKumunaScreen")}
      ></FloatButton>
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
