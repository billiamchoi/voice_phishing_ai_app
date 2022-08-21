import React, { Component } from "react"
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class RecordButton extends Component {
  render = () => {
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

