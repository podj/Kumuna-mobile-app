import {
  Button,
  Icon,
  Layout,
  List,
  ListItem,
  Text,
} from "@ui-kitten/components";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  RefreshControl,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import ScreenLayout from "../components/ScreenLayout";
import * as backendService from "../services/backendService";
import FloatButton from "../components/FloatButton";

const populateKumunaThumbnail = async (kumuna) => {
  console.log();
  if (kumuna.thumbnailUrl) {
    let thumbnailBase64 = await backendService.downloadImage(
      kumuna.thumbnailUrl
    );
    kumuna.thumbnailUrl = `data:image/jpeg;base64,${thumbnailBase64}`;
  }
  return kumuna;
};

const addKumunaIcon = (props) => <Icon {...props} name="plus-outline" />;

const listPlaceholder = (
  <Layout>
    <Text style={{ textAlign: "center" }} category="h5">
      Nothing to show yet 🐣
    </Text>
    <Text style={{ textAlign: "center" }} category="h6">
      Pull to refresh
    </Text>
  </Layout>
);

const renderKumuna = ({ item }) => (
  <ListItem
    style={styles.card}
    onPress={() => Alert.alert("You clicked on a card", item.name)}>
    <ImageBackground
      source={
        item.thumbnailUrl
          ? {
              uri: item.thumbnailUrl,
            }
          : require("../../assets/default_kumuna_pic.jpg")
      }
      style={styles.kumunaBackground}>
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
  </ListItem>
);

export default function ({ navigation }) {
  const [kumunas, setKumunas] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const loadKumunas = async () => {
    setLoading(true);
    backendService
      .getKumunas()
      .then(async (data) => {
        let kumunas = await Promise.all(data.map(populateKumunaThumbnail));
        setKumunas(kumunas);
      })
      .catch(() =>
        Toast.show({
          text1: "Oops",
          text2: "Something went wrong",
          type: "error",
          position: "top",
        })
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadKumunas();
  }, []);

  return (
    <ScreenLayout title="Kumunas">
      <List
        tintColor="#ffffff"
        ListEmptyComponent={listPlaceholder}
        refreshControl={
          <RefreshControl onRefresh={loadKumunas} refreshing={isLoading} />
        }
        showsVerticalScrollIndicator={false}
        data={kumunas}
        renderItem={renderKumuna}
        style={styles.kumunas}
      />
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
