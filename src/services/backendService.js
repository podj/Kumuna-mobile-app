import * as axios from "axios";

axios.defaults.baseURL = "http://10.0.0.16:8080";
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
