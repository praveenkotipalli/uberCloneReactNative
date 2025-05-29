import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { useNavigation } from 'expo-router'
import { Image, Text, TouchableOpacity } from 'react-native'
import { icons } from '../../constants'

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
  const navigation = useNavigation()

  const handleSignOut = async () => {
    try {
      await signOut()
      // Redirect to your desired page
    //   Linking.openURL(Linking.createURL('Signin'))
      navigation.navigate('Signin')
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Text>Sign out</Text>
      
    </TouchableOpacity>
  )
}