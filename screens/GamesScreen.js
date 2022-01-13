import { isTemplateElement } from '@babel/types';
import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    FlatList,
    Dimensions,
    Image,
    ImageBackground,
    BackHandler,
    TouchableOpacity

} from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';
import axios from 'axios';
import config from '../config.json';
import Popup from '../assets/widgets/Popup';

import images from '../assets/games/images';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions, NavigationActions } from '@react-navigation/native';

const BACKGROUND_COLOR = '#444B6F';
const BACKGROUND_STROKE_COLOR = '#303858';
const STROKE_COLOR = '#A6E1FA';

const {width, height} = Dimensions.get('window');
const CIRCLE_LENGHT = 1000;
const R = CIRCLE_LENGHT / (2 * Math.PI);

export default class GamesScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            games:[],
            isModalVisible:false,
            popup:{
                type:'warning',
                header:'Hata!',
                message:'Bir şeyler ters gitti..'
            }
        }
    }

    async componentDidMount(){
        const credentials = JSON.parse( await AsyncStorage.getItem('credentials'));
        axios.get(
            `${config.GAME_BUDDY_API_URL}/api/games`,
            {
                params:{
                    token:credentials.jwt
                }
            }
        ).then((response)=>{
            this.setState({
                games:response.data
            })
        }).catch(async err=>{
            if(err.response?.status && err.response.status === 401){
                try{
                    await AsyncStorage.removeItem('credentials');
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Login' })],
                    });
                    this.props.navigation.dispatch(resetAction);
                }catch(e){

                }
            }else{

            }
        })
    }

    goToGame(item){
        const stackAction = StackActions.push('AddGame',{game:item});
        this.props.navigation.dispatch(stackAction);
    }

    comingSoon(){
        const popup = this.state.popup;
        popup.header = 'Yakında!';
        popup.type = 'warning';
        popup.message = 'Bu oyun yakında sistemimize eklenecektir..';
        this.setState({
            popup,
            isModalVisible:true
        })
    }

    changeModalVisible(){
        this.setState({
            isModalVisible:false
        });
    }

    _renderItem = ({ item, index }) => {
        let { itemStyle, itemText } = styles;
        const imageObj = images.find((e) => e.name == item.name);
        return (
            <TouchableOpacity 
                style={[itemStyle, { backgroundColor: item.backgroundColor }]} 
                onPress={item.coming_soon ? this.comingSoon.bind(this) : this.goToGame.bind(this,item)}
            >
                <ImageBackground source={imageObj.backgroundImage} style={styles.imgBackground}></ImageBackground>
                <Image style={{backgroundColor: item.backgroundColor, position:'absolute', width:'100%',height:'100%'}}></Image>
                <Image source={imageObj.icon} style={styles.imgGameLogo}></Image>
                
                <View style={styles.gameSet}>
                    <View style={{ flexDirection: 'row' }}>
                        
                        <View style={{ left: '80%'}}>
                            <Progress.Circle
                                progress={item.fully / 100}
                                size={60}
                                animated={true}
                                color={'honeydew'}
                                indeterminate={false}
                                showsText={true}
                                textStyle={{ fontSize: 15 }}
                                formatText={progress => `${(item.fully)}%`}
                                borderWidth={1}

                            />

                            <Text style={styles.gameName}>Lobby</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
    render() {
        let { container, itemText } = styles
        return (
            <View style={styles.body}>
                <LinearGradient
                    start={{ x: 0.0, y: 0.0 }}
                    end={{ x: 0.0, y: 1.0 }}
                    locations={[0.0, 1.0]}
                    colors={['#141E30', '#243B55']}
                    style={styles.linearGradient}
                    useAngle={true}
                    angle={400}
                    angleCenter={{ x: 0.5, y: 0.5 }}
                >
                    
                    <Text style={{ color: 'rgba(255,255,255,0.75)',borderBottomWidth:5 ,borderBottomColor:'rgba(255,255,255,.15)',borderBottomLeftRadius:70, borderBottomRightRadius:50, fontSize:35 }}> OYUNLAR </Text>
                </LinearGradient>


                <ImageBackground 
                    source={require('../assets/intro.jpg')}
                    style={container}>
                    <FlatList
                        data={this.state.games}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </ImageBackground>
                <Popup
                    type={this.state.popup.type}
                    header={this.state.popup.header}
                    message={this.state.popup.message}
                    noButtonOnClick={() => {this.changeModalVisible(false)}}
                    okButtonOnClick={() => {this.changeModalVisible(false)}}
                    yesButtonOnClick={()=>{}}
                    isModalVisible={this.state.isModalVisible}
                />
            </View>
            

        )
    }
}

const styles = StyleSheet.create({
    linearGradient: {
        flex: 0.1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    body: {
        flex: 1,
        justifyContent: 'center'
    },
    topBar: {
        backgroundColor: 'rgba(123,23,51,.7)',
        width: '100%',
        height: '15%',
        alignItems: 'center',
        justifyContent: 'center',

    },
    games: {
        flexDirection: 'row',
        position: "relative",

    },
    container: {
        flex: 1
    },
    itemStyle: {
        backgroundColor: '#3232ff',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        height: width / 3,
        flexDirection: 'row'
    },
    imgGameLogo:
    {
        width: '25%',
        height: '55%',
        right: "100%"
    },
    gameSet: {
        position: 'absolute',
        left: '48%',
        color: 'white',

    },
    gameName: {
        color: 'white',
        fontStyle: 'italic',
        textAlign: 'center'
    },
    imgBackground:
    {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    circle: {
        width : 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'rgba(255,255,255,.5)',
        textShadowOffset: {x: 2, y: 0},
        shadowRadius: 2,
        borderRadius: 30,
        position: 'absolute',
        bottom:20,
        right: 0,
        top: 5,
        shadowOpacity:'5.0'
    }

});
