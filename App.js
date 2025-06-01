import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import tw from 'twrnc';
// import HomeScreen from './screens/HomeScreen';
import SplashScreen from './screens/SplashScreen';
import Signup from './screens/auth/Signup';
import Signin from './screens/auth/Signin';
import { ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import { secureStore } from '@clerk/clerk-expo/secure-store';
import { useSignUp } from '@clerk/clerk-expo';
import { useState } from 'react';
import {  Text, TextInput, TouchableOpacity } from 'react-native';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import HomeScreen from './screens/tabs/HomeScreen';
// import Layout from './screens/tabs';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import RidesScreen from './screens/tabs/RidesScreen';
// import ChatsScreen from './screens/tabs/ChatsScreen';
// import ProfileScreen from './screens/tabs/ProfileScreen';
import Tabs from './screens/tabs';
// import Signup from './auth/signup';
// import Signup from './auth/signup';

// const tokenCacheConfig = tokenCache(secureStore);


export default function App() {
  const [fontsLoaded] = useFonts({
    "Jakarta-Bold": require("./assets/fonts/PlusJakartaSans-Bold.ttf"),
    "Jakarta-ExtraBold": require("./assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "Jakarta-ExtraLight": require("./assets/fonts/PlusJakartaSans-ExtraLight.ttf"),
    "Jakarta-Light": require("./assets/fonts/PlusJakartaSans-Light.ttf"),
    "Jakarta-Medium": require("./assets/fonts/PlusJakartaSans-Medium.ttf"),
    "Jakarta-Regular": require("./assets/fonts/PlusJakartaSans-Regular.ttf"),
    "Jakarta-SemiBold": require("./assets/fonts/PlusJakartaSans-SemiBold.ttf"),
  });

  const Stack = createStackNavigator();

  if (!fontsLoaded) {
    return (
      <View style={[styles.container, tw`bg-white`]}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ClerkProvider tokenCache={tokenCache} >
      <NavigationContainer>
      <SafeAreaView style={tw`flex-1 bg-gray-100`}>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen 
            name="Splash" 
            component={SplashScreen} 
            options={{ headerShown: false }} 
          />

<Stack.Screen
         name="Signin" 
         component={Signin} 
         options={{ headerShown: false }}
      />
         <Stack.Screen
            name="Signup" 
            component={Signup} 
            options={{ headerShown: false }}
         />
         
          {/* <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }} 
          /> */}

          <Stack.Screen 
            name="Tabs" 
            component={Tabs} 
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </SafeAreaView>
    </NavigationContainer>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
