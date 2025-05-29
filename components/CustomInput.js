import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import tw from 'twrnc';

const CustomInput = ({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry,
  keyboardType = 'default'
}) => {
  return (
    <View style={[styles.container, tw`mb-4`]}>
      <TextInput
        style={[styles.input, { fontFamily: 'Jakarta-Regular' }]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholderTextColor="#666"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    backgroundColor: '#F5F5F5', 
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
});

export default CustomInput; 