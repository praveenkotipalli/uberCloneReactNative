import React from 'react';
import { Alert, Image, Text, View, StyleSheet } from "react-native";
import CustomButton from "./CustomButton";
import { icons, COLORS } from "../constants";
import tw from "twrnc";

const OAuth = () => {
  const handleGoogleSignIn = async () => {
    try {
      // TODO: Implement Google OAuth
      console.log('Google Sign In pressed');
    } catch (error) {
      console.error('Google Sign In Error:', error);
    }
  };

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
        // IconLeft={() => (
        //   <Image
        //     source={icons.google}
        //     style={styles.googleIcon}
        //     resizeMode="contain"
        //   />
        // )}
        
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
    marginTop: 0,
    paddingVertical: 10,
    // paddingHorizontal: 16,
  },
  googleButtonText: {
    color: '#222',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
    // paddingBottom: 5,
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
});

export default OAuth;