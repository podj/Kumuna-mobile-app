import * as axios from "axios";
import { uploadImage } from "./firebaseService";

// axios.defaults.baseURL =
//   "http://kumunaapp-env.eba-p4xm5ys7.us-east-2.elasticbeanstalk.com";
axios.defaults.baseURL = "http://192.168.1.151:5000";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

export const createUser = async (user) => {
  const response = await axios.post("/users", {
    displayName: user.displayName,
    emailAddress: user.email,
    password: user.password,
  });

  if (response.status !== 201) {
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
  if (kumuna.image && kumuna.image.uri) {
    const imageUpload = await uploadImage(kumuna.image);
    kumuna.image.uri = await imageUpload.ref.getDownloadURL();
  }

  const response = await axios.post("/kumunas", {
    name: kumuna.name,
    thumbnailUrl: kumuna.image.uri,
  });

  if (response.status !== 201) {
    console.error("createKumuna failed", response);
    throw new Error("Failed to create Kumuna");
  }

  return response.data;
};

export const getKumunaExpenses = async (kumunaId) => {
  const response = await axios.get(`/kumunas/${kumunaId}/loans`);

  if (response.status !== 200) {
    throw new Error(`getKumunaExpenses failed: ${response}`);
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

export const getKumunaMembers = async (kumunaId) => {
  const response = await axios.get(`/kumunas/${kumunaId}/memberships`);

  if (response.status !== 200) {
    console.error(`Error loading response: ${response}`);
    throw new Error(`Failed fetching kumuna members for kumuna ${kumunaId}`);
  }

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axios.get("/users/me");
  if (response.status !== 200) {
    console.error("getCurrentUser failed", response);
    throw new Error("Failed to fetch current user");
  }

  return response.data;
};

export const getBalanceForKumunaId = async (kumunaId) => {
  const response = await axios.get(`/kumunas/${kumunaId}/self-summary`);
  if (response.status !== 200) {
    throw new Error("Failed to fetch self summary");
  }

  return response.data;
};

export const createExpense = async (expense) => {
  const response = await axios.post(`/kumunas/${expense.kumunaId}/loans`, {
    ...expense,
  });
  if (response.status !== 201) {
    console.error(response);
    throw new Error("Failed to create expense");
  }

  return response.data;
};

export const updatePushNotificationToken = async (token) => {
  const response = await axios.post("/users/me/push-notification-token", {
    token,
  });

  if (response.status !== 200) {
    console.error(response);
    throw new Error("Failed to update push notification");
  }

  return response.data;
};

export const addMemberToKumuna = async (kumunaId, emailAddress, role) => {
  try {
    const response = await axios.post(`/kumunas/${kumunaId}/memberships`, {
      emailAddress,
      role,
    });
    return response.data;
  } catch (e) {
    throw new Error(e.response.data.message);
  }
};
