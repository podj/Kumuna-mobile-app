import React from "react";

import ScreenLayout from "../components/ScreenLayout";
import FloatButton from "../components/FloatButton";
import KumunaExpensesList from "../components/KumunaExpensesList";

const ExpensesScreen = () => {
  return (
    <ScreenLayout title="Expenses">
      <KumunaExpensesList kumunaId={1} />
      <FloatButton />
    </ScreenLayout>
  );
};

export default ExpensesScreen;
