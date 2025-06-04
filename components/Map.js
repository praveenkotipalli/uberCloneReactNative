import { ActivityIndicator, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import { useDriverStore, useLocationStore } from '../store';
import { calculateDriverTimes, calculateRegion, generateMarkersFromData } from '../utils/map';
import { icons } from '../constants';

import polyline from '@mapbox/polyline';

/** Ola returns geometry encoded with polyline-algorithm */
export const decodePolyline = (encoded) =>
  polyline.decode(encoded).map(([lat, lng]) => ({ latitude: lat, longitude: lng }));

/**
 * Ask Ola Maps for a route and give back decoded coordinates
 */
export const fetchRoute = async (origin, destination, apiKey) => {
  const url = `https://api.olamaps.io/routing/v1/directions?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&overview=full&api_key=${apiKey}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) {
      console.error('HTTP error', res.status, await res.text());
      return [];
    }

    const json = await res.json();
    // console.log('Ola Maps response:', JSON.stringify(json));

    const encodedPolyline = json.routes?.[0]?.overview_polyline;

    if (encodedPolyline && encodedPolyline.length > 0) {
      return decodePolyline(encodedPolyline);
    }

    console.warn('No polyline found in route');
    return [];
  } catch (err) {
    console.error('Error fetching route:', err);
    return [];
  }
};

const Map = () => {
  const {
    userLongitude,
    userLatitude,
    destinationLongitude,
    destinationLatitude,
  } = useLocationStore();

  const origin = { longitude: userLongitude, latitude: userLatitude };
  const destination = { longitude: destinationLongitude, latitude: destinationLatitude };

  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loadingRoute, setLoadingRoute] = useState(false);

  const apiKey = process.env.EXPO_PUBLIC_OLA_API_KEY;

  

  const { selectedDriver, setDriver } = useDriverStore();
  const [drivers, setDrivers] = useState([]);
  const [markers, setMarkers] = useState([]);

  const region = calculateRegion({
    userLatitude,
    userLongitude,
    destinationLatitude,
    destinationLongitude,
  });

  const [loadingDrivers, setLoadingDrivers] = useState(false);

  useEffect(() => {
    if (Array.isArray(drivers) && userLatitude && userLongitude) {
      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });
      setMarkers(newMarkers);
    }
  },[drivers, userLatitude, userLongitude]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoadingDrivers(true);
        // const response = await fetch('http://192.168.0.192:3000/api/drivers');
        // const response = await fetch('http:///10.56.50.201:3000/api/drivers');
        const response = await fetch('http:///10.56.2.157:3000/api/drivers');
        const json = await response.json();
        const driverData = json.data;

        setDriver(driverData);
        setDrivers(driverData);
      } catch (error) {
        console.error('Failed to fetch drivers:', error);
      } finally {
        setLoadingDrivers(false);
      }
    };

    fetchDrivers();
  }, [userLatitude, userLongitude]);

  useEffect(() => {
    if(markers.length > 0 && destinationLatitude && destinationLongitude) {
      calculateDriverTimes({
        markers,
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude,
      }).then((drivers) => {
        setDriver(drivers);
      });
    }
  }, [markers, destinationLatitude, destinationLongitude]);

  useEffect(() => {
    const getRoute = async () => {
      if (!userLatitude || !userLongitude || !destinationLatitude || !destinationLongitude || !apiKey) {
        setRouteCoordinates([]);
        return;
      }
      setLoadingRoute(true);
      const decodedCoordinates = await fetchRoute(origin, destination, apiKey);
      setRouteCoordinates(decodedCoordinates);
      setLoadingRoute(false);
    };

    getRoute();
  }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude, apiKey]);

  if (loadingDrivers || loadingRoute || !userLatitude || !userLongitude) {
    return(
      <View style={tw`flex justify-center items-center w-full h-full`}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={tw`w-full h-full rounded-2xl`}>
      <MapView
        provider={PROVIDER_DEFAULT}
        style={tw`w-full h-full rounded-2xl`}
        initialRegion={region}
        showsPointsOfInterest={false}
        showsUserLocation={true}
        userInterfaceStyle="light"
        zoomControlEnabled={true}
        zoomEnabled={true}
        showsTraffic={true}
        showsIndoors={true}
        showsBuildings={true}
        customMapStyle={mutedMapStyle}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
            description={`Rating: ${marker.rating}`}
            image={selectedDriver === marker.id ? icons.selectedMarker : icons.marker}
            pinColor={selectedDriver === marker.id ? 'blue' : 'red'}
          />
        ))}
        {destinationLatitude && destinationLongitude && (
          <>
            <Marker
              key="destination"
              coordinate={{ latitude: destinationLatitude, longitude: destinationLongitude }}
              title='Destination'
              image={icons.pin}
            />
            {routeCoordinates.length > 0 && (
              <Polyline
                coordinates={routeCoordinates}
                strokeColor="blue"
                strokeWidth={3}
              />
            )}
          </>
        )}
      </MapView>
    </View>
  );
};

export default Map;

const styles = StyleSheet.create({});

const mutedMapStyle = [
  {
    featureType: "all",
    stylers: [
      { saturation: -80 },
      { lightness: 20 }
    ]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      { lightness: 100 },
      { visibility: "simplified" }
    ]
  },
  {
    featureType: "water",
    stylers: [
      { saturation: -10 },
      { lightness: 30 }
    ]
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [
      { lightness: 50 }
    ]
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      { lightness: 21 }
    ]
  },
  {
    featureType: "poi",
    elementType: "labels.text.stroke",
    stylers: [
      { lightness: -4 },
      { color: "#ffffff" }
    ]
  }
];
