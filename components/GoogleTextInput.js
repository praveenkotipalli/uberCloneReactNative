import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import tw from 'twrnc';

import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const GoogleTextInput = ({
    icon, 
    initialLocation, 
    containerStyle,
    textInputBackgroundColor,
    handlePress
}) => {
  return (
    <View style={tw`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle} mb-2 shadow-md shadow-neutral-300`}>
      {/* <GooglePlacesAutocomplete 
        placeholder='Where to?'
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
        }}
        query={{
          key: process.env.EXPO_PUBLIC_GOOGLE_API_KEY,
          language: 'en',
        }}
      /> */}
    </View>
  )
}

export default GoogleTextInput

const styles = StyleSheet.create({})