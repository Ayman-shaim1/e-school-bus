import { StyleSheet, View } from "react-native";
import React from "react";
import colors from "../config/colors";
import Text from "./Text";

const Alert = ({ text, title, type }) => {
  return (
    <View style={styles.alert}>
      <View style={styles.alertContent}>
        <View
          style={[styles.alertType, { backgroundColor: colors[type] }]}></View>
        <View style={styles.alertContentText}>
          <Text as='header6' style={styles.alertTitle}>
            {title}
          </Text>
          <Text style={styles.alertText}>{text}</Text>
        </View>
      </View>
    </View>
  );
};

export default Alert;

const styles = StyleSheet.create({
  alert: {
    top: "3%",
    backgroundColor: colors.white,
    width: "100%",
    borderRadius: 7,
    zIndex: 1000,
    alignSelf: "center",
    marginHorizontal: 10,
  },
  alertContent: {
    position: "relative",
    flexDirection: "row",
  },
  alertContentText: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  alertType: {
    width: 8,
    height: "100%",
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
  },
});
