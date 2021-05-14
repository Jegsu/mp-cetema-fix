import React, { useState, useContext, useEffect } from "react";
import {
  Body,
  Button,
  Card,
  CardItem,
  Container,
  Content,
  Form,
  Input,
  Item,
  Label,
  Text,
  View,
} from "native-base";
import * as firebase from "firebase";
import { useTheme } from "@react-navigation/native";
import { DigitrafficContext } from "../contexts/DigitrafficContext";
import { ThemeContext } from "../contexts/ThemeContext";
import { Switch, TouchableOpacity } from "react-native";

const SettingsScreen = (props) => {

  const [email, setEmail] = useState(null);
  const [boatName, setBoatName] = useState(null);
  const [tempRadius, setTempRadius] = useState(25);
  const [tempTime, setTempTime] = useState(10);
  const [tempInterval, setTempInterval] = useState(2);
  const { colors } = useTheme();

  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  const { fetchRadius, fetchTime, fetchInterval, updateFetchRadius, updateFetchTime, updateFetchInterval } = useContext(DigitrafficContext)

  useEffect(() => {
    setBoatName(firebase.auth().currentUser.displayName);
    setEmail(firebase.auth().currentUser.email);
  }, []);

  useEffect(() => {
    // need to set these with default state because null errors
    setTempRadius(fetchRadius)
    setTempTime(fetchTime)
    setTempInterval(fetchInterval)
  }, [fetchRadius, fetchTime, fetchInterval]);

  return (
    <Container style={{ backgroundColor: colors.background }}>
      <Content>
        <Card>
          <CardItem
            header
            bordered
            style={{ backgroundColor: colors.background }}
          >
            <Text style={{ color: colors.text }}>Details</Text>
          </CardItem>
          <CardItem style={{ backgroundColor: colors.background }}>
            <Body>
              <Text style={{ color: colors.text }}>
                Boat name: {boatName}
                {"\n"}
                Email: {email}
              </Text>
            </Body>
          </CardItem>
          <CardItem
            style={{
              justifyContent: "center",
              backgroundColor: colors.background,
            }}
          >
            <Button
              info
              transparent
              onPress={() => props.navigation.navigate("Update Information")}
            >
              <Text>Update information</Text>
            </Button>
            <Button
              danger
              transparent
              onPress={() => firebase.auth().signOut()}
            >
              <Text>Logout</Text>
            </Button>
          </CardItem>
        </Card>
        <Card>
          <CardItem
            header
            bordered
            style={{ backgroundColor: colors.background }}
          >
            <Text style={{ color: colors.text }}>App settings</Text>
          </CardItem>
          <CardItem style={{ backgroundColor: colors.background }}>
            <TouchableOpacity>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: colors.text, paddingTop: 2, paddingRight: "3%" }}>Toggle Dark Theme</Text>
                <Switch
                  value={isDarkTheme === true}
                  onValueChange={toggleTheme}
                />
              </View>
            </TouchableOpacity>
          </CardItem>
          <Form style={{ backgroundColor: colors.background }}>
            <Item stackedLabel>
              <Label style={{ color: colors.text }}>
                Fetch radius (kilometers)
              </Label>
              <Input
                style={{ color: colors.text }}
                value={tempRadius.toString()}
                keyboardType="numeric"
                maxLength={4}
                onChangeText={(val) => {
                  setTempRadius(val);
                }}
                onEndEditing={() => {
                  if (tempRadius.length > 0) {
                    updateFetchRadius(tempRadius)
                  }
                }}
              />
            </Item>
            <Item stackedLabel>
              <Label style={{ color: colors.text }}>
                Fetch AIS ship information age newer than (minutes)
              </Label>
              <Input
                style={{ color: colors.text }}
                value={tempTime.toString()}
                keyboardType="numeric"
                maxLength={3}
                onChangeText={(val) => {
                  setTempTime(val);
                }}
                onEndEditing={() => {
                  if (tempTime.length > 0) {
                    updateFetchTime(tempTime);
                  }
                }}
              />
            </Item>
            <Item stackedLabel>
              <Label style={{ color: colors.text }}>
                Fetch AIS ships interval (minutes)
              </Label>
              <Input
                style={{ color: colors.text }}
                value={tempInterval.toString()}
                keyboardType="numeric"
                maxLength={3}
                onChangeText={(val) => {
                  setTempInterval(val);
                }}
                onEndEditing={() => {
                  if (tempInterval.length > 0) {
                    updateFetchInterval(tempInterval);
                  }
                }}
              />
            </Item>
          </Form>
        </Card>
      </Content>
    </Container>
  );
};

export default SettingsScreen;
