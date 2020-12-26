import React, { useEffect, useState, useRef } from "react";

import { FloatingAction } from "react-native-floating-action";
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
import Toast from "react-native-toast-message";
import FullScreenLoader from "../components/FullScreenLoader";
import { Modalize } from "react-native-modalize";

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

const ExpensesScreen = () => {
  const [visible, setVisible] = useState(false);
  const [kumunas, setKumunas] = useState([]);
  const [scroll, setScroll] = useState(new Animated.Value(0));
  const theme = useTheme();
  const [endReached, setEndReached] = useState(false);
  const [topReached, setTopReached] = useState(true);
  const [stickyHeaderEndReached, setStickyHeaderEndReached] = useState(false);
  const [stickyHeaderTopReached, setStickyHeaderTopReached] = useState(true);
  const [showRefreshAnimation, setRefreshAnimation] = useState(false);
  const [isFirstLoading, setFirstLoading] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [selectedKumunaIndex, setSelectedKumunaIndex] = useState(0);
  const [userBalance, setUserBalance] = useState(null);
  const bottomModal = useRef(null);

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
              shouldComponentUpdate={isLoading}
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
      const rawKumunas = await backendService.getKumunas();
      return await Promise.all(rawKumunas.map(populateKumunaThumbnail));
    } catch (e) {
      Toast.show({ text1: "Oops", text2: "Someone will be fired" });
    }
  };

  const refreshUserBalance = async (kumunas) => {
    const kumuna = kumunas[selectedKumunaIndex];
    return await backendService.getBalanceForKumunaId(kumuna.id);
  };

  const refreshSelectedKumunaData = async () => {
    setLoading(true);
    setRefreshAnimation(false);
    const kumunas = await loadKumunas();
    const userBalance = await refreshUserBalance(kumunas);
    setKumunas(kumunas);
    setUserBalance(userBalance);
    setFirstLoading(false);
  };

  useEffect(() => {
    if (kumunas.length > 0 && userBalance !== null) {
      setLoading(false);
    }
  }, [kumunas, userBalance]);

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
    let userBalanceText = <></>;
    if (isLoading) {
      userBalanceText = <Spinner size="tiny" status="basic" />;
    } else if (kumuna.title !== null) {
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
      <FloatingAction
        actions={actions}
        onPressItem={() => bottomModal.current.open()}
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
          marginHorizontal: 10,
          paddingHorizontal: 20,
        }}>
        <AddExpenseForm
          kumuna={kumunas[selectedKumunaIndex]}
          onDone={expenseWasAdded}
        />
      </Modalize>
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
