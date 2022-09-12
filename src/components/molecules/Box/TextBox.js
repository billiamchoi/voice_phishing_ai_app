import React, { Component } from "react"
import { Text, View, StyleSheet} from "react-native";
import { v4 as uuidv4 } from 'uuid';
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
    backgroundColor: Colors.Default.White,
    borderWidth: 1,
    padding: 10,
    borderColor: Colors.BorderColor,
  },
  resultText: {
    fontSize: Sizes.Invoice.TextBoxFontSize
  }
})