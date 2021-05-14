import React, { useEffect, useState, useContext } from "react";
import { Image, ScrollView } from "react-native";
import { Card, Container, Text, View, Spinner } from "native-base";
import { useTheme } from "@react-navigation/native";
import { FORECA_PASSWORD, FORECA_USERNAME } from '@env';
import { LocationContext } from "../contexts/LocationContext";
import moment from 'moment';

const WeatherScreen = () => {
  const [weather, setWeather] = useState(null);
  const [hourlyWeather, setHourlyWeather] = useState(null);
  const { colors } = useTheme();
  const { locationState, userLatitude, userLongitude } = useContext(LocationContext)
  
  const getWeather = async () => {
    fetch(`https://pfa.foreca.com/authorize/token?user=${FORECA_USERNAME}&password=${FORECA_PASSWORD}`,
      {
        method: "POST",
      }
    )
      .then(response => response.json())
      .then(res => {
        const token = res.access_token;
        fetch(`https://pfa.foreca.com/api/v1/current/:location?location=${userLongitude},${userLatitude}&token=${token}`)
          .then(response => response.json())
          .then(res => {
            setWeather(res.current);
          });

        fetch(`https://pfa.foreca.com/api/v1/forecast/hourly/:location?location=${userLongitude},${userLatitude}&token=${token}`)
          .then((response) => response.json())
          .then(res => {
            setHourlyWeather(res.forecast);
          });
      });
  };

  useEffect(() => {
    if (locationState)
      getWeather();
  }, [locationState]);

  return (
    <Container style={{ backgroundColor: colors.background }}>
      <View style={{ height: 230 }}>
        {weather ?
          <Card style={{ backgroundColor: colors.background, padding: "5%", flex: 1, justifyContent: "space-between", flexDirection: "row" }}>
            <View style={{ backgroundColor: colors.background }}>
              <Text style={{ color: colors.text, fontSize: 20, textTransform: "capitalize" }}>Current</Text>
              <Text style={{ color: colors.text, fontSize: 18, paddingBottom: "10%" }}>{weather.temperature}°C ({weather.feelsLikeTemp}°C)</Text>
              <Text style={{ color: colors.text }}>Wind: {weather.windSpeed} m/s ({weather.windDirString})</Text>
              <Text style={{ color: colors.text }}>Pressure: {Math.round(weather.pressure)} hPa</Text>
              <Text style={{ color: colors.text }}>Humidity: {weather.relHumidity}%</Text>
              <Text style={{ color: colors.text }}>Chance of Rain: {weather.precipProb}%</Text>
              <Text style={{ color: colors.text }}>Visibility: {(weather.visibility / 1000).toFixed(1)} km</Text>
            </View>
            <Image
              source={{ uri: "https://developer.foreca.com/static/images/symbols_pastel/" + weather.symbol + ".png" }}
              style={{ aspectRatio: 0.8, resizeMode: "contain" }}
            />
          </Card>
          : <Spinner />}
      </View>
      <View style={{ flex: 1 }}>
        <ScrollView>
          {hourlyWeather && hourlyWeather.slice(1).map((data, i) => {
            return (
              <Card key={i} style={{ backgroundColor: colors.background, padding: "5%", flex: 1, justifyContent: "space-between", flexDirection: "row" }}>
                <View style={{ backgroundColor: colors.background }}>
                  <View style={{ backgroundColor: colors.background, paddingBottom: "5%", flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ color: colors.text, fontSize: 20 }}>{moment(data.time).format('dddd')} {data.time.substring(11, 16)}</Text>
                  </View>
                  <View style={{ backgroundColor: colors.background, flex: 1, justifyContent: "flex-start" }}>
                    <Text style={{ color: colors.text }}>Wind: {data.windSpeed} m/s ({data.windDirString})</Text>
                    <Text style={{ color: colors.text }}>Gust: {data.windGust} m/s</Text>
                    <Text style={{ color: colors.text }}>Rain Chance: {data.precipProb}%</Text>
                    <Text style={{ color: colors.text }}>Rain Amount: {data.precipAccum} mm</Text>
                  </View>
                </View>
                <View style={{ backgroundColor: colors.background }}>
                  <Text style={{ color: colors.text, fontSize: 18, paddingBottom: "2%" }}> {data.temperature}°C ({data.feelsLikeTemp}°C)</Text>
                  <Image
                    source={{ uri: "https://developer.foreca.com/static/images/symbols_pastel/" + data.symbol + ".png" }}
                    style={{ aspectRatio: 1, resizeMode: "contain" }}
                  />
                </View>
              </Card>
            )
          })}
        </ScrollView>
      </View>
    </Container>
  );
};

export default WeatherScreen;