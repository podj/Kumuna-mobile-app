import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Layout,
  Modal,
  List,
  Spinner,
  Text,
  ListItem,
} from "@ui-kitten/components";
import { Dimensions } from "react-native";
import * as backendService from "../services/backendService";
import { inject, observer } from "mobx-react";
import Toast from "react-native-toast-message";
import SettlementPotentialTransactions from "./settlement/steps/SettlementPotentialTransactions";

const screenWidth = Math.round(Dimensions.get("window").width);
const screenHeight = Math.round(Dimensions.get("window").height);

const SettlementForm = ({ kumunaId, onDone, visible, kumunaStore }) => {
  const [isLoading, setLoading] = useState(true);
  const [pendingSettlementAction, setPendingSettlementAction] = useState(false);
  const [settlementOffer, setSettlementOffer] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (visible) {
      setLoading(true);
      backendService.createSettlementOffer(kumunaId).then((offer) => {
        kumunaStore.parseExpenses(offer.loans);
        setSettlementOffer(offer);
        setLoading(false);
      });
    }
  }, [visible]);

  const close = () => onDone();

  const back = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      close();
    }
  };

  const settle = async () => {
    setPendingSettlementAction(true);
    try {
      await backendService.settle(settlementOffer.id);
      kumunaStore.refreshExpenses();
    } catch (e) {
      Toast.show({
        text1: "Oops",
        text2: "Something went wrong",
        type: "error",
      });
    } finally {
      setPendingSettlementAction(false);
    }
  };

  const completeStep = async () => {
    if (currentStep === 0) {
      if (settlementOffer?.loans.length === 0) {
        close();
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep === 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await settle();
      close();
    }
  };

  const getInitialContent = () => {
    return (
      <Layout
        style={{ justifyContent: "flex-end", flex: 1, paddingBottom: 20 }}>
        <Text category="h5">
          {settlementOffer?.loans.length > 0
            ? "First, you'll need to review the expenses. After that, you'll know who owes who and how much"
            : "Seems like everything is already settled. You will be sent to the previous screen"}
        </Text>
      </Layout>
    );
  };

  const getUnsettledExpenses = () => {
    return (
      <>
        <Text category="h4" style={{ width: "100%" }}>
          Unsettled Expenses
        </Text>
        <List
          stickyHeaderIndices={[0]}
          ListHeaderComponent={() => (
            <Layout
              style={{ borderBottomColor: "#fafafa", borderBottomWidth: 1 }}>
              <ListItem
                title={"Expense"}
                accessoryRight={() => <Text>Total amount</Text>}
              />
            </Layout>
          )}
          showsVerticalScrollIndicator={true}
          data={settlementOffer.loans}
          style={styles.list}
          renderItem={({ item }) => (
            <ListItem
              title={item.name}
              accessoryRight={() => (
                <Text>{item.totalAmount.toLocaleString("en")}₪</Text>
              )}
            />
          )}
          ListEmptyComponent={() => (
            <Text styles={styles.emptyListText} category="h6">
              All expenses are settled
            </Text>
          )}></List>
      </>
    );
  };

  const getCtaText = () => {
    const stepToCtaText = {
      0: "Got It!",
      1: "Continue",
      2: "Settle Now",
    };

    return stepToCtaText[currentStep];
  };

  const getContent = () => {
    if (currentStep === 0) {
      return getInitialContent();
    } else if (currentStep === 1) {
      return getUnsettledExpenses();
    } else if (currentStep === 2) {
      return (
        <SettlementPotentialTransactions
          transactions={settlementOffer.transactions}
        />
      );
    }
  };

  let content = <Spinner size="giant" status="basic" />;
  if (!isLoading) {
    content = getContent();
  }

  return (
    <Modal
      visible={visible}
      backdropStyle={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onBackdropPress={close}>
      <Layout style={styles.container}>
        <View style={styles.content}>{content}</View>
        <Button
          status="control"
          style={styles.button}
          onPress={completeStep}
          size="giant"
          disabled={pendingSettlementAction}>
          {pendingSettlementAction ? <Spinner /> : getCtaText()}
        </Button>
        <Button
          status="control"
          appearance="ghost"
          onPress={back}
          disabled={pendingSettlementAction}
          style={styles.button}>
          {currentStep === 0 ? "cancel" : "back"}
        </Button>
      </Layout>
    </Modal>
  );
};

export default inject("kumunaStore")(observer(SettlementForm));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: screenHeight * 0.8,
    width: screenWidth * 0.9,
    padding: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    backgroundColor: "transparent",
    width: "100%",
    flex: 1,
  },
  button: {
    marginTop: 10,
  },
  emptyListText: {
    textAlign: "center",
  },
});
