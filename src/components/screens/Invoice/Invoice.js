import React, { Component } from "react"
import { StyleSheet, Text, View, Image, TouchableHighlight } from "react-native"
import Voice from "@react-native-voice/voice"
import { Buffer } from 'buffer'
import Permissions from 'react-native-permissions';
import Sound from 'react-native-sound';
import AudioRecord from 'react-native-audio-record';
import axios from "axios"


// const baseUrl = "http://10.0.2.2:5000"
const baseUrl = "http://127.0.0.1:5000"
class Invoice extends Component {
  sound = null
  state = {
    recognized: "",
    pitch: "",
    error: "",
    end: "",
    started: "",
    results: [],
    partialResults: [],
    audioFile: '',
    recording: false,
    loaded: false,
    paused: true
  }

  constructor(props) {
    super(props)
    Voice.onSpeechStart = this.onSpeechStart
    Voice.onSpeechRecognized = this.onSpeechRecognized
    Voice.onSpeechEnd = this.onSpeechEnd
    Voice.onSpeechError = this.onSpeechError
    Voice.onSpeechResults = this.onSpeechResults
    Voice.onSpeechPartialResults = this.onSpeechPartialResults
    Voice.onSpeechVolumeChanged = this.onSpeechVolumeChanged
  }

  async componentDidMount() {
    await this.checkPermission();

    const options = {
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      wavFile: 'test.wav'
    };

    AudioRecord.init(options);


  }

  componentWillUnmount() {
    Voice.destroy().then(Voice.removeAllListeners)
  }

  requestPermission = async () => {
    const p = await Permissions.request('microphone');
    console.log('permission request', p);
  };

  checkPermission = async () => {
    const p = await Permissions.check('microphone');
    console.log('permission check', p);
    if (p === 'authorized') return;
    return this.requestPermission();
  };

  start = () => {
    console.log('start record');
    this.setState({ audioFile: '', recording: true, loaded: false });
    AudioRecord.start();
  };

  stop = async () => {
    if (!this.state.recording) return;
    console.log('stop record');
    let audioFile = await AudioRecord.stop();
    let audio = {
      uri: `file://${audioFile}`,
      type: 'audio/wav',
      // uuid를 사용하여 이름을 유일하게 바꿀 필요가 있음 (중요도 하) 
      name: 'test'
    }

    let body = new FormData();

    body.append('file_name', audio.name)
    body.append('file', audio)

    console.log('audioFile', audioFile);
    this.setState({ audioFile, recording: false });

    axios.post(`${baseUrl}/api/stt_voice/create`, body,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
    )
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  load = () => {
    return new Promise((resolve, reject) => {
      if (!this.state.audioFile) {
        return reject('file path is empty');
      }

      this.sound = new Sound(this.state.audioFile, '', error => {
        if (error) {
          console.log('failed to load the file', error);
          return reject(error);
        }
        this.setState({ loaded: true });
        return resolve();
      });
    });
  };

  play = async () => {
    if (!this.state.loaded) {
      try {
        await this.load();
      } catch (error) {
        console.log(error);
      }
    }

    this.setState({ paused: false });
    Sound.setCategory('Playback');

    this.sound.play(success => {
      if (success) {
        console.log('successfully finished playing');
      } else {
        console.log('playback failed due to audio decoding errors');
      }
      this.setState({ paused: true });
      // this.sound.release();
    });
  };

  pause = () => {
    this.sound.pause();
    this.setState({ paused: true });
  };

  onSpeechStart = e => {
    console.log("onSpeechStart: ", e)
    this.setState({
      started: "√"
    })
  }

  onSpeechRecognized = e => {
    // console.log("onSpeechRecognized: ", e)
    this.setState({
      recognized: "√"
    })
  }

  onSpeechEnd = e => {
    console.log("끝났다 이자식아")
    this.stop()
    this.setState({
      end: "√"
    })
    axios.post(`${baseUrl}/api/stt_text`, {
      text: this.state.partialResults[0]
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  onSpeechError = e => {
    // console.log("onSpeechError: ", e)
    this.setState({
      error: JSON.stringify(e.error)
    })
  }

  onSpeechResults = e => {
    // console.log("onSpeechResults: ", e)
    this.setState({
      results: e.value
    })
  }

  onSpeechPartialResults = e => {
    // console.log("onSpeechPartialResults: ", e)
    this.setState({
      partialResults: e.value
    })
  }

  onSpeechVolumeChanged = e => {
    // console.log("onSpeechVolumeChanged: ", e)
    this.setState({
      pitch: e.value
    })
  }

  _startRecognizing = async () => {
    this.setState({
      recognized: "",
      pitch: "",
      error: "",
      started: "",
      results: [],
      partialResults: [],
      end: ""
    })

    try {
      await Voice.start("ko-KR")
            console.log('start record');
            this.setState({ audioFile: '', recording: true, loaded: false });
            AudioRecord.start();
    } catch (e) {
      console.error(e)
    }
  }

  _stopRecognizing = async () => {
    try {
      await Voice.stop()
    } catch (e) {
      console.error(e)
    }
  }

  _cancelRecognizing = async () => {
    try {
      await Voice.cancel()
    } catch (e) {
      console.error(e)
    }
  }

  _destroyRecognizer = async () => {
    try {
      await Voice.destroy()
    } catch (e) {
      console.error(e)
    }
    this.setState({
      recognized: "",
      pitch: "",
      error: "",
      started: "",
      results: [],
      partialResults: [],
      end: ""
    })
  }

  startRecordRecognizing = () => {
    this._startRecognizing();
    this.start();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>보이스 피싱 검출 AI</Text>
        <Text style={styles.instructions}>
          아래 빨간 마이크를 누르고 말하세요.
        </Text>
        <TouchableHighlight onPress={this.startRecordRecognizing}>
          <Image style={styles.button} source={require("../../images/micButton.png")} />
        </TouchableHighlight>
        <Text style={styles.stat}>{`Started: ${this.state.started}`}</Text>
        <Text
          style={styles.stat}
        >{`Recognized: ${this.state.recognized}`}</Text>
        <Text style={styles.stat}>{`Pitch: ${this.state.pitch}`}</Text>
        <Text style={styles.stat}>{`Error: ${this.state.error}`}</Text>
        <Text style={styles.stat}>Results</Text>
        {this.state.results.map((result, index) => {
          return (
            <Text key={`result-${index}`} style={styles.stat}>
              {result}
            </Text>
          )
        })}
        <Text style={styles.stat}>Partial Results</Text>
        {this.state.partialResults.map((result, index) => {
          return (
            <Text key={`partial-result-${index}`} style={styles.stat}>
              {result}
            </Text>
          )
        })}
        <Text style={styles.stat}>{`End: ${this.state.end}`}</Text>
        <TouchableHighlight onPress={this._stopRecognizing}>
          <Text style={styles.action}>Stop Recognizing</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this._cancelRecognizing}>
          <Text style={styles.action}>Cancel</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this._destroyRecognizer}>
          <Text style={styles.action}>Destroy</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  button: {
    width: 50,
    height: 50
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  action: {
    textAlign: "center",
    color: "#0000FF",
    marginVertical: 5,
    fontWeight: "bold"
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  stat: {
    textAlign: "center",
    color: "black",
    marginBottom: 1
  }
})

export default Invoice

