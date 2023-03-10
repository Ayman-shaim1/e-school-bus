import { StyleSheet, View } from "react-native";
import React from "react";

export default function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#f4f4f4",
    marginVertical: 12,
    backgroundColor: "#fff",
  },
});
