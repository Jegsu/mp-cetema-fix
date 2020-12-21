import React from "react";
import { Text } from "native-base";
import { Marker, Callout } from "react-native-maps";
import { StyleSheet } from "react-native";

import userIcon from "../../assets/usericon.png"
import helpIcon from "../../assets/help.png"

const UserMarkers = ({ markers, uid }) => {

    // filter current user from the array because we show it with
    // showsUserLocation={true}

    return (
        markers && markers.filter(markers => uid !== markers.uid).map((markers, i) => (
            <Marker
                key={i}
                coordinate={{
                    latitude: markers.g.geopoint.latitude,
                    longitude: markers.g.geopoint.longitude,
                }}
                title={markers.username}
                description={`type: ${markers.boatType}, name: ${markers.boatName}, time: ${(Date.now() - markers.timestamp) / 1000}s ago`}
                image={markers.needsRescue === true ? helpIcon : userIcon}
            >
                <Callout>
                    <Text style={styles.textStyle}> {markers.username} </Text>
                    <Text>{`${Math.round((Date.now() - markers.timestamp) / 1000)} seconds ago`}</Text>
                    <Text>{`Name: ${markers.boatName}`}</Text>
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

export default UserMarkers
