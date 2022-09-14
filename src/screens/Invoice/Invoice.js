import React, { Component } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Voice from "@react-native-voice/voice";
import Permissions from 'react-native-permissions';
import { Buffer } from 'buffer';
import AudioRecord from 'react-native-audio-record';
import PushNotification from "react-native-push-notification"; 
import { RecordButton } from "../../components/atoms/Button";
import { TextBox } from "../../components/molecules/Box";
import {axiosInstance} from "../../utils";
import { v4 as uuidv4 } from 'uuid';
import {Colors, Sizes} from '../../styles'
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
    segIdx: 0,
    audioCounter: 1,
    isButtonPressed: false,
    sr : 16000,
    second: 5,
    isFetching: false,
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

  saveSttTextSeg = (isLast) => {
    if (isLast === "last"){
      this.setState({isFetching: true})
    }
    if (typeof(this.state.partialResults[0]) !== 'undefined'){
      const seg = this.state.partialResults[0].slice(this.state.segLen, this.state.partialResults[0].length)
      this.setState({ segLen : this.state.partialResults[0].length })
      this.setState({ segIdx : this.state.segLen})
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
          }
        if (isLast === "last"){
          let last = setTimeout(() => {
            this.setState({isFetching: false, recording: false})
          }, 1000)
          last
        }
        }.bind(this) )
      }
    } 
  }
  
  saveSttAudioSeg = async() => {
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
    let textIntervalId = setInterval(async () => 
    {
      await this.saveSttTextSeg()
    }, textSecond*1000);
    let voiceIntervalId = setInterval(async() => 
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
    this.setState({ audioFile: '', recording: true, loaded: false, audioCounter: 1});
    AudioRecord.start();
    this.createDir()
    this.saveTextNVoiceEverySecond(5,5)
  };

  stop = async () => {
    console.log('stop record');
    this.saveSttTextSeg("last")
    this.setState({isFetching: true})
    clearInterval(this.state.textIntervalId)
    clearInterval(this.state.voiceIntervalId)
    clearTimeout(this.state.timeoutId)
    let audioFile = await AudioRecord.stop()
    
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

    this.setState({ audioFile });
    
    await axiosInstance.request({
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
      }
      let last = setTimeout(() => {
        this.setState({isFetching: false, recording: false})
      }, 1000)
      last
    }.bind(this))  
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
      end: true,
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
        
        this.setState({ audioFile: '', loaded: false });
        AudioRecord.start();
    } catch (e) {
      console.error(e)
    }
  }

  _stopRecognizing = async () => {
    try {
      await this.setState({recording : false ,isFetching: true})
      clearInterval(this.state.textIntervalId)
      clearInterval(this.state.voiceIntervalId)
      clearTimeout(this.state.timeoutId)
      await Voice.stop()
      if(typeof(this.state.partialResults[0]) === 'undefined') {
        this.setState({ isFetching: false })
      }
      
    } catch (e) {
      console.error(e)
    }
  }

  startRecordRecognizing = () => {
    
    this.setState({recording: true})
    this._startRecognizing();
    this.start();
  }

  ConditionalText = (isRecording, isFetching) => {
    if(isFetching===true){
      return "안경 닦는중. . ."
    }else if(isRecording===true){
      return "듣고 있어요"
    }else if (isRecording===false){
      return "아래 마이크를 누르고 말해주세요"
    }
  }

  render() {
    const instructionText  = this.ConditionalText(this.state.recording, this.state.isFetching)
    return (
      <View style={styles.container}>
        <Image
        style={styles.logo}
        source={require('../../assets/Images/watchmanLogo.png')}
        />
        <Text style={styles.instruction}>
          {instructionText}
        </Text>
        <View style={styles.recordButton} >
          <RecordButton
            isRecording={this.state.recording}
            onStart={this.startRecordRecognizing}
            onStop={this._stopRecognizing}
            isFetching={this.state.isFetching}
            size={Sizes.Invoice.RecordButtonSize}
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
    backgroundColor: Colors.BackgroundColor
  },
  recordButton: { 
    flex: 0.5
  },
  instruction: {
    textAlign: "center",
    fontSize: Sizes.Invoice.InstructionFontSize,
    color: "#2A321F",
    marginBottom: 10
  },
  logo: {
    width: 300,
    height: 50,
    margin: 30
  }
})

export default Invoice

