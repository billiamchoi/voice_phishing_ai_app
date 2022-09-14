import React, { Component } from "react"
import { StyleSheet, Text, View, FlatList } from "react-native"
import Colors from "../../../styles/Colors";

const DATA = [
  {
    id: "1",
    title: "지급정지·피해신고 112",
  },
  {
    id: "2",
    title: "피싱사이트 신고 118",
  },
  {
    id: "3",
    title: "피해상담 및 환급 1332",
  }
];

const Item = ({ title }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

export default class MyPageList extends Component {

  render() {
    const renderItem = ({ item }) => (
      <Item 
        title={item.title} 
        onPress={()=>console.log}      
      />
    );
    return (
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        scrollEnabled={false}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: Colors.PrimaryColor,
    padding: 20,
    marginVertical: 3,
    marginHorizontal: 16,
    borderColor: Colors.Default.Black,
    borderWidth: 1,
  },
  title: {
    fontSize:18,
    color: Colors.Default.White,
    alignSelf: "center"
  },
});