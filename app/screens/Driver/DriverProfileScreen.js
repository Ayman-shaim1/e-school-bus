import { StyleSheet, Image } from "react-native";
import React, { useState } from "react";

import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../../components/forms";
import { Screen } from "../../components";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

export default function DriverProfileScreen() {
  const [loginFailed, setLoginFailed] = useState(false);

  const handleSubmit = async ({ email, password }) => {};

  return (
    <Screen style={styles.container}>
      <Image
        style={styles.logo}
        source={{
          uri: "https://firebasestorage.googleapis.com/v0/b/e-school-bus-5d779.appspot.com/o/user.png?alt=media&token=9c8caf10-4224-4267-adb1-f3afd569d227",
        }}
      />

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
          icon='account'
          name='email'
          placeholder='Name'
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
         <FormField
          autoCapitalize='none'
          autoCorrect={false}
          icon='lock'
          name='password'
          placeholder='Confirm password'
          secureTextEntry
          textContentType='password'
        />
        <SubmitButton title='Update' />
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
    marginTop: 0,
    marginBottom: 20,
    borderRadius: 40,
  },
});
