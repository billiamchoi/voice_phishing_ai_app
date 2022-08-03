import React from "react"
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Mypage from "../screens/MyPage/MyPage"


const Stack = createNativeStackNavigator()

function MyPageStack(props) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Mypage" component={Mypage} options={{headerShown:false}}/>
    </Stack.Navigator>
  )
}


export default MyPageStack