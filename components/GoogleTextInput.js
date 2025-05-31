import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import tw from 'twrnc';

const GoogleTextInput = ({
    icon, 
    initialLocation, 
    containerStyle,
    textInputBackgroundColor,
    handlePress
}) => {
  return (
    <View style={tw`flex flex-row items-center justify-center relative z-50 rounded-xl ${containerStyle} mb-2 shadow-md shadow-neutral-300`}>
      <Text>Search</Text>
    </View>
  )
}

export default GoogleTextInput

const styles = StyleSheet.create({})