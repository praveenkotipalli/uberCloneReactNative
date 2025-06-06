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
    car_seat_count,
  },
}) => {
  return (
    <ScrollView style={tw`bg-white rounded-2xl shadow-lg m-4 p-4`}>
      {/* Map and Route Info */}
      <View style={tw`flex-row items-center`}>
        <Image
          source={{
            uri: `https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=300&height=200&center=lonlat:${destination_longitude},${destination_latitude}&zoom=14&apiKey=${process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY}`,
          }}
          style={tw`w-28 h-28 rounded-xl border border-gray-200`}
        />

        <View style={tw`ml-4 flex-1`}>
          <View style={tw`flex-row items-center mb-3`}>
            <Image source={icons.to} style={tw`w-4 h-4 mr-2`} />
            <Text style={tw`text-base font-semibold text-gray-800`} numberOfLines={1}>
              {origin_address}
            </Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <Image source={icons.point} style={tw`w-4 h-4 mr-2`} />
            <Text style={tw`text-base font-semibold text-gray-800`} numberOfLines={1}>
              {destination_address}
            </Text>
          </View>
        </View>
      </View>

      {/* Date, Time, Info */}
      <View style={tw`mt-5 bg-blue-600 rounded-xl px-4 py-3`}>
        <View style={tw`flex-row justify-between items-center mb-2`}>
          <Text style={tw`text-white font-bold`}>📅 Date & 🕒 Time</Text>
          <Text style={tw`text-white text-sm`}>
            {formatDate(created_at)}, {ride_time}
          </Text>
        </View>

        <View style={tw`h-px bg-white/30 my-2`} />

        <View style={tw`flex-row flex-wrap gap-2 justify-between items-center`}>
          <View style={tw`px-3 py-1 rounded-full bg-white`}>
            <Text style={tw`text-sm font-semibold text-blue-600`}>👤 {driver.first_name}</Text>
          </View>

          

          <View
            style={tw`px-3 py-1 rounded-full ${
              payment_status === 'paid' ? 'bg-red-100' : 'bg-green-100'
            }`}
          >
            <Text
              style={tw`text-sm font-semibold ${
                payment_status === 'paid' ? 'text-red-700' : 'text-green-700'
              }`}
            >
              💳 {payment_status || 'Unpaid'}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default RideCard;

const styles = StyleSheet.create({});
