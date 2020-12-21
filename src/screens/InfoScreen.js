import React, { useEffect, useState, useContext } from "react";
import { Image } from "react-native";
import { Card, CardItem, Container, Content, Text } from "native-base";
import { useTheme } from "@react-navigation/native";
import { FORECA_PASSWORD, FORECA_USERNAME } from '@env';
import { LocationContext } from "../helpers/LocationContext";

const InfoScreen = (props) => {
  const [seaObs, setSeaObs] = useState([]);
  const [weatherObs, setWeatherObs] = useState({});
  const { colors } = useTheme();
  const { locationState, userLatitude, userLongitude } = useContext(LocationContext)
  
  // todo remake almost everything

  const getWeather = async () => {
    fetch(`https://pfa.foreca.com/authorize/token?user=${FORECA_USERNAME}&password=${FORECA_PASSWORD}`,
      {
        method: "POST",
      }
    )
      .then((response) => response.json())
      //If response is in json then in success
      .then((responseJson) => {
        //Success
        const token = responseJson.access_token;
        fetch(`https://pfa.foreca.com/api/v1/marine/forecast/hourly/:location?location=${userLongitude},${userLatitude}&token=${token}`)
          .then((response) => response.json())
          .then((responseJson) => {
            setSeaObs(responseJson.forecast);
          });
        fetch(`https://pfa.foreca.com/api/v1/current//:location?location=${userLongitude},${userLatitude}&token=${token}`)
          .then((response) => response.json())
          .then((responseJson) => {
            setWeatherObs(responseJson.current);
          });
      });
  };

  useEffect(() => {
    if (locationState)
    getWeather();
  }, [locationState]);

  return (
    <Container style={{backgroundColor: colors.background}}>
      <Content>
        <Card style={{backgroundColor: colors.background}}>
          <CardItem
            header
            bordered
            style={{ backgroundColor: colors.background }}
          >
            <Text style={{ color: colors.text }}>Current Weather</Text>
          </CardItem>
          <CardItem
            header
            button
            style={{ backgroundColor: colors.background }}
            onPress={() => props.navigation.navigate("Forecast")}
          >
            <Text style={{ fontWeight: "bold", color: colors.text }}>
              Sea state at your location:{" "}
            </Text>
          </CardItem>
          <CardItem
            button
            style={{ backgroundColor: colors.background }}
            onPress={() => props.navigation.navigate("Forecast")}
          >
            <Image
              source={{
                uri:
                  "https://developer.foreca.com/static/images/symbols_pastel/" +
                  weatherObs.symbol +
                  ".png",
              }}
              style={{
                flex: 1,
                aspectRatio: 4,
                resizeMode: "contain",
              }}
            />
          </CardItem>
          <CardItem style={{ backgroundColor: colors.background }}>
            <Text style={{color: colors.text}}>
              {weatherObs.temperature
                ? `Air temperature: ${weatherObs.temperature}°C`
                : "Can't fetch air temp"}
            </Text>
            <Text style={{color: colors.text}}>
              {weatherObs.symbolPhrase
                ? `,  ${weatherObs.symbolPhrase}`
                : "Can't fetch string"}
            </Text>
          </CardItem>
          <CardItem style={{ backgroundColor: colors.background }}>
            <Text style={{color: colors.text}}>
              {seaObs[0]
                ? `Seawater temperature: ${seaObs[0].seaTemp}°C`
                : "Can't fetch temperature"}
            </Text>
          </CardItem>
          <CardItem style={{ backgroundColor: colors.background }}>
            <Text style={{color: colors.text}}>
              {weatherObs.windSpeed
                ? `Wind: ${weatherObs.windSpeed}m/s`
                : "Can't fetch wind speed"}
            </Text>
            <Text style={{color: colors.text}}>
              {weatherObs.windDirString
                ? ` ${weatherObs.windDirString}`
                : "Can't fetch wind dir"}
            </Text>
          </CardItem>
          <CardItem style={{ backgroundColor: colors.background }}>
            <Text style={{color: colors.text}}>
              {seaObs[0]
                ? `Wave height: ${seaObs[0].sigWaveHeight}m`
                : "Can't fetch wave height"}
            </Text>
          </CardItem>
          <CardItem style={{ backgroundColor: colors.background }}>
            <Text style={{color: colors.text}}>
              {seaObs[0]
                ? `Wave direction: ${seaObs[0].waveDir}`
                : "Can't fetch wave direction"}
            </Text>
          </CardItem>
          <CardItem style={{ backgroundColor: colors.background }}>
            <Text style={{color: colors.text}}>
              {weatherObs.precipProb
                ? `Chance of rain: ${weatherObs.precipProb}%`
                : "Can't fetch CoR"}
            </Text>
          </CardItem>
          <CardItem style={{ backgroundColor: colors.background }}>
            <Text style={{color: colors.text}}>
              {weatherObs.visibility
                ? `Visibility: ${(weatherObs.visibility / 1000).toFixed(1)}km`
                : "Can't fetch visibility"}
            </Text>
          </CardItem>
        </Card>
      </Content>
    </Container>
  );
};

export default InfoScreen;
