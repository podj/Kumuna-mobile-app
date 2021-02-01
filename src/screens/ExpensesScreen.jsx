import React, { useEffect, useState, useRef } from "react";

import { FloatingAction } from "react-native-floating-action";
import KumunaExpensesList from "../components/KumunaExpensesList";
import AddExpenseForm from "../components/AddExpenseForm";
import { Layout, Modal, Spinner, Text, useTheme } from "@ui-kitten/components";
import * as backendService from "../services/backendService";
import { inject, observer } from "mobx-react";
import {
  Animated,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import StickyParallaxHeader from "react-native-sticky-parallax-header";
import Toast from "react-native-toast-message";
import FullScreenLoader from "../components/FullScreenLoader";
import { Modalize } from "react-native-modalize";
import SuccessModal from "../components/SuccessModal";
import SettlementForm from "../components/SettlementForm";

const actions = [
  {
    text: "Settle",
    icon: require("../../assets/settle.png"),
    name: "btn_settle",
    position: 1,
    color: "#4dabf5",
    textBackground: "transparent",
    textColor: "#ffffff",
  },
  {
    text: "Add Expense",
    icon: require("../../assets/plus.png"),
    name: "btn_add_expense",
    position: 2,
    color: "#4dabf5",
    textBackground: "transparent",
    textColor: "#ffffff",
  },
];

const nothingToShowYet = (
  <Layout>
    <Text style={{ textAlign: "center" }} category="h5">
      Nothing to show yet 🐣
    </Text>
    <Text style={{ textAlign: "center" }} category="h6">
      Pull to refresh
    </Text>
  </Layout>
);

const populateKumunaThumbnail = async (kumuna) => {
  if (kumuna.thumbnailUrl) {
    let thumbnailBase64 = await backendService.downloadImage(
      kumuna.thumbnailUrl
    );
    kumuna.thumbnailUrl = `data:image/jpeg;base64,${thumbnailBase64}`;
  }
  return kumuna;
};

const ExpensesScreen = ({ kumunaStore }) => {
  const { setKumunaId, isLoading, userBalance } = kumunaStore;
  const [kumunas, setKumunas] = useState(null);
  const [scroll, setScroll] = useState(new Animated.Value(0));
  const theme = useTheme();
  const [endReached, setEndReached] = useState(false);
  const [topReached, setTopReached] = useState(true);
  const [stickyHeaderEndReached, setStickyHeaderEndReached] = useState(false);
  const [stickyHeaderTopReached, setStickyHeaderTopReached] = useState(true);
  const [showRefreshAnimation, setRefreshAnimation] = useState(false);
  const [isFirstLoading, setFirstLoading] = useState(true);
  const [selectedKumunaIndex, setSelectedKumunaIndex] = useState(0);
  const bottomModal = useRef(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSettlementForm, setShowSettlementForm] = useState(false);

  const getKumunasTabs = () => {
    if (kumunas.length === 0) {
      return [
        {
          title: null,
          content: nothingToShowYet,
        },
      ];
    }

    const kumunasTabs = [];
    for (let i = 0; i < kumunas.length; i++) {
      let kumuna = kumunas[i];
      kumunasTabs.push({
        title: kumuna.name,
        content: (
          <Layout>
            <KumunaExpensesList
              onScroll={onScroll}
              scrollEnabled={
                Platform.OS == "andorind" ? true : shouldBeEnabled()
              }
              nestedScrollEnabled
            />
          </Layout>
        ),
      });
    }
    return kumunasTabs;
  };

  const loadKumunas = async () => {
    try {
      const rawKumunas = await backendService.getKumunas();
      return await Promise.all(rawKumunas.map(populateKumunaThumbnail));
    } catch (e) {
      Toast.show({
        text1: "Oops",
        text2: "Someone will be fired",
        type: "error",
      });
    }
  };

  const refreshSelectedKumunaData = async () => {
    setRefreshAnimation(false);
    if (kumunas === null) {
      return;
    }

    if (kumunas.length > 0) {
      setKumunaId(kumunas[selectedKumunaIndex].id);
    } else {
      loadKumunas().then((kumunas) => {
        if (kumunas.length > 0) {
          setKumunas(kumunas);
          setKumunaId(kumunas[selectedKumunaIndex].id);
        }
      });
    }

    setFirstLoading(false);
  };

  const expenseWasAdded = () => {
    bottomModal.current.close();
    setShowSuccessModal(true);
  };

  useEffect(() => {
    refreshSelectedKumunaData();
  }, [selectedKumunaIndex, kumunas]);

  useEffect(() => {
    loadKumunas().then((kumunas) => {
      setKumunas(kumunas);
      setFirstLoading(false);
    });
  }, []);

  const renderHeader = () => {
    const opacity = scroll.interpolate({
      inputRange: [0, 5, 10],
      outputRange: [0, 0, 1],
      extrapolate: "clamp",
    });

    let userBalanceText = (
      <>
        <Text style={styles.headerTitle}>Your balance:</Text>
        <Spinner size="tiny" status="basic" />
      </>
    );
    if (!isLoading) {
      if (userBalance === null) {
        userBalanceText = <></>;
      } else {
        userBalanceText = (
          <>
            <Text style={styles.headerTitle}>Your balance:</Text>
            <Text
              style={{ fontSize: 20 }}
              status={
                userBalance < 0 ? "danger" : "success"
              }>{`${userBalance.toLocaleString("en")}₪`}</Text>
          </>
        );
      }
    }

    return (
      <View style={styles.headerWrapper}>
        <Animated.View style={{ opacity }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}>
            {userBalanceText}
          </View>
        </Animated.View>
      </View>
    );
  };

  const renderForeground = () => {
    const opacity = scroll.interpolate({
      inputRange: [0, 5, 10],
      outputRange: [1, 1, 0],
      extrapolate: "clamp",
    });

    let kumuna = kumunas[selectedKumunaIndex];
    let userBalanceText = <></>;
    if (isLoading) {
      userBalanceText = <Spinner size="tiny" status="basic" />;
    } else if (!!kumuna && userBalance !== null) {
      userBalanceText = (
        <>
          <Text style={styles.message} appearance="hint">
            Your balance:
          </Text>
          <Text
            appearance="hint"
            style={[styles.message, { marginLeft: 5 }]}
            status={
              userBalance < 0 ? "danger" : "success"
            }>{`${userBalance.toLocaleString("en")}₪`}</Text>
        </>
      );
    }

    return (
      <View style={styles.foreground}>
        <Animated.View style={{ opacity }}>
          <Text style={styles.stickyHeaederTitle}>{kumuna?.name}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              height: 30,
            }}>
            {userBalanceText}
          </View>
        </Animated.View>
      </View>
    );
  };

  const shouldBeEnabled = () => {
    const bottomCondition = endReached && stickyHeaderEndReached;
    const topCondition = topReached && stickyHeaderTopReached;
    return bottomCondition || !topCondition;
  };

  const onScroll = ({ nativeEvent }) => {
    const { contentOffset, layoutMeasurement, contentSize } = nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 5) {
      setEndReached(true);
      setTopReached(false);
    }

    if (contentOffset.y <= 0) {
      setTopReached(true);
      setEndReached(false);
      setStickyHeaderTopReached(true);
      setStickyHeaderEndReached(false);
    }
  };

  if (isFirstLoading) {
    return <FullScreenLoader />;
  }

  return (
    <Layout style={{ flex: 1 }}>
      <StickyParallaxHeader
        refreshControl={
          <RefreshControl
            style={{ zIndex: 1 }}
            refreshing={showRefreshAnimation}
            onRefresh={refreshSelectedKumunaData}
          />
        }
        tabsContainerStyle={{
          justifyContent: "flex-start",
          alignItems: "flex-start",
          alignContent: "flex-start",
          minWidth: "100%",
        }}
        header={renderHeader()}
        foreground={renderForeground()}
        headerSize={() => {}}
        tabTextStyle={styles.tabText}
        tabTextContainerStyle={styles.tabTextContainerStyle}
        tabTextContainerActiveStyle={styles.tabTextContainerActiveStyle}
        tabsWrapperStyle={styles.tabsWrapper}
        tabsContainerBackgroundColor={theme["background-basic-color-1"]}
        parallaxHeight={70}
        headerHeight={80}
        onChangeTab={({ i }) => {
          setSelectedKumunaIndex(i);
        }}
        tabs={getKumunasTabs()}
        scrollEvent={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scroll } } }],
          { useNativeDriver: false }
        )}
      />
      {!isLoading && kumunas !== null && kumunas.length > 0 && (
        <>
          <FloatingAction
            actions={actions}
            onPressItem={(actionName) => {
              if (actionName === "btn_add_expense") {
                bottomModal.current.open();
              } else if (actionName === "btn_settle") {
                setShowSettlementForm(true);
              } else {
                Toast.show({
                  text1: "Oops",
                  text2: "Our bad. This action is not supported yet",
                  type: "error",
                });
              }
            }}
            color="#4dabf5"
            overlayColor="transparent"
            floatingIcon={require("../../assets/more.png")}
          />
          <Modalize
            ref={bottomModal}
            modalTopOffset={200}
            scrollViewProps={{ showsVerticalScrollIndicator: false }}
            modalStyle={{
              backgroundColor: theme["background-basic-color-1"],
              marginHorizontal: 0,
              paddingTop: 10,
              paddingHorizontal: 20,
            }}>
            <AddExpenseForm
              kumuna={kumunas[selectedKumunaIndex]}
              onDone={expenseWasAdded}
            />
          </Modalize>
          {showSuccessModal && (
            <SuccessModal onAnimationDone={() => setShowSuccessModal(false)} />
          )}

          <SettlementForm
            kumunaId={kumunas[selectedKumunaIndex].id}
            visible={showSettlementForm}
            onDone={() => setShowSettlementForm(false)}
          />
        </>
      )}
    </Layout>
  );
};

export default inject("kumunaStore")(observer(ExpensesScreen));

const styles = StyleSheet.create({
  foreground: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    justifyContent: "flex-start",
  },
  message: {
    fontSize: 20,
    paddingBottom: 7,
  },
  stickyHeaederTitle: {
    fontSize: 30,
    color: "#fafafa",
  },
  headerWrapper: {
    width: "100%",
    paddingHorizontal: 10,
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 20,
    margin: 12,
  },
  tabsWrapper: {
    paddingVertical: 12,
  },
  tabTextContainerStyle: {
    paddingHorizontal: 10,
    borderRadius: 18,
  },
  tabTextContainerActiveStyle: {
    backgroundColor: "#4dabf5",
  },
  tabText: {
    fontSize: 16,
    lineHeight: 20,
    paddingHorizontal: 5,
    paddingVertical: 8,
    color: "white",
  },
});
