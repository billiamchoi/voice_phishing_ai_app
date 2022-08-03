import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { Appstack } from "./components/navigations"



const RootNavigator = props => {
  return (
    <NavigationContainer>
      <Appstack />
    </NavigationContainer>
  )
}

export default RootNavigator