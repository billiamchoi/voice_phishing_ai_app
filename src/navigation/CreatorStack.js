import React from "react"
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Creator from '../screens/Creator/Creator'


const Stack = createNativeStackNavigator()

function CreatorStack(props) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Invoice" component={Creator} options={{headerShown:false}}/>
    </Stack.Navigator>
  )
}


export default CreatorStack