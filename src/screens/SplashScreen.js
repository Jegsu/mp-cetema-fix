import { View, Text, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";

const SplashScreen = () => {
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      <Image source={require("../../assets/icon.png")} />
    </View>
  );
};

export default SplashScreen;
