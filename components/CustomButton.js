import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import FONTS from '../constants/fonts';
// import { COLORS, FONTS } from '../constants';

const CustomButton = ({ 
  title, 
  onPress, 
  style, 
  textStyle,
  disabled = false 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        disabled && styles.disabledButton
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, textStyle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: FONTS.regular, // Assuming FONTS is defined in your constants
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default CustomButton; 