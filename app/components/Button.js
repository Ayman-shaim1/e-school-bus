import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import colors from "../config/colors";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";

export default function Button({
  title,
  variant = "primary",
  onPress,
  style,
  iconStart,
  center,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: colors[variant],
          alignItems: "center",
          ...style,
        },
      ]}>
      <View style={styles.buttonContent}>
        {iconStart && (
          <MaterialCommunityIcons
            name={iconStart}
            size={25}
            color={colors.white}
            style={styles.iconStart}
          />
        )}
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginVertical: 3,
    borderRadius: 30,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconStart: {
    marginRight: 5,
  },
  buttonText: {
    fontSize: 18,
    color: colors.white,
  },
});
