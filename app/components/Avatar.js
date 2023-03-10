import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../config/colors";

const sizes = {
  sm: { width: 30, height: 30, borderRadius: 15 },
  md: { width: 45, height: 45, borderRadius: 22.5 },
  lg: { width: 60, height: 60, borderRadius: 30 },
};

export default function Avatar({ source, uri, size = "md" }) {
  if (uri)
    return (
      <Image
        style={[styles.avatar, { ...sizes[size] }]}
        source={{ uri: uri }}
      />
    );
  return <Image style={[styles.avatar, { ...sizes[size] }]} source={source} />;
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.secondary,
  },
});
