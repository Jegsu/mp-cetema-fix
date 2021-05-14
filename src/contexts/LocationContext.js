import React, { useState, useEffect, createContext } from 'react'
import * as Location from 'expo-location'
import { Alert, Dimensions } from 'react-native'

const LocationContext = createContext()

const LocationContextProvider = (props) => {
  const [locationState, setLocationState] = useState(false);
  const [userLocation, setUserLocation] = useState(null)
  const [userLatitude, setUserLatitude] = useState(null)
  const [userLongitude, setUserLongitude] = useState(null)
  const [initRegion, setInitRegion] = useState(null)
  const [userSpeed, setUserSpeed] = useState(0);

  // calculate deltas with fixed value
  let { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.10; //Increases or decreases the zoom level dynamically
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const initLocation = async () => {
    let { status } = await Location.requestPermissionsAsync()
    let granted = status == 'granted'
    if (!granted) {
      Alert.alert("Location Error", "Location permissions are needed to run the app");
    } else {
      try {
        // getLastKnownPositionAsync({}) may be used when bbox is calculated better
        // setting initial region this way might work, needs testing
        Location.getCurrentPositionAsync({})
          .then(location => {
            if (location) {
              const lastRegion = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
              };
              setInitRegion(lastRegion)
            } else {
              const defaultRegion = {
                latitude: 60.1587262,
                longitude: 24.922834,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
              }
              setInitRegion(defaultRegion)
            }
          }).catch(error => {
            console.log("getCurrentPositionAsync", error)
          })

        // should update if location changes by 20m and every 5s
        // but doesn't work properly, because distanceinterval overrites timeinterval, big suck
        Location.watchPositionAsync({
          accuracy: Location.Accuracy.Highest,
          timeInterval: 5000,
          distanceInterval: 20
        }, (location) => {
          setUserLocation(location)
          setUserLatitude(location.coords.latitude)
          setUserLongitude(location.coords.longitude)
          setUserSpeed(location.coords.speed)
          setLocationState(true)
        })
      } catch (e) {
        Alert.alert("Location service error", "Please make sure your location service is on");
        console.log(e)
      }
    }
  }

  useEffect(() => {
    initLocation()
  }, []);

  return (
    <LocationContext.Provider value={{ locationState, userLocation, userLatitude, userLongitude, userSpeed, initRegion }} >
      { props.children}
    </LocationContext.Provider>
  )
}

export { LocationContext, LocationContextProvider }