import React from "react";
import { NavigationContainer, useTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthScreen from "../screens/AuthScreen";
import MainScreen from "../screens/MainScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ModifyScreen from "../screens/ModifyScreen";
import WeatherScreen from "../screens/WeatherScreen";

const AuthStack = createStackNavigator();

export const AuthStackScreen = () => {
  const { colors } = useTheme();
  return (
    <NavigationContainer independent={true}>
      <AuthStack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleAlign: 'center'
        }}
      >
        <AuthStack.Screen name="Boat Navigation" component={AuthScreen} />
      </AuthStack.Navigator>
    </NavigationContainer>
  );
};

const MainStack = createStackNavigator();

export const MainStackScreen = () => {
  const { colors } = useTheme();
  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleAlign: 'center'
      }}
    >
      <MainStack.Screen name="Map" component={MainScreen} />
    </MainStack.Navigator>
  );
};

const WeatherStack = createStackNavigator();

export const WeatherStackScreen = () => {
  const { colors } = useTheme();
  return (
    <WeatherStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleAlign: 'center'
      }}
    >
      <WeatherStack.Screen name="Forecast" component={WeatherScreen} />
    </WeatherStack.Navigator>
  );
};

const SettingsStack = createStackNavigator();

export const SettingsStackScreen = () => {
  const { colors } = useTheme();
  return (
    <SettingsStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleAlign: 'center'
      }}
    >
      <SettingsStack.Screen name="Settings" component={SettingsScreen} />
      <SettingsStack.Screen
        name="Update Information"
        component={ModifyScreen}
      />
    </SettingsStack.Navigator>
  );
};

