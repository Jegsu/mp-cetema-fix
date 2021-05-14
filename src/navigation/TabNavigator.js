import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "native-base";
import { MainStackScreen, SettingsStackScreen, WeatherStackScreen } from "./StackNavigator";

const Tab = createBottomTabNavigator();
const TabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Map"
        component={MainStackScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="md-boat" color={color} style={{ color: "#5ADFFF" }} />
          ),
        }}
      />
      <Tab.Screen
        name="Weather"
        component={WeatherStackScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="md-cloudy" color={color} style={{ color: "#5ADFFF" }} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStackScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="md-menu" color={color} style={{ color: "#5ADFFF" }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator