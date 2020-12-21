import React, { useEffect, useState } from "react";
import { Button, Card, Container, Content, Form, Input, Item, Label, Text } from "native-base";
import { Alert } from "react-native";
import * as firebase from "firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";

const AuthScreen = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [hasAccount, switchForm] = useState(false);
  const [boatName, setBoatName] = useState(null);
  const [boatType, setBoatType] = useState(null);

  const { colors } = useTheme();

  const userLogin = async () => {
    if (email && password) {
      try {
        await firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(AsyncStorage.setItem("@loginEmail", email))
          .catch((err) => {
            switch (err.code) {
              case "auth/wrong-password":
                throw new Error("Email or password is incorrect.");
              case "auth/invalid-email":
                throw new Error("Email or password is incorrect.");
              case "auth/user-not-found":
                throw new Error("This email is not registered.");
              default:
                throw new Error("Error at sign in.");
            }
          });

        Alert.alert(`Welcome ${firebase.auth().currentUser.displayName}!`);
      } catch (err) {
        Alert.alert(err.message);
      }
    } else Alert.alert("Fill every field");
  };

  const userRegister = async () => {
    if (email && boatName && boatType && password && confirmPassword) {
      if (password === confirmPassword) {
        try {
          await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((res) => {
              res.user.updateProfile({
                displayName: boatName,
              });
              AsyncStorage.setItem("@loginEmail", email);
              AsyncStorage.setItem("@boatType", boatType);
            })
            .catch((err) => {
              switch (err.code) {
                case "auth/invalid-email":
                  throw new Error("Email address is invalid.");
                case "auth/email-already-in-use":
                  throw new Error("Email already registered.");
                case "auth/user-not-found":
                  throw new Error("This email is not registered.");
                case "auth/weak-password":
                  throw new Error("Password must be atleast 6 characters.");
                default:
                  throw new Error("Error at sign up.");
              }
            });
        } catch (err) {
          Alert.alert(err);
        }
        Alert.alert(`Welcome ${firebase.auth().currentUser.displayName}!`);
      } else Alert.alert("Passwords do not match");
    } else Alert.alert("Fill every field");
  };

  useEffect(() => {
    const getSavedEmail = async () => {
      const savedEmail = await AsyncStorage.getItem("@loginEmail");
      if (savedEmail) setEmail(savedEmail);
    };
    getSavedEmail();
  }, []);

  return (
    <Container style={{ backgroundColor: colors.background }}>
      <Content style={{ backgroundColor: colors.background }}>
        <Card style={{ backgroundColor: colors.background }}>
          {!hasAccount ? (
            <Form style={{ backgroundColor: colors.background }}>
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
                <Label style={{ color: colors.text }}>Password</Label>
                <Input
                  style={{ color: colors.text }}
                  value={password}
                  onChangeText={(val) => setPassword(val)}
                  secureTextEntry
                />
              </Item>
              <Button
                success
                transparent
                block
                style={{ alignSelf: "center", margin: 10 }}
                onPress={() => userLogin()}
              >
                <Text>Login</Text>
              </Button>

              <Button
                info
                transparent
                block
                onPress={() => switchForm(!hasAccount)}
              >
                <Text>Don't have account? Click here to SignUp</Text>
              </Button>
            </Form>
          ) : (
              <Form style={{ backgroundColor: colors.background }}>
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
                  <Label style={{ color: colors.text }}>Boat name</Label>
                  <Input
                    style={{ color: colors.text }}
                    value={boatName}
                    onChangeText={(val) => setBoatName(val)}
                  />
                </Item>
                <Item stackedLabel>
                  <Label style={{ color: colors.text }}>Boat type</Label>
                  <Input
                    style={{ color: colors.text }}
                    value={boatType}
                    onChangeText={(val) => setBoatType(val)}
                  />
                </Item>
                <Item stackedLabel>
                  <Label style={{ color: colors.text }}>Password</Label>
                  <Input
                    style={{ color: colors.text }}
                    value={password}
                    onChangeText={(val) => setPassword(val)}
                    secureTextEntry
                  />
                </Item>
                <Item stackedLabel>
                  <Label style={{ color: colors.text }}>Confirm Password</Label>
                  <Input
                    style={{ color: colors.text }}
                    value={confirmPassword}
                    onChangeText={(val) => setConfirmPassword(val)}
                    secureTextEntry
                  />
                </Item>
                <Button
                  success
                  transparent
                  block
                  style={{ alignSelf: "center", margin: 10 }}
                  onPress={() => userRegister()}
                >
                  <Text>Register</Text>
                </Button>

                <Button
                  info
                  transparent
                  block
                  onPress={() => switchForm(!hasAccount)}
                >
                  <Text>Have account already? Click here to SignIn</Text>
                </Button>
              </Form>
            )}
        </Card>
      </Content>
    </Container>
  );
};

export default AuthScreen;
