import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { images, COLORS, FONTS } from '../../constants';
import OAuth from '../../components/OAuth';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import PendingVerification from './PendingVerification';

const Signup = ({ navigation }) => {

  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')

  const onSignUpPress = async () => {
    if (!isLoaded) return

    console.log(email, password)

    try {
      await signUp.create({
        emailAddress: email,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      console.log('SignUp Attempt Status:', signUpAttempt.status)
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        
        try {
          const userData = {
            name: name,
            email: email,
            clerkId: signUpAttempt.createdUserId,
          };
          
          console.log('Attempting to store user data in Neon DB:', userData);
          
          const response = await fetch('http://192.168.0.192:3000/api/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(userData)
          });

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
          } else {
            console.log('Successfully stored user in Neon DB:', responseData.data);
          }
        } catch (dbError) {
          console.error('Failed to store in Neon DB:', dbError);
        }
        
        router.replace('/')
      } else {
        console.error('SignUp attempt not complete:', JSON.stringify(signUpAttempt, null, 2))
      }
    } catch (err) {
      console.error('Verification error:', JSON.stringify(err, null, 2))
    }
  }

  if (pendingVerification) {
    return (
      <PendingVerification
        code={code}
        setCode={setCode}
        onVerifyPress={onVerifyPress}
        loading={false}
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
        <Text style={[styles.title, { fontFamily: FONTS.bold }]}>
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
            <Text style={styles.loginText}>
              Already have an account?{' '}
              <Text>
                Log In
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
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
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 15,
  },
  loginContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
  },
});

export default Signup;
