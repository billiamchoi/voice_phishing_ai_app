import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import Voice from "@react-native-voice/voice";
import Permissions from 'react-native-permissions';
import { Buffer } from 'buffer';
import AudioRecord from 'react-native-audio-record';
import PushNotification from "react-native-push-notification"; 
import { RecordButton } from "../../components/atoms/Button";
import { TextBox } from "../../components/molecules/Box";
import {axiosInstance} from "../../utils";
import { v4 as uuidv4 } from 'uuid';
class Invoice extends Component {
  
  sound = null
  state = {
    recognized: "",
    pitch: "",
    error: "",
    end: true,
    started: "",
    results: [],
    partialResults: [],
    audioFile: '',
    audioFileName: '',
    recording: false,
    loaded: false,
    paused: true,
    intervalId: null,
    segLen: 0,
    audioCounter: 1,
    isButtonPressed: false,
    sr : 16000,
    second: 30
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

  saveSttTextSeg = () => {
    if (typeof(this.state.partialResults[0]) !== 'undefined'){
      const seg = this.state.partialResults[0].slice(this.state.segLen, this.state.partialResults[0].length)
      this.setState({ segLen : this.state.partialResults[0].length })
      if(seg.length !== 0){
        axiosInstance.request({
          contentType: 'application/json',
          method: 'POST',
          url   : 'api/stt_text_seg',
          data  : {
            text: seg
          }
        })
        .then(function (response) {
          console.log("predict_score is : ", response.data);
          scoreNum = Number(response.data)
          if(scoreNum>=0.5){
            message = "보이스피싱이 맞습니다."
            PushNotification.localNotification({message});
          }else{
            message = "보이스피싱이 맞습니다."
          }
          
        }) 
      }
    } 
  }
  
  saveSttAudioSeg = async() => {
    // if (!this.state.recording) return;
    console.log('stop record');
    let audioFile = await AudioRecord.stop();

    let audio = {
      uri: `file://${audioFile}`,
      type: 'audio/wav',
      name: 'test'
    }
    
    let body = new FormData();
    
    body.append('directory_name', this.state.audioFileName)
    body.append('file_name', this.state.audioCounter)
    body.append('file', audio)
    body.append('sr', this.state.sr)
    body.append('second', this.state.second)

    this.setState({ audioFile, audioCounter: this.state.audioCounter + 1 });
    
    axiosInstance.request({
      contentType: 'multipart/form-data',
      method: 'POST',
      url   : 'api/stt_voice_seg',
      data  : body
    })
    .then(response => {
      console.log("보이스 predict_score is : ", response.data);
      scoreNum = Number(response.data)
      if(scoreNum>=0.5){
        message = "보이스피싱이 맞습니다."
        PushNotification.localNotification({message});
      }else{
        message = "보이스피싱이 맞습니다."
      }

      this.setState({ audioFile: '', recording: true, loaded: false });
      AudioRecord.start();
    })
    .catch(err => {
        console.log('error');
        console.log(err.status);
        console.log(err.response.status)
    });
  }

  saveTextNVoiceEverySecond = (textSecond, voiceSecond) => {
    let textIntervalId = setInterval(() => 
    {
      this.saveSttTextSeg()
    }, textSecond*1000);
    let voiceIntervalId = setInterval(() => 
    {
      this.saveSttAudioSeg()
    }, voiceSecond*1000);
    textIntervalId
    voiceIntervalId
    this.setState({ textIntervalId: textIntervalId  })
    this.setState({ voiceIntervalId: voiceIntervalId  })
  }

  createDir = async () => {
    await this.setState({ audioFileName : uuidv4()})
    await axiosInstance.request({
      contentType: 'application/json',
      method: 'POST',
      url   : 'api/start_record',
      data  : {
        file_name : this.state.audioFileName
      }
    })
  }
  
  start = () => {
    console.log('start record');
    this.setState({ audioFile: '', recording: true, loaded: false, audioCounter: 1 });
    AudioRecord.start();
    this.createDir()
    this.saveTextNVoiceEverySecond(5,30)
  };

  stop = async () => {
    if (!this.state.recording) return;
    console.log('stop record');
    clearInterval(this.state.textIntervalId)
    clearInterval(this.state.voiceIntervalId)
    let audioFile = await AudioRecord.stop();

    let audio = {
      uri: `file://${audioFile}`,
      type: 'audio/wav',
      name: 'test'
    }
    
    let body = new FormData();

    body.append('directory_name', this.state.audioFileName)
    body.append('file_name', this.state.audioCounter)
    body.append('file', audio)
    body.append('sr', this.state.sr)
    body.append('second', this.state.second)

    this.setState({ audioFile, recording: false });
    
    axiosInstance.request({
      contentType: 'multipart/form-data',
      method: 'POST',
      url   : 'api/stt_voice_seg',
      data  : body
    })
    .then(function (response) {
      console.log("보이스 predict_score is : ", response.data);
      scoreNum = Number(response.data)
      if(scoreNum>=0.5){
        message = "보이스피싱이 맞습니다."
        PushNotification.localNotification({message});
      }else{
        message = "보이스피싱이 맞습니다."
      }
      
    }) 
    

    axiosInstance.request({
      contentType: 'application/json',
      method: 'POST',
      url   : 'api/stt_text',
      data  : {
        text: this.state.results[0]
      }
    })
    .then(function (response) {
      console.log("predict_score is : ", response.data);
      scoreNum = Number(response.data)
      if(scoreNum>=0.5){
        message = "보이스피싱이 맞습니다."
        PushNotification.localNotification({message});
      }else{
        message = "보이스피싱이 맞습니다."
      }
    })

    this.setState({isButtonPressed: false})
  };




  onSpeechStart = e => {
    console.log("onSpeechStart: ", e)
    this.setState({
      started: "√",
      end: false
    })
  }

  onSpeechRecognized = e => {
    this.setState({
      recognized: "√"
    })
  }

  onSpeechEnd = e => {
    this.stop()
    this.setState({
      end: true
    })
  }

  onSpeechError = e => {
    this.setState({
      error: JSON.stringify(e.error)
    })
  }

  onSpeechResults = e => {
    this.setState({
      results: e.value
    })
  }

  onSpeechPartialResults = e => {
    this.setState({
      partialResults: e.value
    })
  }

  onSpeechVolumeChanged = e => {
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
      partialResults: []
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
          partialResults={this.state.results}
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
  instruction: {
    textAlign: "center",
    fontSize: 16,
    color: "#333333",
    marginBottom: 5
  },
})

export default Invoice

