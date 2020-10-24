import React, { useEffect, useState } from "react";

import ScreenLayout from "../components/ScreenLayout";
import FloatButton from "../components/FloatButton";
import KumunaExpensesList from "../components/KumunaExpensesList";
import { Layout, Text, useTheme } from "@ui-kitten/components";
import { getKumunas } from "../services/backendService";
import { Animated, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import StickyParallaxHeader from "react-native-sticky-parallax-header";


const child = <Text>Hi!</Text>;

const ExpensesScreen = () => {
  const [visible, setVisible] = useState(false);
  const [kumunas, setKumunas] = useState([]);
  const [scroll, setScroll] = useState(new Animated.Value(0));
  const theme = useTheme();

  const loadKumunas = async () => {
    try {
      let kumunas = await getKumunas();
      setKumunas(kumunas);
    } catch (e) {
      console.log(`Error: ${e}`);
      Toast.show({
        type: "error",
        text1: "Oops",
        text2: "Something went wrong",
      });
    }
  };

  useEffect(() => {
    loadKumunas();
  }, []);

  const renderHeader = () => {
    const opacity = scroll.interpolate({
      inputRange: [0, 40, 80],
      outputRange: [0, 0, 1],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.headerWrapper}>
        <Animated.View style={{ opacity }}>
          <Text style={styles.headerTitle}>Your balance: 1,500$</Text>
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

    return (
      <View style={styles.foreground}>
        <Animated.View style={{ opacity }}>
          <Text style={styles.message}>You balance: 1,500$</Text>
        </Animated.View>
      </View>
    );
  };

  const kumunasTabs = [];
  for (let i = 0; i < kumunas.length; i++) {
    let kumuna = kumunas[i];
    kumunasTabs.push({
      title: kumuna.name,
      content: <KumunaExpensesList kumunaId={kumuna.id} />,
    });
  }

  return (
    <Layout style={{ flex: 1 }}>
      <StickyParallaxHeader
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
        bounces={false}
        onEndReached={() => {}}
        tabs={kumunasTabs}
        scrollEvent={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scroll } } }],
          { useNativeDriver: false }
        )}
      />
      <FloatButton onPress={() => setVisible(true)} style={{}} />
    </Layout>
  );
};

export default ExpensesScreen;


const styles = StyleSheet.create({
  content: {
    height: 1000,
    paddingTop: 10,
  },
  foreground: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingBottom: 40,
  },
  message: {
    color: "white",
    fontSize: 24,
    paddingTop: 24,
    paddingBottom: 7,
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
    color: "white",
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