import React, { Component } from "react"
import { Text, View, StyleSheet} from "react-native";
import { Sizes, Colors } from "../../../styles";
export default class TextBox extends Component {
  
  render = () => {
    return(
      <View style={styles.textBox}>
        <Text style={styles.resultText}>
              { this.props.partialResults[0] }
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  textBox: {
    marginTop: 20,
    width: 330,
    height: 410,
    backgroundColor: "#D8E1E7",
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.BorderColor,
  },
  resultText: {
    fontSize: Sizes.Invoice.TextBoxFontSize,
    color: "#2A321F"
  }
})