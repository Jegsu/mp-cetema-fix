import React from "react";
import { Callout, Marker, Polygon } from "react-native-maps";
import { Alert } from "react-native";

const RestrictionZone = ({polygons}) => {

    return (
        polygons && polygons.map((polygons, i) => (
            <Polygon
                key={i}
                coordinates={polygons.coordinates}
                strokeColor={'#000'}
                strokeWidth={1}
                tappable={true}
                onPress={() => Alert.alert("Polygon press", `Restriction Type: ${polygons.properties.restrictionType}`)}
            />
        )))
}

export default RestrictionZone