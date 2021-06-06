import * as ImagePicker from "expo-image-picker";
import AsyncAlert from "../utils/AsyncAlert";
import * as ImageManipulator from "expo-image-manipulator";
import Base64 from "../utils/Base64";

const b64toBlob = (b64Data) => {
  const binary_string = Base64.atob(b64Data);
  const len = binary_string.length;
  const bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
};

export const pickImage = async () => {
  const cameraRollPermissions = await ImagePicker.getMediaLibraryPermissionsAsync();
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
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
    quality: 0.3,
    exif: true,
  });

  if (image.cancelled) {
    return null;
  }

  return image;
};

export const pickJpegImageAsBlob = async () => {
  const image = await pickImage();
  if (image === null) {
    return null;
  }

  const processedImage = await ImageManipulator.manipulateAsync(image.uri, [], {
    compress: 0.3,
    format: ImageManipulator.SaveFormat.JPEG,
    base64: true,
  });

  return b64toBlob(processedImage.base64);
};
