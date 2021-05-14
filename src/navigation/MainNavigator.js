import { NavigationContainer } from "@react-navigation/native";
import React, { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import TabNavigator from "../navigation/TabNavigator"
import { CustomDarkTheme, CustomDefaultTheme } from "../styles/Themes";

const MainNavigator = () => {

  const { isDarkTheme } = useContext(ThemeContext)

  return (
    <NavigationContainer theme={isDarkTheme ? CustomDarkTheme : CustomDefaultTheme}>
      <TabNavigator />
    </NavigationContainer>
  );
};

export default MainNavigator