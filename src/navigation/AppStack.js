import InvoiceStack from './InvoiceStack';
import MyPageStack from './MyPageStack';
import CreatorStack from './CreatorStack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react'
import { Sizes, Colors } from '../styles';


const Tab = createBottomTabNavigator();

export default function TabScreen() {
    return (
        <Tab.Navigator sceneContainerStyle={{ backgroundColor: 'transparent' }} initialRouteName="인보이스" screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let icon = getIconForTab(route, focused);
                if (route.name === '검   사'){
                    return <Entypo name={icon} size={Sizes.BottomTab.Icon} color={color}/>
                } else if(route.name === '만든이들'){
                    return <FontAwesome5 name={icon} size={Sizes.BottomTab.Icon} color={color}/>
                } else{
                    return <Ionicons name={icon} size={Sizes.BottomTab.Icon} color={color} /> 
                }
            },
            tabBarActiveTintColor: Colors.IconColor[0],
            tabBarInactiveTintColor: Colors.Default.Grey,
            tabBarStyle: {
            backgroundColor: '#D8E1E7',
            }
        })} >
            <Tab.Screen name="검   사" component={InvoiceStack} options={{headerShown:false}} />
            <Tab.Screen name="마이페이지" component={MyPageStack} options={{headerShown:false}} />
            <Tab.Screen name="만든이들" component={CreatorStack} options={{headerShown:false}} />
        </Tab.Navigator>
    )
}

function getIconForTab(route, focused) {
    let icon;
    if (route.name === '검   사') {
        icon = focused ? 'magnifying-glass' : 'magnifying-glass';
    } else if (route.name === '마이페이지') {
        icon = focused ? 'person' : 'person-outline';
    } else if (route.name === '만든이들') {
        icon = focused ? 'people-carry' : 'people-carry';
    }
    return icon;
}