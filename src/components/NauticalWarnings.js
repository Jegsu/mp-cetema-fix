import React from "react";
import { Text, H3 } from "native-base";
import { Marker, Callout } from "react-native-maps";

const NauticalWarnings = ({ warnings }) => {

    return (
        warnings && warnings.map((warnings, i) => (
            <Marker
                key={i}
                coordinate={{
                    latitude: warnings.geometry.coordinates[1],
                    longitude: warnings.geometry.coordinates[0],
                }}
                pinColor={'yellow'}
            >
                <Callout>
                    <Text style={{fontWeight: "bold"}}>{warnings.properties.locationEn}</Text>
                    <Text style={{ width: 400, fontSize: 12 }}>{warnings.properties.contentsEn.replace( /[\r\n]+/gm, " ")}</Text>
                    <Text style={{ fontWeight: "bold", fontSize: 12 }}>
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