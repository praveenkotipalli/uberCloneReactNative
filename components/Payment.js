import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from './CustomButton'
import { useStripe } from '@stripe/stripe-react-native';
import { useLocationStore } from '../store';
import { useUser } from '@clerk/clerk-expo';
import { useAuth } from '@clerk/clerk-expo';

const API_URL = 'http:///10.56.2.157:3000'; // Replace with your backend URL
// const API_URL = 'http://192.168.195.96:3000';
// const API_URL = 'http://10.56.10.10:3000'; // Replace with your backend URL
const Payment = ({fullName, email, amount, driverId, rideTime}) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [sheetReady, setSheetReady] = useState(false);
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
      Alert.alert('Success', 'Payment confirmed!');
  
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
    <CustomButton title="Confirm Ride" 
    // disabled={!amount} 
    onPress={openSheet} />
  );
}

export default Payment

const styles = StyleSheet.create({})