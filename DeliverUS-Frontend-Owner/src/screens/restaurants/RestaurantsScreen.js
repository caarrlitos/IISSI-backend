import React, { useEffect, useState } from 'react'
import { StyleSheet, View, FlatList, Pressable } from 'react-native'
import TextRegular from '../../components/TextRegular'
import { getAll } from '../../api/RestaurantEndpoints'
import * as GlobalStyles from '../../styles/GlobalStyles'
import TextSemiBold from '../../components/TextSemibold'
import { API_BASE_URL } from '@env'
import restaurantLogo from '../../../assets/restaurantLogo.jpeg'

export default function RestaurantsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TextRegular style={{ fontSize: 16, alignSelf: 'center', margin: 20 }}>Random Restaurant</TextRegular>
      <Pressable
        onPress={() => {
          navigation.navigate('RestaurantDetailScreen', { id: Math.floor(Math.random() * 100) })
        }}
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? GlobalStyles.brandBlueTap
              : GlobalStyles.brandBlue
          },
          styles.actionButton
        ]}
      >
        <TextRegular textStyle={styles.text}>
          Go to Random Restaurant Details
        </TextRegular>
      </Pressable>
    </View>
  )
}