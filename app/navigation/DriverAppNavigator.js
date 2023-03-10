
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SettingsScreen } from "../screens";
import { DriverMapScreen, DriverProfileScreen } from "../screens/Driver";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import colors from "../config/colors";

const Tab = createBottomTabNavigator();

export default function DriverAppNavigator() {
  return (

      <Tab.Navigator>
        <Tab.Screen
          name='Home'
          component={DriverMapScreen}
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
          component={DriverProfileScreen}
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
