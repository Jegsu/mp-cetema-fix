import React, { useEffect, useState } from "react";
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
} from "native-base";
import * as firebase from "firebase";
import { Alert } from "react-native";
import { useTheme } from "@react-navigation/native";

const ModifyScreen = (props) => {
  const [boatName, setBoatName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [currentPassword, setCurrentPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);

  const { colors } = useTheme();

  const updateUserInfo = async () => {
    if (
      firebase.auth().currentUser.displayName !== boatName ||
      firebase.auth().currentUser.email !== email
    ) {
      if (currentPassword) {
        try {
          await firebase
            .auth()
            .signInWithEmailAndPassword(
              firebase.auth().currentUser.email,
              currentPassword
            )
            .catch((err) => {
              throw new Error(err);
            });

          if (firebase.auth().currentUser.displayName !== boatName) {
            await firebase
              .auth()
              .currentUser.updateProfile({ displayName: boatName })
              .catch((err) => {
                throw new Error(err);
              });
          }

          if (firebase.auth().currentUser.email !== email) {
            await firebase
              .auth()
              .currentUser.updateEmail(email)
              .catch((err) => {
                throw new Error(err);
              });
          }

          Alert.alert("Information updated");
          props.navigation.navigate("Settings");
        } catch (err) {
          Alert.alert(err.message);
        }
      } else Alert.alert("Give current password");
    } else Alert.alert("Nothing to update");
  };

  const updateUserPassword = async () => {
    if (currentPassword && password && confirmPassword) {
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(
            firebase.auth().currentUser.email,
            currentPassword
          )
          .catch((err) => {
            throw new Error(err);
          });

        if (password === confirmPassword) {
          await firebase
            .auth()
            .currentUser.updatePassword(password)
            .catch((err) => {
              throw new Error(err);
            });
        } else throw new Error("Passwords did not match");

        Alert.alert("Password updated!");
        props.navigation.navigate("Settings");
      } catch (err) {
        Alert.alert(err.message);
      }
    } else Alert.alert("Fill all fields");
  };

  const deleteUserLocationData = () => {
    Alert.alert(
      "Are you sure you want to delete your location data?",
      "This will remove your marker from others and disable collision warnings.",
      [
        {
          text: "Yes",
          onPress: async () => {
            try {
              await firebase
                .firestore()
                .collection("locations")
                .doc(firebase.auth().currentUser.uid)
                .delete()
                .catch((err) => {
                  throw new Error(err.message);
                });

              Alert.alert("Location data deleted");
              props.navigation.navigate("Settings");
            } catch (err) {
              Alert.alert(err);
            }
          },
        },
        { text: "No", style: "cancel" },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    setBoatName(firebase.auth().currentUser.displayName);
    setEmail(firebase.auth().currentUser.email);
  }, []);

  return (
    <Container style={{ backgroundColor: colors.background }}>
      <Content style={{ backgroundColor: colors.background }}>
        <Card style={{ backgroundColor: colors.background }}>
          <CardItem header bordered style={{ backgroundColor: colors.background }}>
            <Text style={{ color: colors.text }}>Change my details</Text>
          </CardItem>
          <Form style={{ backgroundColor: colors.background }}>
            <Item stackedLabel>
              <Label style={{ color: colors.text }}>Boat name</Label>
              <Input
                style={{ color: colors.text }}
                value={boatName}
                onChangeText={(val) => setBoatName(val)}
              />
            </Item>
            <Item stackedLabel>
              <Label style={{ color: colors.text }}>Email</Label>
              <Input
                style={{ color: colors.text }}
                autoCapitalize="none"
                value={email}
                onChangeText={(val) => setEmail(val)}
              />
            </Item>
            <Item stackedLabel>
              <Label style={{ color: colors.text }}>Current Password</Label>
              <Input
                style={{ color: colors.text }}
                secureTextEntry
                onChangeText={(val) => setCurrentPassword(val)}
              />
            </Item>
            <Button
              info
              transparent
              style={{ alignSelf: "center", margin: 10 }}
              onPress={updateUserInfo}
            >
              <Text>Update information</Text>
            </Button>
          </Form>
        </Card>

        <Card style={{ backgroundColor: colors.background }}>
          <CardItem header bordered style={{ backgroundColor: colors.background }}>
            <Text style={{ color: colors.text }}>Change Password</Text>
          </CardItem>
          <Form style={{ backgroundColor: colors.background }}>
            <Item stackedLabel>
              <Label style={{ color: colors.text }}>Current Password</Label>
              <Input
                style={{ color: colors.text }}
                secureTextEntry
                onChangeText={(val) => setCurrentPassword(val)}
              />
            </Item>
            <Item stackedLabel>
              <Label style={{ color: colors.text }}>New Password</Label>
              <Input
                style={{ color: colors.text }}
                secureTextEntry
                value={password}
                onChangeText={(val) => setPassword(val)}
              />
            </Item>
            <Item stackedLabel>
              <Label style={{ color: colors.text }}>Confirm new password</Label>
              <Input
                style={{ color: colors.text }}
                secureTextEntry
                value={confirmPassword}
                onChangeText={(val) => setConfirmPassword(val)}
              />
            </Item>
            <Button
              info
              transparent
              style={{ alignSelf: "center", margin: 10 }}
              onPress={updateUserPassword}
            >
              <Text>Update password</Text>
            </Button>
          </Form>
        </Card>

        <Card style={{ backgroundColor: colors.background }}>
          <CardItem header bordered style={{ backgroundColor: colors.background }}>
            <Text style={{ color: colors.text }}>Delete location data</Text>
          </CardItem>
          <Body>
            <Button
              danger
              transparent
              style={{ alignSelf: "center", margin: 10 }}
              onPress={deleteUserLocationData}
            >
              <Text>Delete location data</Text>
            </Button>
          </Body>
        </Card>
      </Content>
    </Container>
  );
};

export default ModifyScreen;
