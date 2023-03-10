import React from "react";
import { Text as RNText } from "react-native";
import styles from "../config/styles";
import colors from "../config/colors";

const Text = ({ as, children, style, color = "black" }) => {
  return (
    <RNText style={[{ ...styles.text[as], color: colors[color] }, style]}>
      {children}
    </RNText>
  );
};

export default Text;
