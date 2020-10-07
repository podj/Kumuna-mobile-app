import { Button, Input, Layout, Spinner } from "@ui-kitten/components";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import AsyncAlert from "../utils/AsyncAlert";
import * as backendService from "../services/backendService";
import * as yup from "yup";

export default function ({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(null);
  const [nameErrors, setNameError] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  const submitKumunaCreationForm = async () => {
    setNameError(null);
    try {
      yup.string().required().min(2).validateSync(name);
    } catch (e) {
      setNameError(e.errors[0]);
      return;
    }

    setLoading(true);
    await backendService.createKumuna({
      name: name,
      imageUrl: imageUri,
    });
    setLoading(false);
    await AsyncAlert("Success", `You have created ${name} Kumuna!`);
    navigation.navigate("KumunaListScreen");
  };

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
    <ScreenLayout title="New Kumuna">
      <Layout style={styles.container}>
        <Input
          label="Name"
          value={name}
          status={nameErrors ? "danger" : "basic"}
          caption={nameErrors}
          onChangeText={setName}
        />
        <Button
          style={{ alignSelf: "flex-start", marginTop: 20 }}
          onPress={pickImage}
          status="basic">
          {Boolean(imageUri) ? "Change image" : "Choose image"}
        </Button>
        <Button style={styles.submitButton} onPress={submitKumunaCreationForm}>
          {loading ? <Spinner status="basic" size="small" /> : "Create Kumuna"}
        </Button>
      </Layout>
      <Button
        style={styles.cancelButton}
        onPress={() => navigation.navigate("KumunaListScreen")}
        appearance="ghost">
        cancel
      </Button>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  cancelButton: {
    marginTop: 0,
  },
  container: {
    width: "85%",
    height: 280,
    alignItems: "center",
  },
  submitButton: {
    marginTop: 20,
    width: "50%",
    height: 50,
  },
});
