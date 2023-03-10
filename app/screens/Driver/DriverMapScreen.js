import { StyleSheet, View, Vibration } from "react-native";
import React, { useEffect, useState } from "react";
import { ref, getDatabase, set, push, get } from "firebase/database";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { Button, Screen, StudentInfoModal, Alert } from "../../components";
import {
  BusSchoolMarker,
  DefaultMarker,
  SchoolMarker,
  StudentMarker,
} from "../../components/Map";
import MapView, { Polyline } from "react-native-maps";
import app from "../../firebase/config";
import colors from "../../config/colors";
import environment from "../../../environment";
import axios from "axios";
import { getDistance, createUUID, sendPushNotification } from "../../services";
import { useSelector } from "react-redux";

// Default location or School location (EST - location)
const defaultLocation = {
  // position :
  latitude: 34.05011,
  longitude: -6.812845,
  // camera zoom :
  latitudeDelta: 0.001 * 13,
  longitudeDelta: 0.001 * 13,
};
// firebase realtime database :
const realtimeDatabase = getDatabase(app);
// firebase firestore  :
const firestore = getFirestore(app);

// Interval for school bus marker move :
let interval = null;
let rowIndex = 0;
let columnIndex = 0;
let intervalValue = 450;

const startPosition = {
  latitude: 34.05011,
  longitude: -6.812999,
};

export default function DriverMapScreen() {
  // states :
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [stopPositions, setStopPositions] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [polylinesCoords, setPolylinesCoords] = useState([]);
  const [toggleBtn, setToggleBtn] = useState(false);
  const [toggleChgBtn, setToggleChgBtn] = useState(false);
  const [schoolBusPost, setSchoolBusPost] = useState(startPosition);

  const [showButton, setShowButton] = useState(false);
  const [hideStopPositionIndex, setHideStopPositionIndex] = useState(-1);
  const [makeVibrationPositionIndex, setMakeVibrationPositionIndex] =
    useState(-1);
  const [showArrivedToSchool, setShowArrivedToSchool] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const userLogin = useSelector(state => state.userLogin);
  const { userInfo } = userLogin;

  // set school bus position (on realtime) :
  const setPosition = position => {
    const collectionRef = ref(realtimeDatabase, "trip");
    set(collectionRef, {
      location: position,
    });
  };

  // get directions :
  const getPolylines = async () => {
    try {
      console.log("call api for destination");
      // setPolylinesCoords([]);

      let index = 0;
      const stopPositionsCollection = collection(firestore, "stopPositions");
      const querySnapshot = await getDocs(stopPositionsCollection);
      const positions = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

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

  // move the marker :
  const moveSchoolBusMarker = () => {
    interval = setInterval(() => {
      if (polylinesCoords[rowIndex]) {
        if (columnIndex !== polylinesCoords[rowIndex].length) {
          setSchoolBusPost(polylinesCoords[rowIndex][columnIndex]);
          setPosition(polylinesCoords[rowIndex][columnIndex]);
          showButtonSendNotification(polylinesCoords[rowIndex][columnIndex]);

          columnIndex++;
        } else {
          columnIndex = 0;
          rowIndex++;
        }
      } else {
        clearInterval(interval);
        setToggleBtn(false);
        rowIndex = 0;
        columnIndex = 0;
      }
    }, intervalValue);
  };

  // start trip :
  const startTripHandler = () => {
    console.log("start trip");
    startSendNotifications();
    setPosition(startPosition);
    setSchoolBusPost(startPosition);
    showButtonSendNotification(startPosition);
    moveSchoolBusMarker();
    setToggleBtn(true);
    setHideStopPositionIndex(-1);
    setShowArrivedToSchool(false);
  };

  // stop trip :
  const stopTripHandler = () => {
    console.log("stop trip");
    clearInterval(interval);
    setToggleChgBtn(true);
  };

  // continue trip :
  const continueTripHandler = () => {
    console.log("continue trip");
    moveSchoolBusMarker();
    setToggleChgBtn(false);
  };

  //  cancel trip :
  const cancelTripHandler = () => {
    rowIndex = 0;
    columnIndex = 0;
    clearInterval(interval);
    setToggleChgBtn(false);
    setToggleBtn(false);
    setSchoolBusPost(startPosition);
    setPosition(startPosition);
    showButtonSendNotification(startPosition);
    console.log("cancel trip");
  };

  //  get stop positions  :
  const getStopPositions = async () => {
    try {
      const stopPositionsCollection = collection(firestore, "stopPositions");
      const querySnapshot = await getDocs(stopPositionsCollection);
      const fetchedData = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => {
          const pos1 = a.position.latitude + a.position.longitude;
          const pos2 = b.position.latitude + b.position.longitude;
          return pos1 - pos2;
        });
      setStopPositions(fetchedData);
    } catch (error) {
      alert(error);
    }
  };

  // get students data :
  const getStudents = async () => {
    try {
      const studentsCollection = collection(firestore, "students");
      const querySnapshot = await getDocs(studentsCollection);
      const fetchedData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setStudents(fetchedData);

      setTimeout(() => {
        getStopPositions();
        getPolylines();
      }, 1000);
    } catch (error) {
      alert(error);
    }
  };

  const showButtonSendNotification = position => {
    if (polylinesCoords.length !== 0) {
      const time =
        (getDistance(
          position.latitude,
          position.longitude,
          polylinesCoords[rowIndex][polylinesCoords[rowIndex].length - 1]
            .latitude,
          polylinesCoords[rowIndex][polylinesCoords[rowIndex].length - 1]
            .longitude,
          "K"
        ) /
          10) *
        60;
      // check time :
      if (Math.floor(time) <= 1) {
        // make vibration

        // set alert message :
        if (rowIndex !== polylinesCoords.length - 1) {
         
            makeVibration();
            setMakeVibrationPositionIndex(rowIndex);
         
          // show button and alert :
          setShowButton(true);
          setAlertMessage(
            `You are very close to the stop position. send a notification to all concerned students`
          );
        } else {
          setShowButton(false);
          const lastRow = polylinesCoords[polylinesCoords.length - 1];

          const lastPosition = lastRow[lastRow.length - 1];
          if (
            lastPosition.latitude == position.latitude &&
            lastPosition.longitude == position.longitude
          ) {
            setShowArrivedToSchool(true);
          }
        }
      } else {
        setShowButton(false);
      }
    }
  };

  const closeModalHandler = () => setShowModal(false);
  const openModalHandler = () => setShowModal(true);

  const startSendNotifications = () => {
    try {
      const notification = {
        title: "School bus has ben started the trip",
        body: "The school bus has been started the trip. watch out to lost it and try to make you child in the stop position at time ",
        isSeen: false,
        date: new Date().toString(),
      };

      students.forEach(student => {
        const idNotification = createUUID();
        const notificationsRef = ref(
          realtimeDatabase,
          `notifications/${idNotification}`
        );
        notification.id = idNotification;
        notification.idStudent = student.id;
        sendPushNoti(notification.idStudent, notification);
        set(notificationsRef, notification).catch(error =>
          console.log("firebase set error :", error)
        );
      });
    } catch (error) {
      alert(error);
    }
  };

  const sendPositionAtStopPosition = () => {
    try {
      setHideStopPositionIndex(rowIndex);
      if (rowIndex + 1 <= stopPositions.length) {
        const notification = {
          title: "School Bus is to close to your stop position",
          body: "The school bus is too close to your stop position you should be there",
          isSeen: false,
          date: new Date().toString(),
        };

        stopPositions[rowIndex].students.forEach(studentId => {
          const idNotification = createUUID();

          const notificationsRef = ref(
            realtimeDatabase,
            `notifications/${idNotification}`
          );
          notification.id = idNotification;
          notification.idStudent = studentId;
          sendPushNoti(studentId, notification);

          set(notificationsRef, notification).catch(error =>
            console.log("firebase set error :", error)
          );
        });
      }
    } catch (error) {
      alert(error);
    }
  };

  const sendInSchool = () => {
    try {
      const notification = {
        title: "School bus has ben arrived to the school",
        body: "The school bus has been arrived to the school",
        isSeen: false,
        date: new Date().toString(),
      };

      students.forEach(student => {
        const idNotification = createUUID();
        const notificationsRef = ref(
          realtimeDatabase,
          `notifications/${idNotification}`
        );
        notification.id = idNotification;
        notification.idStudent = student.id;
        sendPushNoti(student.id, notification);
        set(notificationsRef, notification).catch(error =>
          console.log("firebase set error :", error)
        );
      });
      setShowArrivedToSchool(false);
    } catch (error) {
      alert(error);
    }
  };

  const sendPushNoti = async (id, notification) => {
    const docRef = doc(firestore, "students", id);
    const student = await getDoc(docRef);

    if (student.exists()) {
      const expoToken = JSON.parse(JSON.stringify(student.data())).expoToken;
      if (expoToken) {
        sendPushNotification(
          expoToken,
          notification.title,
          notification.body,
          id
        );
      }
    }
  };

  const makeVibration = () => {
    Vibration.vibrate([100, 100]);
  };

  useEffect(() => {
    console.log("call use effect from driver map screen");

    getStudents();
    setPosition(startPosition);
    // makeVibration();

    return () => {
      console.log("cleaned up");
      setPosition(startPosition);
    };
  }, []);

  return (
    <Screen style={styles.container}>
      {/* Begin Send Notification Button */}

      {showArrivedToSchool && (
        <View style={styles.sendNotificationContainer}>
          <Alert
            title='Alert '
            text={
              "Your are in the school send notifications to the students parent"
            }
            type='warning'
          />
          <Button
            variant='primary'
            title='send notification'
            iconStart='send'
            style={styles.sendNotificationButton}
            onPress={sendInSchool}
          />
        </View>
      )}

      {showButton && hideStopPositionIndex !== rowIndex && (
        <View style={styles.sendNotificationContainer}>
          <Alert title='Alert ' text={alertMessage} type='warning' />
          <Button
            variant='primary'
            title='send notification'
            iconStart='send'
            style={styles.sendNotificationButton}
            onPress={sendPositionAtStopPosition}
          />
        </View>
      )}

      {/* End Send Notification Button */}

      {/* Begin Student Info Modal  */}
      <StudentInfoModal
        show={showModal}
        onClose={closeModalHandler}
        student={studentDetails}
      />
      {/* End Student Info Modal  */}
      {/* Begin Button Start Trip */}
      {!toggleBtn && (
        <Button
          title='start'
          style={styles.startButton}
          onPress={startTripHandler}
          iconStart='bus-multiple'
          center={true}
        />
      )}
      {/* End Button Start Trip */}

      {/* Begin Button stop Trip */}
      {toggleBtn && (
        <View style={styles.btnGroup}>
          {!toggleChgBtn ? (
            <Button
              title='stop'
              onPress={stopTripHandler}
              variant='secondary'
              iconStart='bus-stop'
            />
          ) : (
            <Button
              title='continue'
              onPress={continueTripHandler}
              variant='secondary'
              iconStart='bus-multiple'
            />
          )}

          <Button
            title='cancel'
            onPress={cancelTripHandler}
            variant='danger'
            iconStart='bus-marker'
          />
        </View>
      )}
      {/* End Button stop Trip */}

      <MapView
        style={styles.map}
        region={defaultLocation}
        initialRegion={defaultLocation}
        fitToElements={true}>
        {/* Begin Default Location Marker (EST location) */}
        <SchoolMarker coordinate={defaultLocation} />
        {/* End Default Location Marker (EST location) */}

        {/* Begin Other Students Markers */}
        {students.length !== 0 &&
          students.map(student => (
            <StudentMarker
              student={student}
              key={student.id}
              onPress={() => {
                setStudentDetails(student);
                openModalHandler();
              }}
            />
          ))}
        {/* End Other Students Markers */}
        <BusSchoolMarker coordinate={schoolBusPost} />
        {/* Begin Stop Positions Marker */}
        {stopPositions.length !== 0 &&
          stopPositions.map(stopPosition => (
            <DefaultMarker
              key={stopPosition.id}
              coordinate={stopPosition.position}
            />
          ))}
        {/* End Stop Positions Marker */}

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
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  sendNotificationContainer: {
    position: "absolute",
    width: "80%",
    zIndex: 100,
    top: 10,
    flexDirection: "column",
    alignSelf: "center",
    justifyContent: "space-between",
  },
  sendNotificationButton: {
    marginTop: 10,
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
  startButton: {
    position: "absolute",
    width: "80%",
    zIndex: 100,
    bottom: "2%",
    alignSelf: "center",
  },
  btnGroup: {
    paddingHorizontal: 7,
    position: "absolute",
    zIndex: 100,
    bottom: "2%",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
  },

  map: {
    width: "100%",
    height: "100%",
  },
});
