import axios from 'axios';
import React, { Component } from 'react'
import { StatusBar, Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

import config from '../config.json';


export default class StatisticsScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            account:props.route.params.account,
            profile:{}
        }
    }

    componentDidMount(){
        axios.post(
            `${config.RITOZ_API_URL}/getUserByUsername`,
            {
                username:this.state.account.user_name
            }
        ).then((response) => {
            this.setState({
                profile:response.data
            });
            console.log(this.state.profile);
        }).catch((err) => {
            console.log(err);
        })
    }

    render() {
        if(this.props.route.params.game.game.name === 'Valorant'){
            return (
                <SafeAreaView style={{flex:1}}>
                    <ScrollView
                        style={{
                            backgroundColor:'#001f3b'
                        }}
                    >

                        <View
                            style={{
                                height:200,
                                justifyContent:'space-around',
                                alignItems:'center',
                                flexDirection:'row'
                            }}
                        >
                            
                        </View>

                    </ScrollView>
                </SafeAreaView>
            )
        }else{
            return (
                <View>
                    <Text style={{color:'black'}}> 
                        {this.props.route.params.account.user_name} Statistics for Brawl  
                    </Text>
                </View>
            )
        }
    }
}
