import * as axios from "axios";
import * as firebaseService from "./firebaseService";

axios.defaults.baseURL = "http://localhost:5000";
// "http://kumunaapp-env.eba-p4xm5ys7.us-east-2.elasticbeanstalk.com";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";

axios.interceptors.request.use(async (config) => {
  if (config.url === "/users" && config.method === "post") {
    return config;
  }
  const token = await firebaseService.getUserToken();
  config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

export const createUser = async (user) => {
  try {
    const response = await axios.post("/users", {
      displayName: user.displayName,
      emailAddress: user.email,
      password: user.password,
    });
    return response.data;
  } catch (e) {
    throw new Error(e.response.data.message);
  }
};

export const createKumuna = async (kumuna) => {
  let imagePath = null;
  if (kumuna.image) {
    imagePath = await uploadKumunaImage(kumuna.name, kumuna.image);
  }

  const response = await axios.post("/kumunas", {
    name: kumuna.name,
    imagePath: imagePath,
  });

  if (response.status !== 201) {
    console.error("createKumuna failed", response);
    throw new Error("Failed to create Kumuna");
  }

  return response.data;
};

export const getKumunaExpenses = async (kumunaId, onlySettleld = false) => {
  const params = new URLSearchParams();
  params.append("onlySettled", onlySettleld);
  const response = await axios.get(`/kumunas/${kumunaId}/loans`, { params });

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

export const deleteExpense = async (expense) => {
  const response = await axios.delete(
    `/kumunas/${expense.kumuna.id}/loans/${expense.id}`
  );
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

export const createSettlementOffer = async (kumunaId) => {
  const response = await axios.post(`/settlements`, {
    kumunaId: kumunaId,
  });
  return response.data;
};

export const settle = async (settlementOfferId) => {
  const reponse = await axios.put(`/settlements/${settlementOfferId}`);
  return reponse.data;
};

export const getPreSignedS3UrlForUploadImage = async (kumunaName) => {
  const response = await axios.get("/users/me/pre-signed-url", {
    params: { kumunaName },
  });
  return response.data;
};

export const uploadKumunaImage = async (kumunaName, imageAsBlob) => {
  const presignedS3Url = await getPreSignedS3UrlForUploadImage(kumunaName);
  await fetch(presignedS3Url.url, {
    method: "PUT",
    headers: {
      "Content-Type": "image/jpeg",
    },
    body: imageAsBlob,
  });

  return presignedS3Url.imagePath;
};

export const updateKumuna = async (kumuna, imagePath) => {
  const response = await axios.put(`/kumunas/${kumuna.id}`, {
    name: kumuna.name,
    imagePath: imagePath,
  });

  return response.data;
};
