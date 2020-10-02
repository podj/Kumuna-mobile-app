import React from "react";
import { ImageBackground, StyleSheet } from "react-native";
import { Layout, Text, List, Card, Button, Icon } from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";

const data = [
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
        "https://images.pexels.com/photos/4614987/pexels-photo-4614987.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
  },
  {
    name: "Cocaine & Hoes",
    picture: {
      uri:
        "https://images.pexels.com/photos/4614987/pexels-photo-4614987.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    },
  },
];

const addKumunaIcon = (props) => <Icon {...props} name="plus-outline" />;

const renderKumuna = ({ item }) => (
  <Card style={styles.card}>
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
        style={{ position: "absolute", bottom: 10, left: 10, fontSize: 24 }}>
        {item.name}
      </Text>
    </ImageBackground>
  </Card>
);

export default function ({ navigation }) {
  return (
    <Layout style={styles.container}>
      <Text category="h1" style={styles.title}>
        Kumunas
      </Text>
      <List data={data} renderItem={renderKumuna} style={styles.kumunas} />
      <Button
        onPress={() => navigation.navigate("AddKumunaScreen")}
        style={styles.addKumunaButton}
        accessoryLeft={addKumunaIcon}
        status="danger"></Button>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 80,
  },
  title: {
    textAlign: "center",
  },
  card: {
    borderWidth: 0,
    height: 200,
    marginTop: 20,
    padding: 0,
    position: "relative",
  },
  kumunas: {
    backgroundColor: "transparent",
    marginTop: 10,
  },
  addKumunaButton: {
    position: "absolute",
    borderRadius: 50,
    bottom: 15,
    right: 15,
    padding: 0,
    fontSize: 50,
    height: 60,
    width: 60,
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
