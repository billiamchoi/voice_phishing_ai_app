import React, { Component } from "react"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StyleSheet, View, Image } from 'react-native'
import { Colors } from "../../../styles"
export default class RecordButton extends Component {
  render = () => {
    if(this.props.isFetching){
      return(
          <Image
            style={styles.logo}
            source={require('../../../assets/Images/loading.gif')}
          />
      )
    } else{
      return (
          <Ionicons
            onPress={this.props.isRecording ? this.props.onStop : this.props.onStart}
            name={this.props.isRecording ? "stop-circle-outline" : "mic-circle-outline"}
            size={this.props.size}
            color={this.props.isRecording ? Colors.IconColor[1] : Colors.IconColor[0]}
          />
      )
    }
  }
}

const styles = StyleSheet.create({
  logo: {
    width: 300,
    height: 55,
    margin: 25
  }
})

