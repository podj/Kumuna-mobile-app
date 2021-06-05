import { Button, Input, Layout, Spinner } from "@ui-kitten/components";

import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import ScreenLayout from "../components/ScreenLayout";
import * as backendService from "../services/backendService";
import * as yup from "yup";
import Toast from "react-native-toast-message";

import * as fileSystemService from "../services/fileSystemService";

export default function ({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [nameErrors, setNameError] = useState(null);
  const [image, setImage] = useState({ blob: null });

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
      image: image.blob,
    });

    setLoading(false);
    Toast.show({
      type: "success",
      text1: "Nice one!",
      text2: "Kumuna created successfully",
    });
    navigation.navigate("KumunaListScreen");
  };

  const pickImage = async () => {
    const imageAsBlob = await fileSystemService.pickJpegImageAsBlob();

    if (imageAsBlob) {
      setImage({ blob: imageAsBlob });
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
          {Boolean(image.blob) ? "Change image" : "Choose image"}
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
