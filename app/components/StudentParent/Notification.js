import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../../config/colors";

export default function Notification({ notification }) {
  return (
    <View
      style={[
        styles.notification,
        {
          backgroundColor: notification.isSeen ? colors.white : colors.primary,
        },
      ]}>
      <Text
        style={[
          styles.notificationTitle,
          {
            color: notification.isSeen ? colors.secondary : colors.white,
          },
        ]}>
        {notification.title}
      </Text>
      <Text
        style={[
          styles.notificationBody,
          {
            color: notification.isSeen ? colors.secondary : colors.white,
          },
        ]}>
        {notification.body}
      </Text>
      <Text
        style={[
          styles.notificationDate,
          {
            color: notification.isSeen ? colors.secondary : colors.white,
          },
        ]}>
        {new Date(notification.date).toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  notification: {
    marginHorizontal: 10,
    marginVertical: 5,
    padding: 12,
    borderRadius: 4,
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.secondary,
  },
  notificationBody: {
    color: colors.secondary,
    marginVertical: 6,
  },
  notificationDate: {
    fontSize: 12,
  },
});
