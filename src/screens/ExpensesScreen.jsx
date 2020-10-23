import React, { useState } from "react";

import ScreenLayout from "../components/ScreenLayout";
import FloatButton from "../components/FloatButton";
import KumunaExpensesList from "../components/KumunaExpensesList";
import { Text } from "@ui-kitten/components";

const child = <Text>Hi!</Text>;

const ExpensesScreen = () => {
  const [visible, setVisible] = useState(false);

  return (
    <ScreenLayout
      title="Expenses"
      bottomModal={{
        visible,
        onDismiss: () => {
          setVisible(false); 
        },
        child,
      }}>
      <KumunaExpensesList kumunaId={1} />
      <FloatButton onPress={() => setVisible(true)} />
    </ScreenLayout>
  );
};

export default ExpensesScreen;
