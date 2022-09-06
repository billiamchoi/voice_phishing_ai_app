import React, { Component } from "react"
import { Text, View, StyleSheet } from "react-native";
import { v4 as uuidv4 } from 'uuid';

export default class TextBox extends Component {
  
  setHighlight = (string, array) => {
    let returnValue = []
    let tmp = 0
    if(array.length === 0){
      return string
    }
    for (let i = 0; i < (array.length)/2; i++) {
      let firstIdx = string.slice(tmp, array[2*i])
      let seg = string.slice(array[2*i], array[2*i+1])
      let firstText = <Text key={uuidv4()}>{firstIdx}</Text>
      let segText = <Text key={uuidv4()} style={styles.highlighted}>{seg}</Text>
      returnValue.push(firstText,segText)
      tmp = array[2*i+1]
    }
    let lastIdx = string.slice(tmp, string.length)
    let lastText = <Text key={uuidv4()}>{lastIdx}</Text>
    returnValue.push(lastText)
    return returnValue
  }

  render = () => {
    return(
      <View style={styles.textBox}>
        {this.props.partialResults.map((result, index) => {
          const hightlightText = this.setHighlight(result,this.props.highlight)
          return (
            <Text style={styles.resultText} key={`partial-result-${index}`}>
              { hightlightText }
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
  },
  highlighted: {
    padding:2,
    backgroundColor: 'red',
  },
})