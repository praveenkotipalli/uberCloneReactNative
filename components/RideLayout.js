import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import tw from 'twrnc'
import { router, useNavigation } from 'expo-router'
import { icons } from '../constants'
import Map from './Map'
// import { BottomTabBar } from '@react-navigation/bottom-tabs'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
const RideLayout = ({ title, children, bottomSheetRef }) => {
    const navigation = useNavigation();
  
    return (
      <GestureHandlerRootView>
        <View style={tw`flex-1 bg-white `}>
          <View style={tw`flex flex-col h-screen`}>
            <View style={tw`flex flex-row absolute z-1 top-3 pl-4`}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={tw`bg-white rounded-full w-8 h-8 justify-center`}>
                  <Image
                    source={icons.backArrow}
                    resizeMode="contain"
                    style={tw`w-5 h-5 m-auto`}
                  />
                </View>
              </TouchableOpacity>
              <Text style={{ fontFamily: 'Jakarta-SemiBold', fontSize: 20, paddingLeft: 4 }}>
                {title || 'Go Back'}
              </Text>
            </View>
            <Map />
          </View>
  
          <BottomSheet
            ref={bottomSheetRef}
            index={2}
            snapPoints={['40%', '70%']}
            handleIndicatorStyle={{ backgroundColor: '#000' }}
            style={tw`bg-white rounded-t-3xl shadow-lg z-20`}
          >
            <BottomSheetView style={tw`flex-1 p-2 z-10`}>
              {children}
            </BottomSheetView>
          </BottomSheet>
        </View>
      </GestureHandlerRootView>
    );
  };
  

export default RideLayout

const styles = StyleSheet.create({})


// mak the bottomSheet on top of all ootheer layoouts