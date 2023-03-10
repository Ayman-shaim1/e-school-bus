import { StyleSheet } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import DriverAppNavigator from "./DriverAppNavigator";
import AuthNavigator from "./AuthNavigator";
import StudentParentNavigator from "./StudentParentNavigator";

import { ref, getDatabase, onValue } from "firebase/database";
import app from "../firebase/config";
import { getData } from "../services/storage";
import { login } from "../redux/user/userActions";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import environment from "../../environment";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";

// firebase realtime database :
const realtimeDatabase = getDatabase(app);
// firebase firestore  :
const firestore = getFirestore(app);

export default function NavigationScreen() {
  const dispatch = useDispatch();

  const [userType, setUserType] = useState("");
  const [callOnce, setCallOnce] = useState(false);
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

  const get_set_UserInfo = async () => {
    try {
      if (userInfo) {
        const token = getData("expoToken");
        if (token) {
          setExpoTokenFireDB(userInfo.localId, token);
        }
        const docRef = doc(firestore, "students", userInfo.localId);
        const student = await getDoc(docRef);
        if (student.exists()) {
          setUserType("student");
        } else {
          setUserType("driver");
        }
      }
    } catch (error) {
      console.log("Error getting document:", error);
    }
  };
  useEffect(() => {
    console.log("call use effect from Navigation screen");
    get_set_UserInfo();
  }, [userInfo]);

  return (
    <NavigationContainer>
      {!userInfo ? (
        <AuthNavigator />
      ) : userType === "driver" ? (
        <DriverAppNavigator />
      ) : (
        <StudentParentNavigator />
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
