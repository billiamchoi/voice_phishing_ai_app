import React, { Component } from "react"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StyleSheet, View, Image } from 'react-native'

export default class RecordButton extends Component {
  render = () => {
    if(this.props.isFetching){
      console.log("트루프랍스",this.props.isFetching)
      return(
          <Image
            style={styles.logo}
            source={require('../../../Assets/Images/loading.gif')}
          />
      )
    } else{
      console.log("프랍스",this.props.isFetching)
      return (
          <Ionicons
            onPress={this.props.isRecording ? this.props.onStop : this.props.onStart}
            name={this.props.isRecording ? "stop-circle-outline" : "mic-circle-outline"}
            size={this.props.size}
            color={this.props.isRecording ? "red" : "dodgerblue"}
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

