import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import tw from 'twrnc';

const DriverCard = ({
  driver: {
    id,
    profile_image_url,
    first_name,
    last_name,
    rating,
    car_seats,
    car_image_url,
    time,     // in minutes
    price     // in currency (assumed to be ₹)
  },
  selected,
  setSelected
}) => {
  const isSelected = selected === id;

  return (
    <TouchableOpacity
      onPress={setSelected}
      style={[
        tw`flex-row items-center p-3 mx-3 my-1 rounded-lg border border-gray-200`,
        isSelected && tw`bg-green-50 border-green-200`
      ]}
    >
      <Image
        source={{ uri: profile_image_url }}
        style={tw`w-12 h-12 rounded-full mr-3`}
      />
      
      <View style={tw`flex-1`}>
        <View style={tw`flex-row justify-between items-center`}>
          <Text style={tw`text-base font-semibold`}>
            {first_name} {last_name}
          </Text>
          <Text style={tw`text-yellow-500`}>⭐ {rating}</Text>
        </View>
        
        <View style={tw`flex-row justify-between mt-1`}>
          <Text style={tw`text-gray-500 text-sm`}>{car_seats} seats</Text>
          {time && <Text style={tw`text-gray-500 text-sm`}>{Math.round(time)} min away</Text>}
        </View>
        
        {price && (
          <Text style={tw`text-green-600 font-medium mt-1`}>₹{price}</Text>
        )}
      </View>
      
      <Image
        source={{ uri: car_image_url }}
        style={tw`w-16 h-12 rounded ml-2`}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default DriverCard;