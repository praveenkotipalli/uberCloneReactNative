const EXPO_PUBLIC_OLA_API_KEY = process.env.EXPO_PUBLIC_OLA_API_KEY;

/******************************************************************
 * 1. Tiny helper – ask Ola Maps Directions for a duration (secs) *
 ******************************************************************/
const getOlaDurationSeconds = async (
  originLat,
  originLng,
  destLat,
  destLng
) => {
  console.log("Calling Ola API with:");
  console.log("Origin:", originLat, originLng);
  console.log("Destination:", destLat, destLng);

  const url =
    `https://api.olamaps.io/routing/v1/directions` +
    `?origin=${originLat},${originLng}` +
    `&destination=${destLat},${destLng}` +
    `&alternatives=false&steps=false&overview=false&traffic_metadata=false` +
    `&api_key=${EXPO_PUBLIC_OLA_API_KEY}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await res.json();
  console.log("Ola Maps response:", json);

  if (json?.status === "SUCCESS" && Array.isArray(json.routes) && json.routes[0]) {
    return json.routes[0].legs[0].duration;
  }

  throw new Error(
    `Unexpected Ola Maps response: ${JSON.stringify(json).slice(0, 200)}`
  );
};


/****************************************************
 * 2. Marker helpers (unchanged except for comments) *
 ****************************************************/
export const generateMarkersFromData = ({ data, userLatitude, userLongitude }) =>
  data.map((driver) => {
    const latOffset = (Math.random() - 0.5) * 0.01;
    const lngOffset = (Math.random() - 0.5) * 0.01;

    return {
      latitude: userLatitude + latOffset,
      longitude: userLongitude + lngOffset,
      title: `${driver.first_name} ${driver.last_name}`,
      ...driver,
    };
  });

export const calculateRegion = ({
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}) => {
  if (!userLatitude || !userLongitude) {
    return {
      latitude: 16.4407287,
      longitude: 80.623503,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  if (!destinationLatitude || !destinationLongitude) {
    return {
      latitude: userLatitude,
      longitude: userLongitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
  }

  const minLat = Math.min(userLatitude, destinationLatitude);
  const maxLat = Math.max(userLatitude, destinationLatitude);
  const minLng = Math.min(userLongitude, destinationLongitude);
  const maxLng = Math.max(userLongitude, destinationLongitude);

  const latitudeDelta = (maxLat - minLat) * 1.3;
  const longitudeDelta = (maxLng - minLng) * 1.3;

  return {
    latitude: (userLatitude + destinationLatitude) / 2,
    longitude: (userLongitude + destinationLongitude) / 2,
    latitudeDelta,
    longitudeDelta,
  };
};

/**************************************************************
 * 3. MAIN – get ETA & price using Ola Maps instead of Google *
 **************************************************************/
export const calculateDriverTimes = async ({
  markers,
  userLatitude,
  userLongitude,
  destinationLatitude,
  destinationLongitude,
}) => {
  if (
    !userLatitude ||
    !userLongitude ||
    !destinationLatitude ||
    !destinationLongitude
  )
    return;

  try {
    const promises = markers.map(async (marker) => {
      const timeToUser = await getOlaDurationSeconds(
        marker.latitude,
        marker.longitude,
        userLatitude,
        userLongitude
      );

      const timeToDestination = await getOlaDurationSeconds(
        userLatitude,
        userLongitude,
        destinationLatitude,
        destinationLongitude
      );

      const totalMinutes = (timeToUser + timeToDestination) / 60;
      const price = (totalMinutes * 0.5).toFixed(2);

      return { ...marker, time: totalMinutes, price };
    });

    return await Promise.all(promises);
  } catch (err) {
    console.error("Error calculating driver times with Ola Maps:", err.message);
  }
};
