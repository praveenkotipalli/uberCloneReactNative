import { Alert, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomButton from './CustomButton'
import { useStripe } from '@stripe/stripe-react-native';

const API_URL = 'http://192.168.0.192:3000'; // Replace with your backend URL
// const API_URL = 'http://192.168.195.96:3000';
// const API_URL = 'http://10.56.10.10:3000'; // Replace with your backend URL
const Payment = ({fullName, email, amount, driverId, rideTime}) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [sheetReady, setSheetReady] = useState(false);

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
    if (!sheetReady) await initSheet(); // first-time init
    const { error } = await presentPaymentSheet();
    if (error) Alert.alert(`Error ${error.code}`, error.message);
    else Alert.alert('Success', 'Payment confirmed!');
  };

  return (
    <CustomButton title="Confirm Ride" 
    // disabled={!amount} 
    onPress={openSheet} />
  );
}

export default Payment

const styles = StyleSheet.create({})