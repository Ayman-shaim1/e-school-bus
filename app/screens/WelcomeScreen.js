import React from "react";
import { ImageBackground, StyleSheet, View, Image, Text } from "react-native";
import routes from "../navigation/routes";
import { Button } from "../components";

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      blurRadius={4}
      style={styles.background}
      source={require("../assets/background.jpg")}>
      <View style={styles.textContainer}>
        <Image style={styles.logo} source={require("../assets/logo.jpg")} />
        <Text style={styles.tagline}>Welcome</Text>
        <Text style={styles.tagline}>To E-School bus</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          title='Login'
          onPress={() => navigation.navigate(routes.LOGIN)}
        />
        {/* <Button
          title='Register'
          variant='secondary'
          onPress={() => navigation.navigate(routes.REGISTER)}
        /> */}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonsContainer: {
    padding: 20,
    width: "100%",
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 30,
  },
  textContainer: {
    position: "absolute",
    top: 70,
    alignItems: "center",
  },
  tagline: {
    fontSize: 30,
    fontWeight: "bold",
  },
});
