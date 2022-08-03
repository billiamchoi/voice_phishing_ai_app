import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Invoice from "./components/screens/Invoice/Invoice"

const Stack = createNativeStackNavigator()

function MyStack(props) {
  return (
    <Stack.Navigator initialRouteName="Invoice" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Invoice" component={ Invoice } />
    </Stack.Navigator>
  )
}

const RootNavigator = props => {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  )
}

export default RootNavigator