import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { icons } from '../constants';
import { formatDate } from './util';

const RideCard = ({
  ride: {
    destination_longitude,
    destination_latitude,
    origin_address,
    destination_address,
    created_at,
    ride_time,
    driver,
    payment_status,
    car_seat_count // assume this is available in the ride object
  },
}) => {
  return (
    <ScrollView style={tw`bg-white rounded-xl shadow-md m-3 p-4 `}>
      {/* Driver Name at Top */}
      {/* <Text style={tw`text-xl font-bold mb-2 text-center`}>
        {driver.first_name}
      </Text> */}

      {/* Map and Route Info */}
      <View style={tw`flex-row`}>
        <Image
          source={{
            uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=300&height=200&center=lonlat:${destination_longitude},${destination_latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
          }}
          style={tw`w-24 h-24 rounded-lg`}
        />

        <View style={tw`ml-4 flex-1 justify-center`}>
          <View style={tw`flex-row items-start mb-2`}>
            <Image source={icons.to} style={tw`w-3 h-3 mt-1 mr-2`} />
            <Text style={tw`text-sm font-medium`} numberOfLines={1}>
              {origin_address}
            </Text>
          </View>
          <View style={tw`flex-row items-start`}>
            <Image source={icons.point} style={tw`w-3 h-3 mt-1 mr-2`} />
            <Text style={tw`text-sm font-medium`} numberOfLines={1}>
              {destination_address}
            </Text>
          </View>
        </View>
      </View>

      {/* Date & Time + Extra Info */}
      <View style={tw`mt-4 bg-blue-500 rounded-lg p-3`}>
        <View style={tw`flex-row justify-between mb-2`}>
          <Text style={tw`text-white text-sm font-semibold`}>Date & Time</Text>
          <Text style={tw`text-white text-sm font-medium`}>
            {formatDate(created_at)}, {ride_time}
          </Text>
        </View>

        {/* Additional Info: Driver, Car Seats, Payment */}
        <View style={tw`flex-row justify-between mt-3`}>
          <Text style={tw`text-white text-sm`}>👤 {driver.first_name}</Text>
          <Text style={tw`text-white text-sm`}>🪑 {driver.car_seats || 'N/A'} seats</Text>
          <Text
  style={tw`text-sm capitalize ${
    payment_status === 'paid' ? 'text-green-500' : 'text-red-500'
  }`}
>
  💳 {payment_status || 'Unpaid'}
</Text>

        </View>
      </View>
    </ScrollView>
  );
};

export default RideCard;

const styles = StyleSheet.create({});
