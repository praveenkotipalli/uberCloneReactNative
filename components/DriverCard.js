import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

import tw from 'twrnc'

const DriverCard = ({driver: {
    profile_image_url,
    first_name,
    last_name,
    rating,
    car_seats,
    car_image_url

}}) => {
  return (
    <View>
      <TouchableOpacity
              style={tw`bg-white rounded-xl shadow-md mb-4 p-4 flex-row`}
            >
              <Image
                source={{ uri: profile_image_url }}
                style={tw`w-16 h-16 rounded-full mr-4`}
              />
              <View style={tw`flex-1`}>
                <Text style={tw`text-lg font-bold`}>
                  {first_name} {last_name}
                </Text>
                <Text style={tw`text-gray-600`}>Rating: ⭐ {rating}</Text>
                <Text style={tw`text-gray-600`}>Seats Available: {car_seats}</Text>
              </View>
              <Image
                source={{ uri: car_image_url }}
                style={tw`w-20 h-16 rounded-lg ml-2`}
                resizeMode="cover"
              />
            </TouchableOpacity>
    </View>
  )
}

export default DriverCard

const styles = StyleSheet.create({})