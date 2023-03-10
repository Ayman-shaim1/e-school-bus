import { Image, StyleSheet } from "react-native";
import React from "react";
import { Marker } from "react-native-maps";

export default function MyPositionMarker({ coordinate }) {
  return (
    <Marker coordinate={coordinate}>
      <Image
        source={require("../../assets/myPositionMarker.png")}
        style={styles.schoolMarker}
      />
    </Marker>
  );
}

const styles = StyleSheet.create({
  schoolMarker: {
    height: 45,
    width: 45,
  },
});
