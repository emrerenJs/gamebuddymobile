import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class StatisticsScreen extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
        
    }
    render() {
        return (
            <View>
                <Text style={{color:'black'}}> 
                    {this.props.route.params.account.user_name} Statistics for {this.props.route.params.game.game.name}..   
                </Text>
            </View>
        )
    }
}
