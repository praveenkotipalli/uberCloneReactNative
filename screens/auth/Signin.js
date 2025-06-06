import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { images, COLORS, FONTS } from '../../constants';
import OAuth from '../../components/OAuth';
import { useAuth, useSignIn } from '@clerk/clerk-expo';
import { Redirect, useRouter } from 'expo-router';

const Signin = ({ navigation }) => {

  const { isSignedIn } = useAuth()

  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [name, setName] = useState('');

  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()
  


  // const onSignUpPress = () => {}

  useEffect(() => {
    if (isSignedIn) {
      // navigation.navigate/('Tabs');
      // return <Redirect href={'Home'} />
      navigation.reset({
        index: 0,
        // routes: [{ name: 'Home' }], // or 'Main' or 'Dashboard', etc.
        routes: [{ name: 'Tabs' }], // or 'Main' or 'Dashboard', etc.
      });
      
    }
  
  }, [isSignedIn])
  

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }], // or 'Main' or 'Dashboard', etc.
        });
        
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
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
          Welcome to Uber
        </Text>
        
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
          title="Log In"
          onPress={onSignInPress}
          style={{ marginTop: 0 }}
        />

        <OAuth/>

        <View style={styles.loginContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={[styles.loginText, {  }]}>
              New User?{' '}
              <Text style={{  }}>
                Register Now
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

export default Signin;