import { ActivityIndicator, FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import * as Location from 'expo-location';

import { useUser } from '@clerk/clerk-expo';
import { SignOutButton } from '../auth/SignOutBotton';
import { SafeAreaView } from 'react-native-safe-area-context';
import RideCard from '../../components/RideCard';
import { icons, images } from '../../constants';
// import { SignOutButton } from './auth/SignOutBotton';
import tw from 'twrnc';
import Map from '../../components/Map';
import { useLocationStore } from '../../store';
import OlaMapTextInput from '../../components/OlaMapTextInput';
import { router, useNavigation } from 'expo-router';

const recentRide = [
  {
      "ride_id": "1",
      "origin_address": "Kathmandu, Nepal",
      "destination_address": "Pokhara, Nepal",
      "origin_latitude": "27.717245",
      "origin_longitude": "85.323961",
      "destination_latitude": "28.209583",
      "destination_longitude": "83.985567",
      "ride_time": 391,
      "fare_price": "19500.00",
      "payment_status": "paid",
      "driver_id": 2,
      "user_id": "1",
      "created_at": "2024-08-12 05:19:20.620007",
      "driver": {
          "driver_id": "2",
          "first_name": "David",
          "last_name": "Brown",
          "profile_image_url": "https://ucarecdn.com/6ea6d83d-ef1a-483f-9106-837a3a5b3f67/-/preview/1000x666/",
          "car_image_url": "https://ucarecdn.com/a3872f80-c094-409c-82f8-c9ff38429327/-/preview/930x932/",
          "car_seats": 5,
          "rating": "4.60"
      }
  },
  {
      "ride_id": "2",
      "origin_address": "Jalkot, MH",
      "destination_address": "Pune, Maharashtra, India",
      "origin_latitude": "18.609116",
      "origin_longitude": "77.165873",
      "destination_latitude": "18.520430",
      "destination_longitude": "73.856744",
      "ride_time": 491,
      "fare_price": "24500.00",
      "payment_status": "paid",
      "driver_id": 1,
      "user_id": "1",
      "created_at": "2024-08-12 06:12:17.683046",
      "driver": {
          "driver_id": "1",
          "first_name": "James",
          "last_name": "Wilson",
          "profile_image_url": "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
          "car_image_url": "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
          "car_seats": 4,
          "rating": "4.80"
      }
  },
  {
      "ride_id": "3",
      "origin_address": "Zagreb, Croatia",
      "destination_address": "Rijeka, Croatia",
      "origin_latitude": "45.815011",
      "origin_longitude": "15.981919",
      "destination_latitude": "45.327063",
      "destination_longitude": "14.442176",
      "ride_time": 124,
      "fare_price": "6200.00",
      "payment_status": "paid",
      "driver_id": 1,
      "user_id": "1",
      "created_at": "2024-08-12 08:49:01.809053",
      "driver": {
          "driver_id": "1",
          "first_name": "James",
          "last_name": "Wilson",
          "profile_image_url": "https://ucarecdn.com/dae59f69-2c1f-48c3-a883-017bcf0f9950/-/preview/1000x666/",
          "car_image_url": "https://ucarecdn.com/a2dc52b2-8bf7-4e49-9a36-3ffb5229ed02/-/preview/465x466/",
          "car_seats": 4,
          "rating": "4.80"
      }
  },
  {
      "ride_id": "4",
      "origin_address": "Okayama, Japan",
      "destination_address": "Osaka, Japan",
      "origin_latitude": "34.655531",
      "origin_longitude": "133.919795",
      "destination_latitude": "34.693725",
      "destination_longitude": "135.502254",
      "ride_time": 159,
      "fare_price": "7900.00",
      "payment_status": "paid",
      "driver_id": 3,
      "user_id": "1",
      "created_at": "2024-08-12 18:43:54.297838",
      "driver": {
          "driver_id": "3",
          "first_name": "Michael",
          "last_name": "Johnson",
          "profile_image_url": "https://ucarecdn.com/0330d85c-232e-4c30-bd04-e5e4d0e3d688/-/preview/826x822/",
          "car_image_url": "https://ucarecdn.com/289764fb-55b6-4427-b1d1-f655987b4a14/-/preview/930x932/",
          "car_seats": 4,
          "rating": "4.70"
      }
  }
]
const HomeScreen = () => {

  const navigation = useNavigation();

  const { setUserLocation, setDestinationLocation } = useLocationStore();
  // const destinationLocation = useLocationStore((state) => state.destinationLocation);
  const { user } = useUser();
  // const (loading, setLoading) = React.useState(true);
  const isLoading = false; // Simulating loading state, replace with actual loading logic if neede
  const [hasPermission, setHasPermission] = React.useState(false);
  const handleDestinationPress = ({latitude, longitude, address}) => {
    // Function to handle destination search
    console.log("Destination search pressed");
    setDestinationLocation(address, longitude, latitude);
    console.log("Destination set to:", address, longitude, latitude);
    navigation.navigate('Ride'); // Navigate to the Ride screen
  };

  useEffect(() => {
    const requestLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        setHasPermission(false);
        return;
      };
      let location = await Location.getCurrentPositionAsync({});

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setUserLocation(
        `${address[0].name}, ${address[0].region}`,
        location.coords.longitude,
        location.coords.latitude
      );
      

      // setUserLocation({
      //   address: `${address[0].name}, ${address[0].region}` ,
      //   longitude: location.coords.longitude,
      //   latitude: location.coords.latitude, 
      //   // longitude:37.78825,
      //   // latitude: -122.4324,  
      // })
    }
    requestLocation();
},[])

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={recentRide.slice(0, 5)} // Display only the first 3 rides
        renderItem={({ item }) => <RideCard ride={item} />}
        keyExtractor={(item) => item.ride_id}
        contentContainerStyle={{ paddingBottom: 70 }} // ✅ This fixes the issue
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {!isLoading? (
              <>
                <Image 
                  source={images.noResult}
                  style={{ width: 200, height: 200, marginBottom: 0 }}
                  alt='No recent rides found'
                  resizeMode='contain'
                />
                <Text style={{ fontSize: 20, color: '#333', marginBottom: 10 }}>No recent rides found !!</Text>

              </>
            ) : (
              <View style={{marginTop: 20}}>
              <ActivityIndicator size="large" color="#000" />
              </View>
              // <Text style={{ fontSize: 18, color: '#666' }}>Loading...</Text>
            )}

          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View style={tw`flex-row items-center px-2 py-2`}>
            {/* <Image
              source={{ uri: user?.imageUrl || 'https://via.placeholder.com/150' }}
              style={{ width: 30, height: 30, borderRadius: 40, marginRight: 10 }}
            /> */}
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Welcome, {user?.fullName || user.emailAddresses[0].emailAddress.split('@')[0]}👋🏻</Text>
            <View style={{  marginLeft: 'auto' }}>
              <SignOutButton />
              {/* <Image 
        source={icons.out}
        style={{ width: 10, height: 10 }} */}
      {/* /> */}
            </View>
          </View>

          <OlaMapTextInput
            icon ={icons.search}
            containerStyle="bg-white shadow-md shadow-neutral-300 "
            handlePress={handleDestinationPress} // Define this function to handle destination search
          />
          <>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10, marginBottom: 10 }}>
                  Your Current Location
                </Text>
                <View style={tw`flex flex-row items-center bg-transparent h-[300px]`}>
                  <Map />
                </View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10, marginBottom: 5, marginTop: 10 }}>
                  Recent Rides
                </Text>
          </>
          </>
        )}
        
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});