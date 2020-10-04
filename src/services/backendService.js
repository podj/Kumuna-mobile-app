import * as axios from "axios";

axios.defaults.baseURL = "http://localhost:8080";
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

export const createKumuna = async (kumuna) => {
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
