import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'

const Payment = () => {

    const openPaymentSheet = async () => {

    }
  return (
    <>
        <CustomButton 
            title={"Confirm Ride"}
            onPress={openPaymentSheet}
        />
    </>
  )
}

export default Payment

const styles = StyleSheet.create({})