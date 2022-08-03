import InvoiceStack from './InvoiceStack';
import MyPageStack from './MyPageStack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React from 'react'

const Tab = createBottomTabNavigator();

export default function TabScreen() {
    return (
        <Tab.Navigator sceneContainerStyle={{ backgroundColor: 'transparent' }} initialRouteName="인보이스" screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let icon = getIconForTab(route, focused);
                return <Ionicons name={icon} size={wp(5)} color={color} /> 
            }
        })} >
            <Tab.Screen name="인보이스" component={InvoiceStack} options={{headerShown:false}} />
            <Tab.Screen name="마이페이지" component={MyPageStack} options={{headerShown:false}} />
        </Tab.Navigator>
    )
}

function getIconForTab(route, focused) {
    let icon;
    if (route.name === '인보이스') {
        icon = focused ? 'mic' : 'mic-outline';
    } else if (route.name === '마이페이지') {
        icon = focused ? 'person' : 'person-outline';
    }
    return icon;
}