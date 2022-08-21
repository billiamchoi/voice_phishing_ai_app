import React, { Component } from "react"
import { Text, View, StyleSheet } from "react-native";

export default class TextBox extends Component {
  render = () => {
    return(
      <View style={styles.textBox}>
        {this.props.partialResults.map((result, index) => {
          return (
            <Text style={styles.resultText} key={`partial-result-${index}`}>
              {result}
            </Text>
          )
        })}
    </View>
    )
  }
}


const styles = StyleSheet.create({
  textBox: {
    marginTop: 10,
    width: 330,
    height: 400,
    backgroundColor: "white",
    borderWidth: 2,
    padding: 10,
    borderColor: "dodgerblue"
  },
  resultText: {
    fontSize: 18
  }
})