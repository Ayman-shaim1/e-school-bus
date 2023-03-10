import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import { Marker } from "react-native-maps";
import colors from "../../config/colors";
import Avatar from "../Avatar";

export default function StudentMarker({ student, onPress }) {
  return (
    <Marker
      coordinate={{
        latitude: student.address.location.latitude,
        longitude: student.address.location.longitude,
      }}
      onPress={onPress}>
      <View style={styles.markerImageContainer}>
        <Avatar uri={student.imageUrl} size='sm' />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerImageContainer: {
    //ios
    shadowColor: colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    //android
    elevation: 4,
  },
});
