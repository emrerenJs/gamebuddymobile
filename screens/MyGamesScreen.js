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
    BackHandler

} from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import * as Progress from 'react-native-progress';
import Svg, {Circle} from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackActions, NavigationActions } from '@react-navigation/native';
import Popup from '../assets/widgets/Popup';
import axios from 'axios';
import config from '../config.json';

import images from '../assets/games/images';


const BACKGROUND_COLOR = '#444B6F';
const BACKGROUND_STROKE_COLOR = '#303858';
const STROKE_COLOR = '#A6E1FA';

const {width, height} = Dimensions.get('window');
const CIRCLE_LENGHT = 1000;
const R = CIRCLE_LENGHT / (2 * Math.PI);

export default class MyGamesScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isModalVisible:false,
            games:[]
        }
    }

    backAction = () => {
        this.setState({
            isModalVisible:true
        });
        return true;
    }


    async logout(){
        try{
            //await AsyncStorage.removeItem('credentials');
            await AsyncStorage.removeItem('credentials');
            this.setState({
                isModalVisible:false
            });
            BackHandler.exitApp();
        }catch(e){
            console.error(e);
        }finally{

        }
    }

    async componentDidMount(){
        this.backHandler = BackHandler.addEventListener("hardwareBackPress",this.backAction);
        const credentials = JSON.parse( await AsyncStorage.getItem('credentials'));
        axios.post(
            `${config.GAME_BUDDY_API_URL}/api/users/myGames`,
            {
                "user":{
                    "id":credentials.id
                }
            },
            {
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':credentials.jwt
                }
            }
        ).then(async (response)=>{
            const gamesObject = [];
            for(let i = 0; i < response.data.data.length; i++){
                gamesObject.push({
                    game:response.data.data[i].game,
                    accounts:response.data.data[i].accounts
                })
            }
            this.setState({
                games:gamesObject,
            })
        }).catch(async err=>{
            console.log(err.response);
            if(err.response?.status && err.response.status === 401){
                try{
                    await AsyncStorage.removeItem('credentials');
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Login' })],
                    });
                    this.props.navigation.dispatch(resetAction)
                }catch(e){

                }
            }else{
                //noluyo
            }
        })
    }

    componentWillUnmount(){
        this.backHandler.remove();
    }

    _renderItem = ({ item, index }) => {
        let { itemStyle, itemText } = styles;
        const imageObj = images.find((e) => e.name == item.game.name);
        return (
            <View style={[itemStyle, { backgroundColor: item.game.backgroundColor }]}>
                <ImageBackground source={imageObj.backgroundImage} style={styles.imgBackground}></ImageBackground>
                <Image style={{backgroundColor: item.game.backgroundColor, position:'absolute', width:'100%',height:'100%'}}></Image>
                <Image source={imageObj.icon} style={styles.imgGameLogo}></Image>
                
                <View style={styles.gameSet}>
                    <View style={{ flexDirection: 'row' }}>
                        
                        <View style={{ left: '80%'}}>
                            <Progress.Circle
                                progress={item.game.fully / 100}
                                size={60}
                                animated={true}
                                color={'honeydew'}
                                indeterminate={false}
                                showsText={true}
                                textStyle={{ fontSize: 15 }}
                                formatText={progress => `${(item.game.fully)}%`}
                                borderWidth={1}

                            />

                            <Text style={styles.gameName}>Lobby</Text>
                        </View>
                    </View>
                </View>
            </View>
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
                    
                    <Text style={{ color: 'rgba(255,255,255,0.75)',borderBottomWidth:5 ,borderBottomColor:'rgba(255,255,255,.15)',borderBottomLeftRadius:70, borderBottomRightRadius:50, fontSize:35 }}> OYUNLARIM</Text>
                </LinearGradient>


                <View style={container}>
                    <FlatList
                        data={this.state.games}
                        renderItem={this._renderItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
                <Popup
                    type="yes_no"
                    header="Uygulamadan Çıkılıyor.."
                    message="Uygulamadan çıkmak istediğinize emin misiniz?"
                    noButtonOnClick={() => this.setState({isModalVisible:false})}
                    yesButtonOnClick={() => this.logout()}
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
