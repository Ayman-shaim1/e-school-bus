import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Button, Screen } from "../../components";
import MapView, { Marker, Polyline } from "react-native-maps";
import {
  SchoolMarker,
  DefaultMarker,
  BusSchoolMarker,
} from "../../components/Map";
import { getDatabase, onValue, ref } from "firebase/database";
import app from "../../firebase/config";
import { useSelector } from "react-redux";
import MyPositionMarker from "../../components/Map/MyPositionMarker";
import environment from "../../../environment";
import axios from "axios";
import colors from "../../config/colors";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { sendPushNotification } from "../../services";
// Default location or School location (EST - location)
const defaultLocation = {
  // position :
  latitude: 34.05011,
  longitude: -6.812845,
  // camera zoom :
  latitudeDelta: 0.001 * 30,
  longitudeDelta: 0.001 * 30,
};
// firebase realtime database :
const realtimeDatabase = getDatabase(app);
// firebase firestore  :
const firestore = getFirestore(app);

export default function StudentParentMapScreen() {
  const [myPosition, setMyPosition] = useState(null);
  const [stopPosition, setStopPosition] = useState(null);
  const [polylinesCoords, setPolylinesCoords] = useState([]);
  const [schoolBusPosition, setSchoolBusPosition] = useState(null);

  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  const getPolylines = async () => {
    try {
      console.log("call api for destination");
      // setPolylinesCoords([]);
      const stopPositionsCollection = collection(firestore, "stopPositions");
      const querySnapshot = await getDocs(stopPositionsCollection);
      const positions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      let index = 0;
      const npolylinesCoords = [];

      positions.sort((a, b) => {
        const pos1 = a.position.latitude + a.position.longitude;
        const pos2 = b.position.latitude + b.position.longitude;
        return pos1 - pos2;
      });

      for (const position of positions) {
        const pos = position.position;
        let origin = null;
        // set origin geopoint (first position) :
        if (index === 0) {
          const lat = defaultLocation.latitude;
          const long = defaultLocation.longitude;
          origin = `${long},${lat}`;
        } else {
          const lat = positions[index - 1].position.latitude;
          const long = positions[index - 1].position.longitude;
          origin = `${long},${lat}`;
        }
        // set destination geopoint (final position) :
        const lat = pos.latitude;
        const long = pos.longitude;
        const destination = `${long},${lat}`;
        // call api and get direction :
        const apiurl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${environment.openrouteapikey}&start=${origin}&end=${destination}`;
        const { data } = await axios.get(apiurl);
        const coordinates = data.features[0].geometry.coordinates;
        const item = [];
        for (const cords of coordinates) {
          item.push({
            latitude: cords[1],
            longitude: cords[0],
          });
        }
        npolylinesCoords.push(item);
        index++;
      }

      // set last destination from the last point to default position :
      const orglat = positions[positions.length - 1].position.latitude;
      const orglong = positions[positions.length - 1].position.longitude;
      const origin = `${orglong},${orglat}`;
      const destlat = defaultLocation.latitude;
      const destlong = defaultLocation.longitude;
      const destination = `${destlong},${destlat}`;

      const apiurl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${environment.openrouteapikey}&start=${origin}&end=${destination}`;
      const { data } = await axios.get(apiurl);
      const coordinates = data.features[0].geometry.coordinates;
      const item = [];
      for (const cords of coordinates) {
        item.push({
          latitude: cords[1],
          longitude: cords[0],
        });
      }
      npolylinesCoords.push(item);
      setPolylinesCoords(npolylinesCoords);
      console.log("polylines coords length:", polylinesCoords.length);
    } catch (error) {
      alert(error);
    }
  };

  const getMyPosition = async () => {
    const docRef = doc(firestore, "students", userInfo.localId);
    getDoc(docRef)
      .then(async doc => {
        if (doc.exists()) {
          const stopPositionsCollection = collection(
            firestore,
            "stopPositions"
          );
          const querySnapshot = await getDocs(stopPositionsCollection);
          const stopPositions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMyPosition(doc.data().address.location);

          const stp = stopPositions.find(
            sp => sp.students.findIndex(st => st === doc.id) !== -1
          ).position;
 
          if (stp) {
            setStopPosition(stp);
            getPolylines();
          }
        }
      })
      .catch(error => {
        console.log("Error getting document:", error);
      });
  };

  const getBusPosition = () => {
    // get school bus position data from real time databse :
    const dbRef = ref(realtimeDatabase, "trip");
    onValue(dbRef, snapshot => {
      if (snapshot.exists()) {
        setSchoolBusPosition(snapshot.val().location);
      }
    });
  };

  useEffect(() => {
    console.log("call use effect from Student parent map screen");
    getMyPosition();
    // get school bus location data :
    getBusPosition();
  }, []);

  return (
    <Screen style={styles.container}>
      {myPosition && (
        <MapView
          style={styles.map}
          region={{
            latitudeDelta: 0.001 * 30,
            longitudeDelta: 0.001 * 30,
            latitude: myPosition.latitude,
            longitude: myPosition.longitude,
          }}
          // initialRegion={defaultLocation}
          fitToElements={true}>
          {/* Begin Default Location Marker (EST location) */}
          <SchoolMarker coordinate={defaultLocation} />
          {/* End Default Location Marker (EST location) */}

          {/* Begin Student position */}
          {myPosition && <MyPositionMarker coordinate={myPosition} />}
          {/* End Student position */}

          {/* Begin Stop position */}
          {stopPosition && <DefaultMarker coordinate={stopPosition} />}
          {/* End Stop position */}

          {/* Begin School Bus Marker */}
          {schoolBusPosition && (
            <BusSchoolMarker coordinate={schoolBusPosition} />
          )}
          {/* End School Bus Marker */}

          {/* Begin  polylines as a derictions for each stop points */}
          {polylinesCoords.length !== 0 &&
            polylinesCoords.map((polylineCoords, index) => (
              <Polyline
                key={index}
                coordinates={polylineCoords}
                strokeWidth={8}
                strokeColor={colors.primary}
              />
            ))}
          {/* End  polylines as a derictions for each stop points */}
        </MapView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  zoomButtonConatainer: {
    position: "absolute",
    width: "10%",
    zIndex: 100,
    top: "0%",
    right: "11%",
    alignSelf: "flex-start",
    paddingHorizontal: 5,
  },

  zoomButton: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
  },

  map: {
    width: "100%",
    height: "100%",
  },
});
