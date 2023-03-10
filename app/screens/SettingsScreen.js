import { StyleSheet } from "react-native";
import React from "react";
import { Button, Screen } from "../components";
import { logout } from "../redux/user/userActions";
import { useDispatch, useSelector } from "react-redux";
import { removeData } from "../services/storage";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import app from "../firebase/config";

const firestore = getFirestore(app)

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;
  
  const setExpoTokenFireDB = async (id, expotoken) => {
    const docRef = doc(firestore, "students", id);

    const student = await getDoc(docRef);
    if (student.exists()) {
      const updateData = {
        expoToken: expotoken,
      };
      await updateDoc(docRef, updateData);
    }
  };

  const logoutHandler = () => {
    setExpoTokenFireDB(userInfo.localId, null);
    removeData("userInfo");
    dispatch(logout());
  };
  return (
    <Screen style={styles.container}>
      <Button
        title='light theme'
        iconStart='white-balance-sunny'
        variant='secondary'
      />
      <Button
        title='dark theme'
        iconStart='moon-waning-crescent'
        variant='secondary'
      />

      <Button
        title='logout'
        iconStart='logout'
        variant='danger'
        style={styles.logoutBtn}
        onPress={logoutHandler}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
  },
  logoutBtn: {
    position: "absolute",
    bottom: 20,
    width: "100%",
  },
});
