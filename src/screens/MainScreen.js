import React, { useEffect, useState, useContext } from "react";
import { Container, Fab, Button, View, Icon } from "native-base";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { Alert, StyleSheet, Dimensions } from "react-native";
import { mapStyleDark, mapStyleLight } from "../styles/MapStyleDark";
import * as geokit from "geokit";
import * as Notifications from "expo-notifications";
import * as firebase from "firebase";
import Speedometer from "react-native-speedometer-chart";
import ShipMarkers from "../components/ShipMarkers";
import UserMarkers from "../components/UserMarkers";
import NauticalWarnings from "../components/NauticalWarnings";
import ThemeContext from "../helpers/ThemeContext";
import { GeoFirestore } from "../config/Firebase"
import { LocationContext } from "../helpers/LocationContext";
import { DigitrafficContext } from "../helpers/DigitrafficContext";
import RestrictionZone from "../components/RestrictionZone";

const MainScreen = () => {

  const { locationState, userLocation, userLatitude, userLongitude, userSpeed, initRegion, userWestLong, userSouthLat, userEastLong, userNorthLat } = useContext(LocationContext)
  const { shipMarkers, nauticalWarnings } = useContext(DigitrafficContext)

  const { isDarkTheme } = useContext(ThemeContext);
  const [userMarkers, setUserMarkers] = useState([]);
  const [shipMarkersActive, setShipMarkersActive] = useState(true);
  const [nauticalWarningsActive, setNauticalWarningsActive] = useState(true);
  const [active, setActive] = useState(false);
  const [isSendingSosAlert, setIsSendingSosAlert] = useState(false);
  const [followUserActive, setFollowUserActive] = useState(false);
  const [collisionDetected, setCollisionDetected] = useState(false);
  const [userWithinRadius, setUserWithinRadius] = useState([]);
  const [polygons, setPolygons] = useState([]);

  // todo
  // add "Turvalaitteet", "Navigointilinjat" tba
  // move code to hook or context
  // only fetch certain types
  const fetchPolygons = () => {
    if (userWestLong && userSouthLat && userEastLong && userNorthLat) {
      fetch(`https://julkinen.vayla.fi/inspirepalvelu/wfs?request=getfeature&typename=avoin:rajoitusalue_a&outputformat=application/json&&SRSName=EPSG:4258&BBOX=${userWestLong},${userSouthLat},${userEastLong},${userNorthLat},EPSG:4258`)
        .then(response => response.json())
        .then(data => {
          let array = []
          for (let i = 0; i < data.features.length; i++) {
            const coordPath = data.features[i].geometry.coordinates[0];
            const propPath = data.features[i].properties

            const properties = {
              restrictionType: propPath.RAJOITUSTYYPIT,
              restrictionAmount: propPath.SUURUUS,
              restrictionLocation: propPath.NIMI_SIJAINTI,
              restrictionGranter: propPath.MERK_VAST
            }

            let coordinates = [];
            for (let o = 0; o < coordPath.length; o++) {
              coordinates.push({
                latitude: coordPath[o][1],
                longitude: coordPath[o][0]
              });
            }
            array.push({
              coordinates: coordinates,
              properties: properties
            })
          }
          setPolygons(array)
        })
    }
  }

  const getUserMarkers = async () => {
    // last 15 minutes
    const filterTime = Date.now() - 900000;
    await firebase
      .firestore()
      .collection("locations")
      .onSnapshot((snap) => {
        let array = [];
        snap.forEach((doc) => {
          if (doc.exists && doc.data().timestamp >= filterTime) {
            array.push(doc.data());
          }
        });
        setUserMarkers(array);
      });
  };

  const getUserCollision = (location) => {
    // get user locations in 200m radius and last 5 minutes
    // this only seems to work 
    const geocollection = GeoFirestore.collection("locations");
    const filterTime = Date.now() - 900000;
    const query = geocollection.near({
      center: new firebase.firestore.GeoPoint(
        location.coords.latitude,
        location.coords.longitude
      ),
      radius: 0.2,
    });
    query.get().then(snap => {
      let array = [];
      snap.forEach((doc) => {
        if (doc.id != firebase.auth().currentUser.uid && doc.data().timestamp >= filterTime) {
          array.push(doc.data());
        }
      });
      if (array.length) {
        setUserWithinRadius(array)
      } else {
        setUserWithinRadius([]);
      }
    })
  };

  const sendCollisionAlert = () => {
    if (collisionDetected) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "Collision Alert!",
          body: "You are too close to another vessel!",
        },
        trigger: null,
      });
    }
  };

  const sosAlert = () => {
    Alert.alert(
      "SOS Alert",
      "People nearby will receive your alert",
      [
        { text: "Rescued", onPress: () => updateSosAlert("rescued") },
        {
          text: "Cancel",
          onPress: () => updateSosAlert("cancel"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  const receiveSosAlert = (data) => {
    Alert.alert(
      "SOS Alert",
      data.boatName + " needs your help",
      [
        {
          text: "Accept",
          onPress: () => {
            const ref = firebase.firestore().collection("sos").doc(data.uid)
            ref.get().then(doc => {
              if (doc.exists) {
                ref.update({ rescueAccepted: true })
              } else {
                Alert.alert("SOS Alert", "Could not accept rescue")
              }
            })
          },
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const updateSosAlert = async (option) => {
    if (option == "rescued") {
      await firebase
        .firestore()
        .collection("sos")
        .doc(firebase.auth().currentUser.uid)
        .update({
          rescued: true,
          rescueAccepted: false,
        });

      await firebase
        .firestore()
        .collection("locations")
        .doc(firebase.auth().currentUser.uid)
        .update({
          needsRescue: false,
        });

      setIsSendingSosAlert(false);

    } else if (option == "cancel") {
      await firebase
        .firestore()
        .collection("sos")
        .doc(firebase.auth().currentUser.uid)
        .delete()
        .then((doc) => {
          console.log("SOS Document successfully deleted!");
        })
        .catch(function (error) {
          console.error("Error removing SOS document: ", error);
        });

      await firebase
        .firestore()
        .collection("locations")
        .doc(firebase.auth().currentUser.uid)
        .update({
          needsRescue: false,
        });

      setIsSendingSosAlert(false);
    }
    console.log("SOS alert updated:", option);
  };

  const sendSosAlert = async () => {
    if (locationState) {
      const coords = {
        lat: userLatitude,
        lng: userLongitude,
      };
      const geodata = {
        geohash: geokit.hash(coords),
        geopoint: new firebase.firestore.GeoPoint(
          userLatitude,
          userLongitude
        ),
      };
      const sosData = {
        g: geodata,
        uid: firebase.auth().currentUser.uid,
        boatName: firebase.auth().currentUser.displayName,
        rescued: false,
        rescueAccepted: false,
      };
      await firebase
        .firestore()
        .collection("sos")
        .doc(firebase.auth().currentUser.uid)
        .set(sosData, { merge: true })
        .then((doc) => {
          console.log("New SOS document added");
        })
        .catch((error) => {
          console.error("Error adding SOS document: ", error);
        });

      await firebase
        .firestore()
        .collection("locations")
        .doc(firebase.auth().currentUser.uid)
        .update({
          needsRescue: true,
        });

      sosAlert();
      setIsSendingSosAlert(true);
    } else {
      Alert.alert("SOS Alert", "Location services not enabled");
    }
  };

  const getSosAlert = () => {
    const geocollection = GeoFirestore.collection("sos");
    const query = geocollection.near({
      center: new firebase.firestore.GeoPoint(
        userLatitude,
        userLongitude
      ),
      radius: 10,
    });
    query
      .where("rescued", "==", false)
      .where("rescueAccepted", "==", false)
      .onSnapshot((snap) => {
        snap.forEach((doc) => {
          if (doc.exists && doc.id != firebase.auth().currentUser.uid) {
            receiveSosAlert(doc.data());
          }
        });
      });
  };

  const receiveUpdatesOnSosAlert = async () => {
    if (isSendingSosAlert == true) {
      await firebase
        .firestore()
        .collection("sos")
        .onSnapshot((snap) => {
          snap.forEach((doc) => {
            if (doc.exists && doc.id === firebase.auth().currentUser.uid && doc.data().rescueAccepted == true) {
              Notifications.scheduleNotificationAsync({
                content: {
                  title: "SOS UPDATE!",
                  body: "Someone is on its way to help you!",
                },
                trigger: null,
              });
            }
          })
        })
    }
  };

  const updateUserLocation = async (location) => {
    console.log("Updating user location...")
    const coords = {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    };
    const geodata = {
      geohash: geokit.hash(coords),
      geopoint: new firebase.firestore.GeoPoint(
        location.coords.latitude,
        location.coords.longitude
      ),
    };
    const locationData = {
      g: geodata,
      heading: location.coords.heading,
      speed: location.coords.speed,
      accuracy: location.coords.accuracy,
      timestamp: location.timestamp,
      uid: firebase.auth().currentUser.uid,
      boatName: firebase.auth().currentUser.displayName,
    };

    try {
      await firebase
        .firestore()
        .collection("locations")
        .doc(firebase.auth().currentUser.uid)
        .set(locationData, { merge: true })
        .catch((error) => {
          throw new Error("Error adding document: ", error);
        });
    } catch (err) {
      Alert.alert("Firebase Error", "Could not update location to Firestore");
    }
  };

  const toggleShipMarkers = () => {
    setShipMarkersActive(isActive => !isActive);
  };

  const toggleFollowUser = () => {
    setFollowUserActive(!followUserActive);
  };

  const toggleNauticalWarnings = () => {
    setNauticalWarningsActive(isActive => !isActive)
  }

  useEffect(() => {
    receiveUpdatesOnSosAlert();
  }, [isSendingSosAlert]);

  useEffect(() => {
    if (locationState) {
      getSosAlert();
      getUserMarkers();
      fetchPolygons();
    }
  }, [locationState]);

  useEffect(() => {
    if (locationState && userLocation) {
      updateUserLocation(userLocation)
      getUserCollision(userLocation)
    }
  }, [userLocation]);


  useEffect(() => {
    if (userWithinRadius.length > 0) {
      setCollisionDetected(true);
    } else {
      setCollisionDetected(false);
    }
  }, [userWithinRadius]);

  useEffect(() => {
    sendCollisionAlert();
  }, [collisionDetected]);

  return (
    <Container>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.mapStyle}
          initialRegion={initRegion}
          region={
            followUserActive === true
              ? {
                latitude: userLatitude,
                longitude: userLongitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
              }
              : null
          }
          showsMyLocationButton={false}
          provider={PROVIDER_GOOGLE}
          customMapStyle={isDarkTheme ? mapStyleDark : mapStyleLight}
          showsUserLocation={true}
        >

          <ShipMarkers markers={shipMarkers} active={shipMarkersActive} />

          <UserMarkers markers={userMarkers} uid={firebase.auth().currentUser.uid} />

          <NauticalWarnings warnings={nauticalWarnings} active={nauticalWarningsActive} />

          <RestrictionZone polygons={polygons} />

        </MapView>
        <View style={styles.speedometerContainer}>
          <Speedometer
            value={userSpeed * 1.943844}
            totalValue={50}
            showIndicator
            size={150}
            outerColor="#d3d3d3"
            internalColor="#5ADFFF"
            innerColor="#ffffff"
            showText
            text={`${(userSpeed * 1.943844).toFixed(2)} knot`}
            textStyle={{
              color: "#5ADFFF",
              fontSize: 12,
            }}
            showLabels
            labelTextStyle={{
              color: "black",
            }}
            labelFormatter={(number) => `${number}`}
          />
        </View>
        <Fab
          active={active}
          direction="up"
          containerStyle={{}}
          style={styles.sosFabStyle}
          position="bottomRight"
          onPress={() => sendSosAlert()}>
          <Icon name="medkit" />
        </Fab>
        <Fab
          active={active}
          direction="up"
          containerStyle={{}}
          style={styles.fabStyle}
          position="bottomLeft"
          onPress={() => setActive(!active)}>
          <Icon name="md-arrow-up" />
          <Button
            style={{
              backgroundColor: "#34A34F",
              marginBottom: 45
            }}
            onPress={() => toggleShipMarkers()}>
            <Icon name="boat" />
          </Button>
          <Button
            style={{
              backgroundColor: "#3B5998",
              marginBottom: 50
            }}
            onPress={() => toggleNauticalWarnings()}>
            <Icon name="warning" />
          </Button>
          <Button
            style={{
              backgroundColor: "#5ADFFF",
              marginBottom: 55
            }}
            onPress={() => toggleFollowUser()}>
            {followUserActive === false ? (
              <Icon name="md-navigate" />
            ) : (
                <Icon color="red" name="md-close" />
              )}
          </Button>
        </Fab>
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  mapStyle: {
    ...StyleSheet.absoluteFillObject,
  },

  fabStyle: {
    backgroundColor: "#5ADFFF",
    marginVertical: 30,
  },

  sosFabStyle: {
    backgroundColor: "#f56042",
    marginVertical: 30,
  },

  speedometerContainer: {
    marginVertical: 15,
  },

  mapContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default MainScreen;
