import React from "react";
import { Text } from "native-base";
import { Marker, Callout } from "react-native-maps";
import { StyleSheet, Linking } from "react-native";

// todo
// these icons are temporary, need to figure out better ones
import cruiseShipIcon from "../../assets/cruiseShipIcon2.png"
import cargoIcon from "../../assets/cargoShipIcon2.png"
import otherShipIcon from "../../assets/otherShipIcon2.png"

const ShipMarkers = ({ markers, active }) => {

    return (
        active && markers && markers.map((markers, i) => (
            <Marker
                key={i}
                coordinate={{
                    latitude: markers.geometry.coordinates[1],
                    longitude: markers.geometry.coordinates[0],
                }}
                rotation={markers.properties.heading > 360 ? markers.properties.heading : 0}
                image={markers.shipType < 90 && markers.shipType >= 70 ? cargoIcon : markers.shipType < 70 && markers.shipType >= 60 ? cruiseShipIcon : otherShipIcon }
            >
                <Callout onPress={() => {
                    Linking.openURL(
                        "https://www.marinetraffic.com/fi/ais/details/ships/mmsi:" + markers.mmsi.toString()
                    );
                }}>
                    <Text style={styles.textStyle}> {markers.name}</Text>
                    <Text>{`${Math.round((Date.now() - markers.properties.timestampExternal) / 1000)} seconds ago`}</Text>
                    <Text>{`MMSI: ${markers.mmsi.toString()}`}</Text>
                    <Text>{`AIS: ${markers.shipType.toString()}`}</Text>
                    <Text>{`Speed: ${markers.properties.sog} knots / ` + `${Math.round(markers.properties.sog * 1.852)} km/h`}</Text>
                    <Text style={{ color: "blue" }}>Click for more info</Text>
                    <Text style={{ color: "blue" }}>(opens browser)</Text>
                </Callout>
            </Marker>
        )))
}

const styles = StyleSheet.create({
    textStyle: {
        fontWeight: "bold",
        justifyContent: "center"
    },
});

export default ShipMarkers

