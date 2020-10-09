import * as axios from "axios";
import { uploadImage } from "./firebaseService";

axios.defaults.baseURL = "http://192.168.1.167:9200";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

export const createUser = async (user) => {
  const response = await axios.post("/users", {
    displayName: user.displayName,
    emailAddress: user.email,
    password: user.password,
  });

  if (response.status !== 201) {
    console.log(response.data);
    throw new Error("Failed to create user");
  }

  return response.data;
};

export const downloadImage = async (url) => {
  const response = await axios.get(url);
  if (response.status !== 200) {
    throw new Error(`Failed to download image: ${response}`);
  }

  return response.data;
};

export const createKumuna = async (kumuna) => {
  if (kumuna.thumbnailUrl) {
    const imageUpload = await uploadImage(kumuna.image);
    kumuna.thumbnailUrl = await imageUpload.ref.getDownloadURL();
  }

  const response = await axios.post("/kumunas", {
    name: kumuna.name,
    thumbnailUrl: kumuna.thumbnailUrl,
  });

  if (response.status !== 201) {
    console.error("createKumuna failed", response);
    throw new Error("Failed to create Kumuna");
  }

  return response.data;
};

export const getKumunas = async () => {
  const response = await axios.get("/kumunas");
  if (response.status !== 200) {
    console.error("getKumunas failed", response);
    throw new Error("Failed to fetch kumunas");
  }

  return response.data;
};
