import React, { useState } from "react";

import ScreenLayout from "../components/ScreenLayout";
import FloatButton from "../components/FloatButton";
import KumunaExpensesList from "../components/KumunaExpensesList";
import AddExpenseForm from "../components/AddExpenseForm";
import BottomModal from "../components/BottomModal";

const ExpensesScreen = () => {
  const [visible, setVisible] = useState(true);

  return (
    <ScreenLayout title="Expenses">
      <KumunaExpensesList kumunaId={1} />
      <FloatButton onPress={() => setVisible(true)} />
      
      <BottomModal visible={visible} onDismiss={() => setVisible(false)}>
        <AddExpenseForm />
      </BottomModal>
    </ScreenLayout>
  );
};

export default ExpensesScreen;
