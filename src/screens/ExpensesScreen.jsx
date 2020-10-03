import React, { useContext } from "react";

import { Button } from "@ui-kitten/components";

import ScreenLayout from "../components/ScreenLayout";

import { AuthContext } from "../contexts/AuthProvider";

export default function ({ navigation }) {
  const { logout } = useContext(AuthContext);

  return (
    <ScreenLayout title="Expenses">
      <Button onPress={logout}>LOGOUT</Button>
    </ScreenLayout>
  );
}
