import { ScrollView, StyleSheet, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Notification } from "../../components/StudentParent";
import { get, getDatabase, onValue, ref, set, update } from "firebase/database";
import app from "../../firebase/config";
import { Button, Center } from "../../components";
import { useSelector } from "react-redux";

// firebase realtime database :
const realtimeDatabase = getDatabase(app);

export default function StuentParentNotificationsScreen() {
  const [notifications, setNotifications] = useState([]);

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const getNotification = () => {
    try {
      const notificationRef = ref(realtimeDatabase, "notifications");
      onValue(notificationRef, snapshot => {
        if (snapshot) {
          console.log("### detect change ###");

          const frNotifications = Object.values(
            JSON.parse(JSON.stringify(snapshot))
          )
            .filter(nt => String(nt.idStudent) === String(userInfo.localId))
            .sort((a, b) => {
              return new Date(b.date) - new Date(a.date);
            });

          setNotifications(frNotifications);
        }
      });
    } catch (error) {
      console.log("Firebase error :", error);
      alert(error);
    }
  };

  const seenNotification = async id => {
    try {
      const documentRef = ref(realtimeDatabase, `/notifications/${id}`);
      let notification = await get(documentRef);
      if (notification && !notification.isSeen) {
        notification = JSON.parse(JSON.stringify(notification));
        notification.isSeen = true;
        update(documentRef, notification);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const seenAllNotofications = () => {
    if (notifications.length > 0) {
      for (const notification of notifications)
        if (!notification.isSeen) {
          seenNotification(notification.id);
        }
      console.log("seen all notifications");
    }
  };

  useEffect(() => {
    console.log("call use effect from Stuent Parent Notifications Screen");
    getNotification();
  }, []);

  return (
    <ScrollView>
      <Button
        style={{ marginVertical: 10 }}
        title='Seen all notifications'
        iconStart='bell'
        onPress={seenAllNotofications}
      />

      {notifications.length !== 0 ? (
        notifications.map((notification, index) => (
          <Notification notification={notification} key={index} />
        ))
      ) : (
        <Center style={{ marginTop: 30 }}>
          <Text>Notifications not found !</Text>
        </Center>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
