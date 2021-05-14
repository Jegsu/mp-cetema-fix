import React, { useState, useEffect } from "react";
import { LogBox } from "react-native";
import * as Expo from "expo";
import * as Font from "expo-font";
import * as Notifications from "expo-notifications";
import MainNavigator from "./src/navigation/MainNavigator";
import { AuthStackScreen } from "./src/navigation/StackNavigator";
import { LocationContextProvider } from "./src/contexts/LocationContext";
import { DigitrafficContextProvider } from "./src/contexts/DigitrafficContext";
import * as firebase from "firebase";
import { ThemeContextProvider } from "./src/contexts/ThemeContext";

const App = () => {
  LogBox.ignoreLogs(["Setting a timer"]);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const [fontReady, setFontReady] = useState(false);
  const loadFonts = async () => {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
    });
    setFontReady(true);
  };

  useEffect(() => {
    loadFonts();
  }, []);

  const [isSigned, setSigned] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (fontReady) {
    firebase.auth().onAuthStateChanged((user) => {
      user ? setSigned(true) : setSigned(false);
      setIsLoading(false);
    });
  }

  if (isLoading) {
    return <Expo.AppLoading />;
  }

  return (
    <LocationContextProvider>
      <DigitrafficContextProvider>
        <ThemeContextProvider>
          {isSigned ? <MainNavigator /> : <AuthStackScreen />}
        </ThemeContextProvider>
      </DigitrafficContextProvider>
    </LocationContextProvider>
  );
};

export default App;