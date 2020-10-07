import React from "react";

import { StyleSheet, SectionList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ScreenLayout from "../components/ScreenLayout";
import ExpenseItem from "../components/ExpenseItem";
import ExpensesSectionHeader from "../components/ExpensesSectionHeader";
import FloatButton from "../components/FloatButton";

const ExpensesScreen = ({ navigation }) => {
  return (
    <ScreenLayout title="Expenses">
      <SafeAreaView>
        <SectionList
          style={styles.list}
          sections={listData}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => <ExpenseItem {...item} />}
          renderSectionHeader={() => <ExpensesSectionHeader />}
        />
      </SafeAreaView>
      <FloatButton />
    </ScreenLayout>
  );
};

export default ExpensesScreen;

const listData = [
  {
    title: "Header 1",
    data: [
      {
        title: "Title",
        description: "Description",
        price: "5,000$",
        date: { day: 17, month: "Sep." },
        isDebt: true,
      },
      {
        title: "Title",
        description: "Description",
        price: "5,000$",
        date: { day: 17, month: "Sep." },
        isDebt: true,
      },
      {
        title: "Title",
        description: "Description",
        price: "5,000$",
        date: { day: 17, month: "Sep." },
        isDebt: true,
      },
    ],
  },
  {
    title: "Header 2",
    data: [
      {
        title: "Title",
        description: "Description",
        price: "5,000$",
        date: { day: 17, month: "Sep." },
        isDebt: true,
      },
    ],
  },
  {
    title: "Header 3",
    data: [
      {
        title: "Title",
        description: "Description",
        price: "5,000$",
        date: { day: 17, month: "Sep." },
        isDebt: true,
      },
      {
        title: "Title",
        description: "Description",
        price: "5,000$",
        date: { day: 17, month: "Sep." },
        isDebt: true,
      },
    ],
  },
  {
    title: "Header 3",
    data: [
      {
        title: "Title",
        description: "Description",
        price: "5,000$",
        date: { day: 17, month: "Sep." },
        isDebt: true,
      },
      {
        title: "Title",
        description: "Description",
        price: "5,000$",
        date: { day: 17, month: "Sep." },
        isDebt: true,
      },
    ],
  },
  {
    title: "Header 3",
    data: [
      {
        title: "Title",
        description: "Description",
        price: "5,000$",
        date: { day: 17, month: "Sep." },
        isDebt: true,
      },
      {
        title: "Title",
        description: "Description",
        price: "5,000$",
        date: { day: 17, month: "Sep." },
        isDebt: true,
      },
    ],
  },
  {
    title: "Header 3",
    data: [
      {
        title: "Title",
        description: "Description",
        price: "5,000$",
        date: { day: 17, month: "Sep." },
        isDebt: true,
      },
      {
        title: "Title",
        description: "Description",
        price: "5,000$",
        date: { day: 17, month: "Sep." },
        isDebt: true,
      },
    ],
  },
  {
    title: "Header 3",
    data: [
      {
        title: "Title",
        description: "Description",
        price: "5,000$",
        date: { day: 17, month: "Sep." },
        isDebt: true,
      },
      {
        title: "Title",
        description: "Description",
        price: "5,000$",
        date: { day: 17, month: "Sep." },
        isDebt: true,
      },
    ],
  },
];

const styles = StyleSheet.create({
  list: {
    borderRadius: 5,
  },
});
