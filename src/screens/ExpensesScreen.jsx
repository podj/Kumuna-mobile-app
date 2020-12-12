import React, { useEffect, useState } from "react";

import FloatButton from "../components/FloatButton";
import KumunaExpensesList from "../components/KumunaExpensesList";
import AddExpenseForm from "../components/AddExpenseForm";
import BottomModal from "../components/BottomModal";
import { Layout, Spinner, Text, useTheme } from "@ui-kitten/components";
import * as backendService from "../services/backendService";
import {
  Animated,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import StickyParallaxHeader from "react-native-sticky-parallax-header";

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

const ExpensesScreen = () => {
  const [visible, setVisible] = useState(false);
  const [kumunas, setKumunas] = useState([]);
  const [scroll, setScroll] = useState(new Animated.Value(0));
  const theme = useTheme();
  const [endReached, setEndReached] = useState(false);
  const [topReached, setTopReached] = useState(true);
  const [stickyHeaderEndReached, setStickyHeaderEndReached] = useState(false);
  const [stickyHeaderTopReached, setStickyHeaderTopReached] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingData, setLoadingData] = useState(true);
  const [selectedKumunaIndex, setSelectedKumunaIndex] = useState(0);
  const [userBalance, setUserBalance] = useState(0);

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
          <Layout
            style={{
              paddingHorizontal: 20,
            }}>
            <KumunaExpensesList
              onScroll={onScroll}
              scrollEnabled={
                Platform.OS == "andorind" ? true : shouldBeEnabled()
              }
              nestedScrollEnabled
              shouldComponentUpdate={isLoadingData}
              onDoneLoading={() => {}}
              kumunaId={kumuna.id}
            />
          </Layout>
        ),
      });
    }
    return kumunasTabs;
  };

  const loadKumunas = async () => {
    try {
      let rawKumunas = await backendService.getKumunas();
      if (rawKumunas.length === 0) {
        return;
      }
      let kumunas = await Promise.all(rawKumunas.map(populateKumunaThumbnail));
      setKumunas(kumunas);
    } catch (e) {}
  };

  const refreshUserBalance = async () => {
    const kumuna = kumunas[selectedKumunaIndex];
    if (!kumuna) {
      return;
    }
    const balance = await backendService.getBalanceForKumunaId(kumuna.id);
    setUserBalance(balance);
  };

  const refreshSelectedKumunaData = async () => {
    setLoadingData(true);
    setLoading(false);
    setUserBalance(null);
    await loadKumunas();
    await refreshUserBalance();
    setLoadingData(false);
  };

  const expenseWasAdded = () => {
    refreshSelectedKumunaData();
    setVisible(false);
  };

  useEffect(() => {
    refreshSelectedKumunaData();
  }, [selectedKumunaIndex]);

  const renderHeader = () => {
    const opacity = scroll.interpolate({
      inputRange: [0, 5, 10],
      outputRange: [0, 0, 1],
      extrapolate: "clamp",
    });

    let userBalanceText = <Spinner size="tiny" status="basic" />;
    if (userBalance || userBalance === 0) {
      userBalanceText = (
        <Text
          style={{ fontSize: 20 }}
          status={
            userBalance < 0 ? "danger" : "success"
          }>{`${userBalance.toLocaleString("en")}₪`}</Text>
      );
    }

    return (
      <View style={styles.headerWrapper}>
        <Animated.View style={{ opacity }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}>
            <Text style={styles.headerTitle}>Your balance:</Text>
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
    let userBalanceText = <Spinner size="tiny" status="basic" />;
    if (userBalance || userBalance === 0) {
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
    } else if (!isLoadingData && false) {
      userBalanceText = <></>;
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
    }
  };

  return (
    <Layout style={{ flex: 1 }}>
      <StickyParallaxHeader
        refreshControl={
          <RefreshControl
            style={{ zIndex: 1 }}
            refreshing={isLoading}
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
      <FloatButton
        style={{ right: 26 }}
        onPress={() => setVisible(true)}
        disabled={isLoadingData}
      />
      <BottomModal visible={visible} onDismiss={() => setVisible(false)}>
        <AddExpenseForm
          kumuna={kumunas[selectedKumunaIndex]}
          onDone={expenseWasAdded}
        />
      </BottomModal>
    </Layout>
  );
};

export default ExpensesScreen;


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