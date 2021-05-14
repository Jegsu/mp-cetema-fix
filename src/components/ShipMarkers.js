import React from "react";
import { Text } from "native-base";
import { Marker, Callout } from "react-native-maps";
import { Linking } from "react-native";

const ShipMarkers = ({ markers }) => {

    return (
        markers && markers.map((marker) => (
            <Marker
                key={marker.mmsi}
                coordinate={{
                    latitude: marker.geometry.coordinates[1],
                    longitude: marker.geometry.coordinates[0],
                }}
                //rotation={markers.properties.heading > 360 ? markers.properties.heading : 0}
                pinColor={marker.shipType < 90 && marker.shipType >= 70 ? "blue" : marker.shipType < 70 && marker.shipType >= 60 ? "purple" : "teal" }
            >
                <Callout onPress={() => {
                    Linking.openURL(
                        "https://www.marinetraffic.com/fi/ais/details/ships/mmsi:" + marker.mmsi.toString()
                    );
                }}>
                    <Text style={{fontWeight: "bold", alignSelf: "center"}}> {marker.name}</Text>
                    <Text>{`Update: ${Math.round((Date.now() - marker.properties.timestampExternal) / 1000)} s ago`}</Text>
                    <Text>{`MMSI: ${marker.mmsi.toString()}`}</Text>
                    <Text>{`AIS: ${marker.shipType.toString()}`}</Text>
                    <Text>{`Speed: ${marker.properties.sog} knots/` + `${Math.round(marker.properties.sog * 1.852)} kmh`}</Text>
                    <Text style={{ color: "blue" }}>Click for more info</Text>
                    <Text style={{ color: "blue" }}>(opens browser)</Text>
                </Callout>
            </Marker>
        )))
}

export default ShipMarkers

