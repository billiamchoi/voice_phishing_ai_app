import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import Voice from "@react-native-voice/voice";
import Permissions from 'react-native-permissions';
import Sound from 'react-native-sound';
import { Buffer } from 'buffer';
import AudioRecord from 'react-native-audio-record';
import axios from "axios";
import PushNotification from "react-native-push-notification"; 
import { RecordButton } from "../../components/atoms/Button";
import { TextBox } from "../../components/molecules/Box";

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

    AudioRecord.on('data', data => {
      const chunk = Buffer.from(data, 'base64');
      // console.log('chunk size', chunk.byteLength);
    });
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
      name: 'test'
    }

    let body = new FormData();

    body.append('file_name', audio.name)
    body.append('file', audio)

    console.log('audioFile', audioFile);
    this.setState({ audioFile, recording: false });

    axios.post(`${baseUrl}/api/stt_voice`, body,
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
    });
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
      console.log("predict_score is : ", response.data);
      scoreNum = Number(response.data)
      if(scoreNum>=0.5){
        message = "보이스피싱이 맞습니다."
      }else{
        message = "보이스피싱이 아닙니다."
      }
      PushNotification.localNotification({
        message
      });
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

  ConditionalText = (isRecording) => {
    if(isRecording===true){
      return "듣고있어요"
    }else{
      return "아래 마이크를 누르고 말해주세요"
    }
  }

  render() {
    const instructionText  = this.ConditionalText(this.state.recording)
    return (
      <View style={styles.container}>
        <Text style={styles.headText}>
          보이스 피싱 검출 AI
        </Text>
        <Text style={styles.instruction}>
          {instructionText}
        </Text>
        <View style={styles.recordButton} >
          <RecordButton
            isRecording={this.state.recording}
            onStart={this.startRecordRecognizing}
            onStop={this._stopRecognizing}
            size={100}
          />
        </View>
        <TextBox
          partialResults={this.state.partialResults}
        />
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
  recordButton: {
    margin: 25
  },
  headText: {
    fontSize: 25,
    textAlign: "center",
    margin: 10
  },
  action: {
    textAlign: "center",
    color: "#0000FF",
    marginVertical: 5,
    fontWeight: "bold"
  },
  instruction: {
    textAlign: "center",
    fontSize: 16,
    color: "#333333",
    marginBottom: 5
  },
  stat: {
    textAlign: "center",
    color: "black",
    marginBottom: 1
  },
  resultBox: {
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

export default Invoice

