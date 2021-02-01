import React, { useState } from "react";
import * as Updates from "expo-updates";

import { Button, Spinner, Text } from "@ui-kitten/components";

import ScreenLayout from "../components/ScreenLayout";

import * as firebaseService from "../services/firebaseService";

export default function () {
  const [isLoading, setLoading] = useState(false);
  const logout = async () => {
    setLoading(true);
    await firebaseService.logout();
  };

  return (
    <ScreenLayout title="Shared Schedule">
      <Text>Release version: {Updates.updateId}</Text>
      <Button
        onPress={logout}
        appearance="outline"
        status="danger"
        disabled={isLoading}>
        {isLoading ? <Spinner status="basic" size="tiny" /> : "Log out"}
      </Button>
    </ScreenLayout>
  );
}
