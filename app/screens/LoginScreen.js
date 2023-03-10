import { StyleSheet, Image, ActivityIndicator } from "react-native";
import React, { useState } from "react";

import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import { Center, Screen } from "../components";
import * as Yup from "yup";

import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import app from "../firebase/config";

import { login } from "../redux/user/userActions";
import { useDispatch } from "react-redux";
import colors from "../config/colors";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import environment from "../../environment";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { saveData } from "../services/storage";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

const auth = getAuth(app);
const firestore = getFirestore(app);

export default function LoginScreen() {
  const [loginFailed, setLoginFailed] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const setExpoTokenFireDB = async (id, expotoken) => {
    try {
      const docRef = doc(firestore, "students", id);

      const student = await getDoc(docRef);
      if (student.exists()) {
        const updateData = {
          expoToken: expotoken,
        };
        await updateDoc(docRef, updateData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential._tokenResponse;
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== "granted") {
          alert("Failed to get push token for push notification!");
          return;
        }
        let token = (
          await Notifications.getExpoPushTokenAsync({
            projectId: environment.projectId,
          })
        ).data;
        saveData("userInfo", JSON.stringify(user));
        saveData("expoToken", token);
        
        dispatch(login({ ...user, token: token }));
        setExpoTokenFireDB(user.localId, token);
      } else {
        alert("Must use physical device for Push Notifications");
        dispatch(login(user));
        saveData("userInfo", JSON.stringify(user));
      }

      setLoading(false);
    } catch (error) {
      // Handle login error
      if (error.code === "auth/user-not-found") {
        // alert("user not found !");
        setLoginFailed(true);
      }
      if (error.code === "auth/wrong-password") {
        // alert("wrong password !");
        setLoginFailed(true);
      }
      if (error.code === "auth/too-many-requests") {
        alert("too many requests try later !");
      }
      setLoading(false);
      // alert(error);
    }
  };

  return (
    <Screen style={styles.container}>
      <Image style={styles.logo} source={require("../assets/logo.jpg")} />
      <Center>
        <ActivityIndicator
          size='large'
          color={colors.primary}
          animating={loading}
        />
      </Center>
      <Form
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}>
        <ErrorMessage
          error='Invalid email and/or password.'
          visible={loginFailed}
        />
        <FormField
          autoCapitalize='none'
          autoCorrect={false}
          icon='email'
          keyboardType='email-address'
          textContentType='emailAddress'
          name='email'
          placeholder='Email'
        />
        <FormField
          autoCapitalize='none'
          autoCorrect={false}
          icon='lock'
          name='password'
          placeholder='Password'
          secureTextEntry
          textContentType='password'
        />
        <SubmitButton title='Login' />
      </Form>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
    borderRadius: 40,
  },
});
