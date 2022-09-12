import React, { Component } from "react"
import { StyleSheet, Text, View } from "react-native"
import { Avatar } from 'react-native-elements';
import { Colors } from '../../styles'
class Mypage extends Component {
  
  render() {
    return (
      <View style={styles.container}>
         <Avatar
            size="xlarge"
            rounded
            source={require('../../assets/Images/male_profile.png')}
            containerStyle={styles.avatarContainer}
					/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BackgroundColor
  },
  avatarContainer : {
    alignSelf: "center", 
    marginTop: "25%"
  }

});

export default Mypage