import React from "react";

import ScreenLayout from "../components/ScreenLayout";
import ExpenseItem from "../components/ExpenseItem";
import ExpensesSectionHeader from "../components/ExpensesSectionHeader";
import { SectionList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ({ navigation }) {
  return (
    <ScreenLayout title="Expenses">
      <SafeAreaView>
        <SectionList
          sections={listData}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => <ExpenseItem {...item} />}
          renderSectionHeader={() => <ExpensesSectionHeader />}
        />
      </SafeAreaView>
    </ScreenLayout>
  );
}

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
