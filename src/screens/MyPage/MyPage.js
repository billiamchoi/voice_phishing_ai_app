import React, { Component } from "react"
import { StyleSheet, Text, View } from "react-native"
import { Avatar } from 'react-native-elements';
import { MyPageList } from "../../components/molecules/List";
import { Colors, Sizes } from '../../styles'
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
          <Text style={styles.welcomeText}>사용자님을 환영합니다!</Text>
          <View style={styles.listView}>
            <MyPageList />
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
  avatarContainer: {
    alignSelf: "center", 
    marginTop: "25%"
  },
  welcomeText:{
    fontSize: Sizes.MyPage.welcomeFontSize,
    alignSelf: "center",
    marginTop: 40,
    color: "#2A321F"
  },
  listView: {
    marginTop: 40
  } 
});

export default Mypage