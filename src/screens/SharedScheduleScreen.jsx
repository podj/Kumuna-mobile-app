import React, { useContext } from "react";

import { Button } from "@ui-kitten/components";

import { AuthContext } from "../contexts/AuthProvider";

import ScreenLayout from "../components/ScreenLayout";

export default function ({ navigation }) {
  const { logout } = useContext(AuthContext);

  return (
    <ScreenLayout title="Shared Schedule">
      <Button onPress={logout}>LOGOUT</Button>
    </ScreenLayout>
  );
}
