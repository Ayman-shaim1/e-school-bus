import { Image, StyleSheet } from "react-native";
import React from "react";
import { Marker } from "react-native-maps";

export default function DefaultMarker({ coordinate }) {
  return (
    <Marker coordinate={coordinate}>
      <Image
        source={require("../../assets/defaultMarker.png")}
        style={styles.schoolMarker}
      />
    </Marker>
  );
}

const styles = StyleSheet.create({
  schoolMarker: {
    height: 60,
    width: 60,
  },
});
