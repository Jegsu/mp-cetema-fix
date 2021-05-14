import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useState, useEffect, createContext } from "react";
import { LocationContext } from "./LocationContext";
import useInterval from "../helpers/useInterval";

const DigitrafficContext = createContext()

const DigitrafficContextProvider = (props) => {

    const [shipMarkers, setShipMarkers] = useState([]);
    const [nauticalWarnings, setNauticalWarnings] = useState([]);
    const [fetchRadius, setFetchRadius] = useState(null);
    const [fetchTime, setFetchTime] = useState(null);
    const [fetchInterval, setFetchInterval] = useState(null);
    const [notFirstFetch, setNotFirstFetch] = useState(false);

    const { locationState, userLatitude, userLongitude } = useContext(LocationContext)

    const fetchWarnings = async () => {
        fetch("https://meri.digitraffic.fi/api/v1/nautical-warnings/published")
            .then((res) => res.json())
            .then((data) => setNauticalWarnings(data.features));
    }

    const getFetchRadius = async () => {
        try {
            const value = JSON.parse(await AsyncStorage.getItem("@fetchRadius"))
            if (value !== null) {
                setFetchRadius(value)
              } else {
                setFetchRadius(25)
              }
        } catch (err) {
            console.log(err.message);
        }
    }

    const getFetchTime = async () => {
        try {
            const value = JSON.parse(await AsyncStorage.getItem("@fetchTime"))
            if (value !== null) {
                setFetchTime(value)
              } else {
                setFetchTime(10)
              }
        } catch (err) {
            console.log(err.message);
        }
    }

    const getFetchInterval = async () => {
        try {
            const value = JSON.parse(await AsyncStorage.getItem("@fetchInterval"))
            if (value !== null) {
                setFetchInterval(value)
              } else {
                setFetchInterval(2)
              }
        } catch (err) {
            console.log(err.message);
        }
    }

    const updateFetchRadius = async (value) => {
        await AsyncStorage.setItem("@fetchRadius", JSON.stringify(value));
        console.log("updateFetchRadius", value)
        setFetchRadius(value)
    }

    const updateFetchTime = async (value) => {
        await AsyncStorage.setItem("@fetchTime", JSON.stringify(value));
        console.log("updateFetchTime", value)
        setFetchTime(value)
    }

    const updateFetchInterval = async (value) => {
        await AsyncStorage.setItem("@fetchInterval", JSON.stringify(value));
        console.log("updateFetchInterval", value)
        setFetchInterval(value)
    }

    const fetchVessels = async () => {
        const success = (res) => (res.ok ? res.json() : Promise.resolve({}));
        const date = new Date();
        const radius = fetchRadius ? fetchRadius : 25
        const time = fetchTime ? fetchTime : 10
        date.setMinutes(date.getMinutes() - time);

        const locations = fetch(
            `https://meri.digitraffic.fi/api/v1/locations/latitude/${userLatitude}/longitude/${userLongitude}/radius/${radius}/from/${date.toISOString()}`
        ).then(success);

        const metadata = fetch(
            "https://meri.digitraffic.fi/api/v1/metadata/vessels"
        ).then(success);

        try {
            const [locationsFetch, metadataFetch] = await Promise.all([
                locations,
                metadata,
            ]);

            const combinedResult = locationsFetch.features.map((locaObj) => ({
                ...metadataFetch.find((metaObj) => metaObj.mmsi === locaObj.mmsi),
                ...locaObj,
            }));

            setShipMarkers(combinedResult)
            setNotFirstFetch(true)

        } catch (err) {
            return console.log(err);
        }
    };

    useEffect(() => {
        getFetchRadius()
        getFetchTime()
        getFetchInterval()
        fetchWarnings()
    }, []);

    useEffect(() => {
        if (locationState)
            fetchVessels()
    }, [locationState]);

    useEffect(() => {
        if (notFirstFetch) {
            fetchVessels()
        }
    }, [fetchRadius, fetchTime]);

    useInterval(() => {
        if (locationState) {
            fetchVessels()
        }
    }, 2 * 60000);


    return (
        <DigitrafficContext.Provider value={{ shipMarkers, nauticalWarnings, fetchRadius, fetchTime, fetchInterval, updateFetchRadius, updateFetchTime, updateFetchInterval }} >
            { props.children }
        </DigitrafficContext.Provider>
    )
}

export { DigitrafficContext, DigitrafficContextProvider }