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

export default class LoginScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            textInputPassword: "",
            textInputMail: "",
            isModalVisible:false,
            popup:{
                type:'danger',
                header:'Hata!',
                message:'Bir şeyler ters gitti..'
            }
        }
    }

    async componentDidMount(){
        try{
            const credentials = JSON.parse(await AsyncStorage.getItem('credentials'));
            if(credentials !== null && credentials.jwt !== null){
                this.props.navigation.navigate("Home",{
                    username:credentials.username
                });
            }
        }catch(e){

        }
    }

    navigateRegister = () => {
        this.props.navigation.navigate("Register")
    }

    loginButtonPress = () => {
        axios({
            method: 'post',
            url: `${config.GAME_BUDDY_API_URL}/api/users/login`,
            data: {
                email: this.state.textInputMail,
                password: this.state.textInputPassword
            }
        }).then(async res => {

            if (res.data.success) {
                try{
                    const credentials = {
                        jwt:res.data.access_token,
                        username:res.data.data.username,
                        id:res.data.data.id
                    }
                    await AsyncStorage.setItem('credentials',JSON.stringify(credentials));
                    this.props.navigation.navigate("Home", {
                        username: res.data.data.username
                    })
                }catch(e){
                    this.setState({
                        popup:{
                            header:'Giriş Başarısız!',
                            message:'Sistemsel bir hata meydana geldi.',
                            type:'danger'
                        },
                        isModalVisible:true
                    })   
                }
            }
            else {
                this.setState({
                    popup:{
                        header:'Giriş Başarısız!',
                        message:'Sistemsel bir hata meydana geldi.',
                        type:'danger'
                    },
                    isModalVisible:true
                })
            }
        }).catch(err => {
            let message = "Sistemsel bir hata meydana geldi. Lütfen daha sonra tekrar deneyin.."
            if(err.response && err.response.data.message){
                message = err.response.data.message
            }
            this.setState({
                popup:{
                    header:'Giriş Başarısız!',
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
                <ImageBackground source={require('../assets/introjpeg.jpeg')} style={styles.imgBackground}></ImageBackground>

                <View style={styles.content}>
                    <Image style={styles.logo} source={require('../assets/logo.png')}></Image>
                    <View style={styles.contentInput}>
                        <TextInput

                            placeholder={'email'}
                            placeholderTextColor={'#fff'}
                            style={styles.input}
                            onChangeText={(value) => {
                                this.setState({
                                    textInputMail: value
                                })
                            }}
                        />
                    </View>
                    <View style={styles.contentInput}>
                        <TextInput
                            placeholder={'parola'}
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
                            onPress={this.loginButtonPress}
                        >
                            <Text style={{ color: 'white' }}>Giriş Yap</Text>
                        </TouchableOpacity>
                        
                    </View>
                    
                    <View style={styles.contentInputLogos}>
                        <TouchableOpacity style={styles.btnApple}>
                            <Text style={{ color: 'white' }}>Sign with </Text>
                            <Image style={styles.googleApple} source={require('../assets/apple.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnGoogle}>
                            <Text style={{ color: 'white' }}>Sign with </Text>
                            <Image style={styles.googleApple} source={require('../assets/google.png')}></Image>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.registerTop}>
                        <Text style={styles.register}>Hesabınız yok mu ?  </Text>
                        <Text 
                        style={styles.register}
                        onPress={this.navigateRegister}
                        >
                            Şimdi kayıt olmak için tıklayınız.</Text>
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
        backgroundColor: ('rgba(255,255,255,0.2)'),
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