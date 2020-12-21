import React, { useEffect, useState, useContext } from "react";
import { Card, CardItem, Container, Content, Text, H3 } from "native-base";
import { useTheme } from "@react-navigation/native";
import { FORECA_PASSWORD, FORECA_USERNAME } from '@env';
import { LocationContext } from "../helpers/LocationContext";

const Forecast = () => {
  const [seaObs, setSeaObs] = useState([]);
  const [weatherObs, setWeatherObs] = useState([]);

  const { colors } = useTheme();

  const { userLatitude, userLongitude } = useContext(LocationContext)

  const fetchWeather = async () => {
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

        fetch(`https://pfa.foreca.com/api/v1/forecast/hourly/:location?location=${userLongitude},${userLatitude}&token=${token}`)
          .then((response) => response.json())
          .then((responseJson) => {
            setWeatherObs(responseJson.forecast);
          });
      });
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  return (
    <Container style={{ backgroundColor: colors.background }}>
      {seaObs ? (
        <Content>
          <Card style={{ backgroundColor: colors.background }}>
            <CardItem
              header
              bordered
              style={{ backgroundColor: colors.background }}
            >
              <Text style={{ color: colors.text }}>Marine forecast at your location</Text>
            </CardItem>
          </Card>
          {seaObs.map((item, i) => {
            return (
              <Card key={i}>
                <CardItem style={{ backgroundColor: colors.background }}>
                  <H3 style={{ color: colors.text }}>
                    {item.time
                      ? `${item.time.substring(0, 10)}`
                      : "..."}
                  </H3>
                  <H3 style={{ color: colors.text }}>
                    {item.time
                      ? ` ${item.time.substring(11, 16)}`
                      : "..."}
                  </H3>
                </CardItem>
                <CardItem style={{ backgroundColor: colors.background }}>
                  <Text style={{ color: colors.text }}>
                    {item.seaTemp
                      ? `Seawater temperature: ${item.seaTemp}°C`
                      : "..."}
                  </Text>
                </CardItem>
                <CardItem style={{ backgroundColor: colors.background }}>
                  <Text style={{ color: colors.text }}>
                    {item.sigWaveHeight
                      ? `Wave height: ${item.sigWaveHeight}m`
                      : "..."}
                  </Text>
                </CardItem>
                <CardItem style={{ backgroundColor: colors.background }}>
                  <Text style={{ color: colors.text }}>
                    {item.waveDir
                      ? `Wave direction: ${item.waveDir}`
                      : "..."}
                  </Text>
                </CardItem>
              </Card>
            );
          })}
        </Content>
      ) : (
          <Text style={{ color: colors.text }}>Loading</Text>
        )}
    </Container>
  );
};

export default Forecast;
