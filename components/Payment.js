import { Alert, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from './CustomButton'
import { useStripe } from '@stripe/stripe-react-native';
import { useLocationStore } from '../store';
import { useUser } from '@clerk/clerk-expo';
import { useAuth } from '@clerk/clerk-expo';
import { images } from '../constants';
import ReactNativeModal from 'react-native-modal';
import { useNavigation } from 'expo-router';
import tw from 'twrnc';


const API_URL = `http://${process.env.PORT}`; // Replace with your backend URL
// const API_URL = 'http://192.168.195.96:3000';
// const API_URL = 'http://10.56.10.10:3000'; // Replace with your backend URL
const Payment = ({fullName, email, amount, driverId, rideTime}) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [sheetReady, setSheetReady] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setSuccess(false);
  }, [])
  

  const navigation = useNavigation();
  const  {
    userAddress,
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationAddress,
    destinationLongitude,
  } = useLocationStore();

  const {userId} = useAuth();
  /* fetch params from backend with dynamic data */
  const fetchParams = async () => {
    const res = await fetch(`${API_URL}/payment-sheet`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, fullName, email, driverId, rideTime }),
    });

    
    if (!res.ok) throw new Error('Server error');
    return res.json();          // { paymentIntent, ephemeralKey, customer }
  };

  const initSheet = async () => {
    try {
      const { paymentIntent, ephemeralKey, customer } = await fetchParams();
      const { error } = await initPaymentSheet({
        merchantDisplayName: 'Your App',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        defaultBillingDetails: { name: fullName, email },
        allowsDelayedPaymentMethods: true,
      });
      if (!error) setSheetReady(true);
      else Alert.alert('Stripe error', error.message);
    } catch (e) {
      Alert.alert('Init failed', e.message);
    }
  };

  const openSheet = async () => {
    if (!sheetReady) await initSheet();
  
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error ${error.code}`, error.message);
    } else {
      setSuccess(true);
  
      // Only now, call /api/rides to store the ride
      const rideRes = await fetch(`${API_URL}/api/rides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin_address : userAddress,
          destination_address : destinationAddress,
          origin_latitude : userLatitude,
          origin_longitude : userLongitude,
          destination_latitude : destinationLatitude,
          destination_longitude : destinationLongitude,
          ride_time: rideTime,
          fare_price: amount,
          payment_status: 'success',
          driver_id: driverId,
          user_id : userId, // Assuming user.id is available
        }),
      });
  
      const rideData = await rideRes.json();
      console.log("Ride saved:", rideData);
    }
  };
  

  return (
    <>
    
    <CustomButton title="Confirm Ride" 
    disabled={!amount} 
    onPress={openSheet} />
<ReactNativeModal
      isVisible={success}
      onBackdropPress={() => setSuccess(false)}
      style={{zIndex:1100}}
    >
      <View style={tw`flex flex-col items-center justify-center bg-white p-7 rounded-2xl`}>
        <Image source={images.check} style={tw`w-28 h-28 mt-5`} />

        <Text style={tw`text-2xl text-center font-bold mt-5`}>
          Booking placed successfully
        </Text>

        <Text style={tw`text-base text-gray-500 text-center mt-3`}>
          Thank you for your booking. Your reservation has been successfully
          placed. Please proceed with your trip.
        </Text>

        <CustomButton
          title="Back Home"
          onPress={() => {
            setSuccess(false);
            navigation.navigate('Tabs');
          }}
          style={tw`mt-5`}
        />
      </View>
    </ReactNativeModal>

    </>
    
  );
}

export default Payment

const styles = StyleSheet.create({})