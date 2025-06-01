import { View, Text } from 'react-native';
import React from 'react';
import { useLocationStore } from '../../store';
import tw from 'twrnc';

const RidesScreen = () => {
  const {
    userAddress,
    destinationAddress,
    setDestinationAddress,
    setUserAddress,
  }  = useLocationStore();
  return (
    <View className="flex-1 items-center justify-center">
      <Text style={tw`text-2xl`}>You are here: {userAddress}</Text>
      <Text style={tw`text-2xl`}>Destination: {destinationAddress}</Text>
    </View>
  );
};

export default RidesScreen; 