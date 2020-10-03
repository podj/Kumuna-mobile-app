import { Button, IndexPath, Input, Layout, Text } from "@ui-kitten/components";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import AsyncAlert from "../utils/AsyncAlert";

export default function ({ navigation }) {
  const [name, setName] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(new IndexPath(0));

  const pickImage = async () => {
    const cameraRollPermissions = await ImagePicker.getCameraRollPermissionsAsync();
    if (cameraRollPermissions.accessPrivileges === "none") {
      if (!cameraRollPermissions.canAskAgain) {
        Alert.alert(
          "Permissions needed",
          "You need to grant us permissions to your camera roll through the settings in your device"
        );
        return;
      }
      await AsyncAlert(
        "Camera roll permission",
        "We are about to ask for permissions to your camera roll so you can choose a picture for your Kumuna's proifle"
      );
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
      if (status === "denied") {
        Alert.alert(
          "No worry",
          "Your Kumuna will get the default picture. You can grant us permissions to your camera roll through the settings of you phone"
        );
        return;
      }
    }

    let image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!image.cancelled) {
      setImageUri(image.uri);
    }
  };

  return (
    <ScreenLayout title="Create Kumuna">
      <Layout style={styles.container}>
        <Input label="Name" value={name} onChangeText={setName} />
        <Layout style={styles.chooseImageContainer}>
          <Button
            style={{ alignSelf: "flex-start" }}
            onPress={pickImage}
            status="basic">
            {Boolean(imageUri) ? "Change image" : "Choose image"}
          </Button>
        </Layout>
        <Button style={styles.submitButton}>Create</Button>
        <Button
          style={styles.cancelButton}
          onPress={() => navigation.navigate("KumunaListScreen")}
          appearance="ghost">
          cancel
        </Button>
      </Layout>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  cancelButton: {
    marginTop: 10,
  },
  container: {
    width: "85%",
    height: 280,
    alignItems: "center",
  },
  submitButton: {
    marginTop: 20,
  },
  chooseImageContainer: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    width: "100%",
    justifyContent: "space-evenly",
  },
});
