import React from "react";
import { Text, H3 } from "native-base";
import { Marker, Callout } from "react-native-maps";

import warningIcon from "../../assets/warning.png"

const NauticalWarnings = ({ warnings, active }) => {

    return (
        active && warnings && warnings.map((warnings, i) => (
            <Marker
                key={i}
                coordinate={{
                    latitude: warnings.geometry.coordinates[1],
                    longitude: warnings.geometry.coordinates[0],
                }}
                image={warningIcon}
            >
                <Callout style={{ flex: 1, width: 250, height: 200 }}>
                    <H3>{warnings.properties.locationEn}</H3>
                    <Text>{warnings.properties.contentsEn}</Text>
                    <Text style={{ fontWeight: "bold" }}>
                        {`Published: ${warnings.properties.publishingTime.substring(8, 10)}.`
                            + `${warnings.properties.publishingTime.substring(5, 7)}.`
                            + `${warnings.properties.publishingTime.substring(0, 4)}`
                        }
                    </Text>
                </Callout>
            </Marker>
        )))
}

export default NauticalWarnings