import React, { Component } from "react"
import { StyleSheet, Text, View, Image } from "react-native"
import { Colors, Sizes } from '../../styles'
import Confetti from 'react-native-confetti';

class Creator extends Component {
  
  componentDidMount(){
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("focus", () => {      
      this._confettiView.startConfetti();    
    });
}

  render() {
    return (
      <View style={styles.container}>
        <Confetti ref={(node) => this._confettiView = node}/>
        <Text style={styles.headText}>만든이들</Text>
        <View style={styles.memberView}>
        <Image
          style={styles.avatar}
          source={require('../../assets/Images/member3.png')}
          />
        <Text style={styles.manPersonText}>최우영</Text>
        </View>
        <View style={styles.memberView}>
        <Image
          style={styles.avatar}
          source={require('../../assets/Images/member3.png')}
          />
          <Text style={styles.manPersonText}>김강희</Text>
        </View>
        <View style={styles.memberView}>
        <Image
          style={styles.avatar_w}
          source={require('../../assets/Images/member2.png')}
          />
          <Text style={styles.personText}>김인화</Text>
        </View>
        <View style={styles.memberView}>
        <Image
          style={styles.avatar_w}
          source={require('../../assets/Images/member2.png')}
          />
          <Text style={styles.personText}>심상아</Text>
        </View>
        <View style={styles.memberView}>
        <Image
          style={styles.avatar_w}
          source={require('../../assets/Images/member2.png')}
          />
          <Text style={styles.personText}>이유진</Text>
        </View>
        <View style={styles.memberView}>
        <Image
          style={styles.avatar_w}
          source={require('../../assets/Images/member2.png')}
          />
          <Text style={styles.personText}>이혜경</Text>
        </View>
        <View style={styles.memberView}>
        <Image
          style={styles.avatar_w}
          source={require('../../assets/Images/member2.png')}
          />
          <Text style={styles.personText}>홍여빈</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BackgroundColor
  },
  headText: {
    alignSelf: "center",
    marginTop: 80,
    marginBottom: 10,
    fontSize: 35,
    fontWeight: 'bold',
    color: "#2A321F"
  },
  personText: {
    alignSelf: "center",
    color: "#2A321F",
    marginTop: 10,
    fontSize: 20,
  },
  manPersonText: {
    alignSelf: "center",
    color: "#2A321F",
    marginTop: 10,
    fontSize: 20,
  },
  avatar: {
    width: 120,
    height: 80,
    alignSelf: "center",
    marginBottom: -15,
    resizeMode: 'contain'
  },
  avatar_w: {
    width: 120,
    height: 70,
    alignSelf: "center",
    marginBottom: -15
  },
  memberView: {
    marginTop: 25,
    flexDirection:"row",
    alignSelf:"center"
  }
});

export default Creator
