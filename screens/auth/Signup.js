import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import tw from 'twrnc';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { images, COLORS, FONTS } from '../../constants';
import OAuth from '../../components/OAuth';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import PendingVerification from './PendingVerification';
import { fetchAPI } from '../../api/fetch';

const Signup = ({ navigation }) => {

  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) return

    console.log(email, password)

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: email,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      console.log('SignUp Attempt Status:', signUpAttempt.status)
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        
        // Store user data in Neon DB
        try {
          const userData = {
            name: name,
            email: email,
            clerkId: signUpAttempt.createdUserId,
          };
          
          console.log('Attempting to store user data in Neon DB:', userData);
          
          // Use the correct API endpoint
          const response = await fetch('http://192.168.0.192:8081/api/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
          });

          // Log the raw response for debugging
          const responseText = await response.text();
          console.log('Raw API Response:', responseText);

          let responseData;
          try {
            responseData = JSON.parse(responseText);
          } catch (parseError) {
            console.error('Failed to parse API response:', parseError);
            throw new Error('Invalid API response format');
          }

          console.log('Neon DB Storage Response:', responseData);
          
          if (!response.ok) {
            throw new Error(responseData.error || 'Failed to store user data');
          }
          
          if (responseData.error) {
            console.error('Error storing in Neon DB:', responseData.error);
            // You might want to show an error message to the user here
          } else {
            console.log('Successfully stored user in Neon DB:', responseData.data);
          }
        } catch (dbError) {
          console.error('Failed to store in Neon DB:', dbError);
          // You might want to show an error message to the user here
        }
        
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error('SignUp attempt not complete:', JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error('Verification error:', JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <PendingVerification
        code={code}
        setCode={setCode}
        onVerifyPress={onVerifyPress}
        loading={false} // set to `true` during API call if needed
      />
    );
  }


  return (
    <ScrollView style={[styles.container, tw`bg-white`]}>
      <View style={styles.imageContainer}>
        <Image 
          source={images.signUpCar} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={[styles.title, { fontFamily:FONTS.bold }]}>
          Create Account
        </Text>
        
        <CustomInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />

        <CustomInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <CustomInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <CustomButton
          title="Sign Up"
          onPress={onSignUpPress}
          style={{ marginTop: 0 }}
        />

        <OAuth/>

        <View style={styles.loginContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Signin')}>
            <Text style={[styles.loginText, {  }]}>
              Already have an account?{' '}
              <Text style={{  }}>
                Log In
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* <Verification Model/> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    // padding: 20,
    padding: 20,
    // marginBottom: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 15,
    // color: COLORS.primary,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loginContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    // color: COLORS.secondary,
  },
});

export default Signup;