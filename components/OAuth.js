import React, { useCallback } from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { useSSO, useUser } from '@clerk/clerk-expo';
import CustomButton from './CustomButton';
import { icons, COLORS } from '../constants';

const PORT = process.env.PORT || 3000; // fallback if PORT isn't set

const OAuth = () => {
  const { startSSOFlow } = useSSO();
  const { user } = useUser();

  const handleGoogleSignIn = useCallback(async () => {
    try {
      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });

        const name = user?.fullName ?? '';
        const email = user?.primaryEmailAddress?.emailAddress ?? '';
        const clerkId = user?.id;

        if (!name || !email || !clerkId) {
          console.warn('User data incomplete, not sending to backend.');
          return;
        }

        const userData = { name, email, clerkId };
        console.log('Attempting to store user data in Neon DB:', userData);

        const response = await fetch(`http://${PORT}/api/user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(userData),
        });

        const responseText = await response.text();
        console.log('Raw API Response:', responseText);
      } else {
        console.log('No session created, handle MFA or other flows');
      }
    } catch (err) {
      console.error('OAuth Error:', JSON.stringify(err, null, 2));
    }
  }, [startSSOFlow, user]);

  return (
    <View style={styles.container}>
      <View style={styles.dividerContainer}>
        <View style={styles.divider} />
        <Text style={styles.orText}>Or</Text>
        <View style={styles.divider} />
      </View>

      <CustomButton
        title="Log In with Google"
        onPress={handleGoogleSignIn}
        IconLeft={() => (
          <Image
            source={icons.google}
            style={styles.googleIcon}
            resizeMode="contain"
          />
        )}
        style={styles.googleButton}
        textStyle={styles.googleButtonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray,
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: COLORS.secondary,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    borderRadius: 4,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowOpacity: 0,
    paddingVertical: 10,
  },
  googleButtonText: {
    color: '#222',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
});

export default OAuth;
