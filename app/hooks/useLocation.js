import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { PermissionsAndroid, Platform } from "react-native";
export default function useLocation() {
  const [location, setLocation] = useState(null);

  const getLocation = async () => {
    try {
      if (Platform.OS === "android") {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
          {
            title: "Get your location",
            message: "We need to get your location",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("You can use the location");
          const result = await Location.getCurrentPositionAsync();
          console.log(result);
          setLocation(result);
        } else {
          console.log("Location permission denied");
        }
      }

      return;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return location;
}
