import React, { useEffect, useRef, useState } from "react";

import FloatButton from "../components/FloatButton";
import KumunaExpensesList from "../components/KumunaExpensesList";
import AddExpenseForm from "../components/AddExpenseForm";
import BottomModal from "../components/BottomModal";
import { Layout, Spinner, Text, useTheme } from "@ui-kitten/components";
import * as backendService from "../services/backendService";
import {
  Animated,
  Image,
  ActivityIndicator,
  Platform,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import StickyParallaxHeader from "react-native-sticky-parallax-header";

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
  const [selectedKumunaIndex, setSelectedKumunaIndex] = useState(0);
  const [userBalance, setUserBalance] = useState(0);

  const getKumunasTabs = () => {

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
              shouldComponentUpdate={isLoading}
              onDoneLoading={() => {setLoading(false)}}
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
    setLoading(true);
    setUserBalance(null);
    await loadKumunas();
    await refreshUserBalance();
  };

  useEffect(() => {
    refreshSelectedKumunaData();
  }, [selectedKumunaIndex]);

  const renderHeader = () => {
    const opacity = scroll.interpolate({
      inputRange: [0, 40, 80],
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
      inputRange: [0, 20, 40],
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
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 20) {
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
        header={renderHeader()}
        foreground={renderForeground()}
        headerSize={() => {}}
        tabTextStyle={styles.tabText}
        tabTextContainerStyle={styles.tabTextContainerStyle}
        tabTextContainerActiveStyle={styles.tabTextContainerActiveStyle}
        tabsWrapperStyle={styles.tabsWrapper}
        tabsContainerBackgroundColor={theme["background-basic-color-1"]}
        parallaxHeight={100}
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
      <FloatButton onPress={() => setVisible(true)} style={{ right: 26 }} />
      <BottomModal visible={visible} onDismiss={() => setVisible(false)}>
        <AddExpenseForm />
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
    paddingBottom: 40,
  },
  message: {
    fontSize: 20,
    paddingBottom: 7,
  },
  stickyHeaederTitle: {
    fontSize: 30,
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