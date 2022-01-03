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
    Image
} from 'react-native'
import axios from 'axios';
import { thisExpression } from '@babel/types';
import config from '../config.json';

export default class RegisterScreen extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            textInputPassword: "",
            textInputUsername: "",
            textInputMail: ""
        }
    }

    registerButtonPress = () => {
        axios({
            method: 'post',
            url: `${config.GAME_BUDDY_API_URL}/api/users/register`,
            data: {
                email: this.state.textInputMail,
                username: this.state.textInputUsername,
                password: this.state.textInputPassword
            }
        }).then(res => {

            if (res.data.success) {
                this.props.navigation.navigate("Login")
            }
            else {
                if(this.state.textInputUsername.length > 0 && this.state.textInputMail.length > 0 && this.state.textInputPassword.length > 0)
                    ToastAndroid.show("Eksik bilgileri doldurunuz.", ToastAndroid.LONG);
            }
        }).catch(err => console.error(err))
    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.body}>
            <ImageBackground source={require('../assets/introjpeg.jpeg')} style={styles.imgBackground}></ImageBackground>

            <View style={styles.content}>
                <Image style={styles.logo} source={require('../assets/logo.png')}></Image>
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

                        placeholder={'Email'}
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
                        onPress={this.registerButtonPress}
                    >
                        <Text style={{ color: 'white' }}>Kayıt Ol</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
    }
})