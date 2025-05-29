import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo';
import { SignOutButton } from '../auth/SignOutBotton';
// import { SignOutButton } from './auth/SignOutBotton';


const HomeScreen = () => {

  const { user } = useUser();
  return (
    <View>
      <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
      <SignOutButton />
      <Text className={"text-red-500"}>HomeScreen</Text>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})