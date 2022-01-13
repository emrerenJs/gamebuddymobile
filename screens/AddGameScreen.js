import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    ImageBackground,
    KeyboardAvoidingView,
    TextInput,
    Dimensions,
    TouchableOpacity,
    Image,
    ToastAndroid,
    Modal,
    TouchableWithoutFeedbackBase
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Svg, {Circle} from 'react-native-svg';
import config from '../config.json';
import Popup from '../assets/widgets/Popup';

const BACKGROUND_COLOR = '#444B6F';
const BACKGROUND_STROKE_COLOR = '#303858';
const STROKE_COLOR = '#A6E1FA';

const {width, height} = Dimensions.get('window');
const CIRCLE_LENGHT = 100;
const R = CIRCLE_LENGHT / (2 * Math.PI);

export default class AddGameScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            textInputPassword: "",
            textInputUsername: "",
            isModalVisible:false,
            popup:{
                type:'danger',
                header:'Hata!',
                message:'Bir şeyler ters gitti..'
            }
        }
    }

    async componentDidMount(){
        console.log(this.props.route.params.game);
    }

    connectToAccount = async () => {
        console.log("You a heya!")
        const credentials = JSON.parse( await AsyncStorage.getItem('credentials'));
        axios.post(
            `${config.GAME_BUDDY_API_URL}/api/users/addGame`,
            {
                ritozUsername: this.state.textInputUsername,
                ritozPassword: this.state.textInputPassword,
                gamebuddyGameId:this.props.route.params.game._id,
                gamebuddyUserId:credentials.id
            },
            {
                headers:{
                    'Content-Type':'application/json',
                    'Authorization':credentials.jwt
                }
            }
        ).then(async res => {
            if (res.data.success) {
                const popup = this.state.popup;
                popup.type = 'success';
                popup.header = 'Hesap ekleme başarılı!';
                popup.message = 'Hesap oyuna başarıyla eklendi..';
                this.setState({
                    popup:popup,
                    isModalVisible:true
                })
            }
            else {
                this.setState({
                    popup:{
                        header:'Hesap ekleme başarısız!',
                        message:'Sistemsel bir hata meydana geldi.',
                        type:'danger'
                    },
                    isModalVisible:true
                })
            }
        }).catch(err => {
            let message = "Sistemsel bir hata meydana geldi. Lütfen daha sonra tekrar deneyin.."
            if(err.response && err.response.data.message){
                console.log(err.response);
                message = err.response.data.message
            }else{
                console.log(err.response);
            }
            this.setState({
                popup:{
                    header:'Hesap ekleme başarısız!',
                    message,
                    type:'danger'
                },
                isModalVisible:true
            });

        });
    }

    changeModalVisible = (bool) => {
        this.setState({
            isModalVisible:bool
        });
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.body}>
                <ImageBackground source={require('../assets/games/valozalo.jpg')} style={styles.imgBackground}></ImageBackground>

                <View style={styles.content}>
                    <View style={styles.contentInput}>
                        <TextInput
                            placeholder={'Kullanıcı Adı'}
                            placeholderTextColor={'#fff'}
                            style={styles.input}
                            onChangeText={(value) => {
                                this.setState({
                                    textInputUsername: value
                                })
                            }}
                        />
                    </View>
                    <View style={styles.contentInput}>
                        <TextInput
                            placeholder={'Parola'}
                            placeholderTextColor={'#fff'}
                            style={styles.input}
                            onChangeText={(value) => {
                                this.setState({
                                    textInputPassword: value
                                })
                            }}
                            secureTextEntry={true}
                        />
                    </View>
                    <View style={styles.contentInput}>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={this.connectToAccount}
                        >
                            <Text style={{ color: 'white' }}>Bağla</Text>
                        </TouchableOpacity>
                        
                    </View>
                </View>
                <Popup
                    type={this.state.popup.type}
                    header={this.state.popup.header}
                    message={this.state.popup.message}
                    noButtonOnClick={() => {this.changeModalVisible(false)}}
                    okButtonOnClick={() => {this.changeModalVisible(false)}}
                    yesButtonOnClick={()=>{}}
                    isModalVisible={this.state.isModalVisible}
                />
            </KeyboardAvoidingView>

        )
    }
}
const styles = StyleSheet.create({
   
    body: {
        flex: 1,
        width: '100%'
    },
    imgBackground:
    {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    content:
    {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,.542)',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo:
    {
        width: '50%', height: '30%'
    },
    contentInput:
    {
        marginTop: 10
    },
    contentInputLogos:
    {
        marginTop: 100,
        marginHorizontal: 10,
        flexDirection: 'row',
    },
    input:
    {
        width: Dimensions.get('screen').width * 0.9,
        height: 55,
        color: '#fff',
        backgroundColor: ('rgba(255,255,255,0.3)'),
        elevation: 2,
        borderRadius: 27,
        paddingLeft: 15,
    },
    btn: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('screen').width * 0.9,
        backgroundColor: ('rgba(30,50,75,.8))'),
        height: 55,
        borderRadius: 30,
        elevation: 2
    },
    btnApple:
    {
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('screen').width * 0.4,
        backgroundColor: "rgba(0,0,0,.6)",
        height: 40,
        borderRadius: 30,
        elevation: 2,
        marginTop: 10,
        marginLeft: 15,
        flexDirection: 'row'
    },
    btnGoogle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('screen').width * 0.4,
        backgroundColor: "rgba(255,100,90,.6)",
        height: 40,
        borderRadius: 30,
        elevation: 2,
        marginTop: 10,
        marginLeft: 15,
        flexDirection: 'row'
    },
    googleApple:
    {
        width: 20,
        height: 20
    }, 
    registerTop:{
        flexDirection : 'row',
        color: 'white',
        marginTop: 80
    },
    register:{
        color: 'white'
    }
})