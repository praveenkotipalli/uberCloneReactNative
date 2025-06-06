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
import { router, useNavigation, useRouter } from 'expo-router';

const PORT = process.env.PORT;


const HomeScreen = () => {

  const navigation = useNavigation();
  const router = useRouter();

  const [recentRide, setRecentRide] = React.useState([]);

  const { setUserLocation, setDestinationLocation } = useLocationStore();
  // const destinationLocation = useLocationStore((state) => state.destinationLocation);
  const { user } = useUser();
  // const (loading, setLoading) = React.useState(true);
  const isLoading = false; // Simulating loading state, replace with actual loading logic if neede
  const [hasPermission, setHasPermission] = React.useState(false);
  const handleDestinationPress = ({latitude, longitude, address}) => {
    // Function to handle destination search
    // console.log("Destination search pressed");
    setDestinationLocation(address, longitude, latitude);
    // console.log("Destination set to:", address, longitude, latitude);
    // navigation.navigate('Ride'); // Navigate to the Ride screen
    navigation.navigate('FindRide'); // Use expo-router to navigate to the FindRideScreen
  };

  // useEffect(() => {
    
  // }, [recentRide]);

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

    const userId = user?.id?.trim()

    const fetchRiders = async () => {
      try {
        // setLoadingDrivers(true);
        // const response = await fetch('http://192.168.0.192:3000/api/drivers');
        // const response = await fetch('http:///10.56.50.201:3000/api/drivers');
        console.log('Fetching recent rides for user:', userId);
        if (!user?.id) return;
        

        const response = await fetch(`http://${PORT}/api/user/${userId}/rides`);
        const json = await response.json();
        const rides = json.data;

        setRecentRide(rides);
        // console.log('Recent rides fetched:', rides);
        // setDrivers(driverData);
      } catch (error) {
        console.error('Failed to fetch recent rides:', error);
      } finally {
        // setLoadingDrivers(false);
      }
    };

    fetchRiders();
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
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Welcome, {user?.fullName || user?.emailAddresses[0].emailAddress.split('@')[0]}👋🏻</Text>
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
            containerStyle="bg-white shadow-md shadow-neutral-300  "
            handlePress={handleDestinationPress} // Define this function to handle destination search
          />
          <>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10, marginBottom: 10, marginTop: 4}}>
                  Your Current Location
                </Text>
                <View style={{ marginHorizontal: 14, marginTop: 4, marginBottom: 4, borderRadius: 10, overflow: 'hidden' }}>
  <View style={[tw`h-[300px]`, { borderRadius: 10 }]}>
    <Map />
  </View>
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