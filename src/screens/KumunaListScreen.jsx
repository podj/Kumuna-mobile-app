import { Layout, List, ListItem, Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import ScreenLayout from "../components/ScreenLayout";
import * as backendService from "../services/backendService";
import FloatButton from "../components/FloatButton";
import KumunaCard from "../components/KumunaCard";

const populateKumunaThumbnail = async (kumuna) => {
  if (kumuna.thumbnailUrl) {
    let thumbnailBase64 = await backendService.downloadImage(
      kumuna.thumbnailUrl
    );
    kumuna.thumbnailUrl = `data:image/jpeg;base64,${thumbnailBase64}`;
  }
  return kumuna;
};

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

export default function ({ navigation }) {
  const [kumunas, setKumunas] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const openKumunaDashboard = (kumuna) => {
    navigation.push("KumunaDashboardScreen", { kumuna: kumuna });
  };

  const renderKumuna = ({ item }) => (
    <ListItem style={styles.card} onPress={() => openKumunaDashboard(item)}>
      <KumunaCard kumuna={item} />
    </ListItem>
  );

  const loadKumunas = async () => {
    setLoading(true);
    backendService
      .getKumunas()
      .then(async (data) => {
        let kumunas = await Promise.all(data.map(populateKumunaThumbnail));
        setKumunas(kumunas);
      })
      .catch((e) => {
        Toast.show({
          text1: "Oops",
          text2: "Something went wrong",
          type: "error",
          position: "top",
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadKumunas();
  }, []);

  return (
    <Layout style={{ flex: 1 }}>
      <ScreenLayout title="Kumunas">
        <List
          ListEmptyComponent={listPlaceholder}
          onRefresh={loadKumunas}
          refreshing={isLoading}
          showsVerticalScrollIndicator={false}
          data={kumunas}
          renderItem={renderKumuna}
          style={styles.kumunas}
        />
      </ScreenLayout>
      <FloatButton onPress={() => navigation.navigate("AddKumunaScreen")} />
    </Layout>
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
});
