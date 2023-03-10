import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SettingsScreen } from "../screens";
import {
  StudentParentMapScreen,
  StudentParentProfileScreen,
  StuentParentNotificationsScreen,
} from "../screens/StudentParent";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import colors from "../config/colors";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";
import app from "../firebase/config";
import { useSelector } from "react-redux";
import * as Notifications from "expo-notifications";
const Tab = createBottomTabNavigator();
// firebase realtime database :
const realtimeDatabase = getDatabase(app);
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
export default function StudentParentNavigator() {
  const [nbrNotSeen, setNbrNotSeen] = useState(0);
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const getIsSeenNomber = () => {
    try {
      const collectionRef = ref(realtimeDatabase, "notifications");
      onValue(collectionRef, snapshot => {
        if (snapshot) {
          const frNotifications = Object.values(
            JSON.parse(JSON.stringify(snapshot))
          );

          setNbrNotSeen(
            frNotifications.filter(
              not =>
                not.idStudent &&
                !not.isSeen &&
                not.idStudent === userInfo.localId
            ).length
          );
        }
      });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getIsSeenNomber();
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name='Home'
        component={StudentParentMapScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name='map'
              color={focused ? colors.primary : color}
              size={size}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name='Profile'
        component={StudentParentProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name='account'
              color={focused ? colors.primary : color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name='notifications'
        component={StuentParentNotificationsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ position: "relative" }}>
              {nbrNotSeen !== 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    right: -5,
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    alignItems: "center",
                    backgroundColor: colors.danger,
                    zIndex: 100,
                  }}>
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: 10,
                      fontWeight: "bold",
                    }}>
                    {nbrNotSeen}
                  </Text>
                </View>
              )}

              <MaterialCommunityIcons
                name='bell'
                color={focused ? colors.primary : color}
                size={size}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name='Settings'
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <FontAwesome
              name='gear'
              color={focused ? colors.primary : color}
              size={size}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
