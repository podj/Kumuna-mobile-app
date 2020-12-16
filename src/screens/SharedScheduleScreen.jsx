import React, { useState } from "react";

import { Button, Spinner } from "@ui-kitten/components";

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
      <Button onPress={logout} appearance="outline" status="danger" disabled={isLoading} >
        {isLoading ? <Spinner status="basic" size="tiny" /> : "Log out"}
      </Button>
    </ScreenLayout>
  );
}
