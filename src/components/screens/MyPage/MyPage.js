import React, { Component } from "react"
import { StyleSheet, Text, View } from "react-native"

class Mypage extends Component {

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          여기가 마이페이지라구 여러분~ 환영해 
        </Text>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
})

export default Mypage