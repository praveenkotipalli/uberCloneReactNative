import React, { useEffect, useRef } from 'react';
import { Text, TextInput, Keyboard, TouchableWithoutFeedback, View } from 'react-native';
import { useLocationStore } from '../../store';
import tw from 'twrnc';
import RideLayout from '../../components/RideLayout';
import OlaMapTextInput from '../../components/OlaMapTextInput';

import { FONTS } from '../../constants';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from 'expo-router';

const FindRideScreen = () => {
  const {
    userAddress,
    destinationAddress,
    setDestinationAddress,
    setUserAddress,
  } = useLocationStore();

  const bottomSheetRef = useRef(null);

  useEffect(() => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(0); // index 0 = 40%
    }
  }, [])
  
  const handleFocus = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.expand();
    }
  };

  const navigation = useNavigation();;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <RideLayout title="Go Back" bottomSheetRef={bottomSheetRef}>
        <View>
          {/* <Text style={tw`text-2xl font-bold mb-2`}>Find a Ride</Text> */}
          {/* <Text style={tw`text-2xl fo mb-2 `}>From</Text> */}
          <Text style={{fontFamily: "Jakarta-SemiBold", fontSize: 23, marginBottom: 2}}>From</Text> 
          <TextInput
            value={userAddress}
            onChangeText={setUserAddress}
            onFocus={handleFocus}
            placeholder="Enter pickup location"
            style={tw`border border-gray-300 rounded-xl p-3 mb-4`}
          />

<Text style={{fontFamily: "Jakarta-SemiBold", fontSize: 23, marginBottom: 2}}>To</Text> 
          <TextInput
            value={destinationAddress}
            onChangeText={setDestinationAddress}
            onFocus={handleFocus}
            placeholder="Enter destination"
            style={tw`border border-gray-300 rounded-xl p-3`}
          />
        </View>

        <CustomButton 
          title="Find Ride"
          onPress={() => {
            // Handle find ride logic here
            navigation.navigate('ConfirmRide');
          }}
          style={tw`mt-4`}
        />
      </RideLayout>
    </TouchableWithoutFeedback>
  );
};

export default FindRideScreen;
