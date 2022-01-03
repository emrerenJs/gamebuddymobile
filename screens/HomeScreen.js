import React, { Component } from 'react'
import { Text, View, BackHandler} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GamesScreen from '../screens/GamesScreen';
import MyGamesScreen from '../screens/MyGamesScreen';
const Tabs = createBottomTabNavigator();

import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';


export default class HomeScreen extends Component {
    
    constructor(props){
        super(props);
    }

    render() {
        return (
            <Tabs.Navigator
                screenOptions={
                    ({ route }) => ({
                        headerShown: false,
                        tabBarStyle: {
                            backgroundColor: 'rgba(255,255,255,.7)',
                            position: 'absolute',
                            borderTopLeftRadius: 55,
                            borderTopRightRadius: 55 

                        },
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;
                            console.log(color)
                            if (route.name === 'Oyunlarım') {
                                iconName = 'home';
                            } else if (route.name === 'Tüm Oyunlar') {
                                iconName = 'gamepad-circle';
                            }

                            // You can return any component that you like here!
                            return <Icon name={iconName} size={30} color={color} />;
                        },
                        tabBarActiveTintColor: '#243B55',
                        tabBarInactiveTintColor: '#141E30',
                    })
                }
                tabBarOptions={{
                    showLabel: false
                }}
            >
                <Tabs.Screen name={"Oyunlarım"} component={MyGamesScreen}></Tabs.Screen>
                <Tabs.Screen name={"Tüm Oyunlar"} component={GamesScreen}></Tabs.Screen>
            </Tabs.Navigator>
        )
    }
}

/*


*/