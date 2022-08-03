import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Invoice from "./components/screens/Invoice/Invoice"
import Mypage from "./components/screens/MyPage/MyPage"

const Stack = createNativeStackNavigator()

function MyStack(props) {
  return (
    <Stack.Navigator initialRouteName="Invoice" >
      <Stack.Screen name="Invoice" component={ Invoice } />
      <Stack.Screen name="Mypage" component={ Mypage } />
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