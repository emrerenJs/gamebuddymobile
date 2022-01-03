import React, {useEffect, useState} from 'react'
import { View, Text,TouchableOpacity, StyleSheet, Dimensions, Modal } from 'react-native'
import Icon from 'react-native-vector-icons/dist/Ionicons';


const WIDTH_M = Dimensions.get('window').width;
const HEIGHT_M = Dimensions.get('window').height/3;

export default function Popup(props) {

    const [template, setTemplate] = useState({
        lightBgColor:'#fab52a',
        darkBgColor:'white',
        darkColor:'#737373',
        headerColor:'#fab52a',
        iconName:'information-circle'
    })

    const [empty,setEmpty] = useState([])
    
    useEffect(()=>{
        if(props.type === 'danger'){
            setTemplate({
                lightBgColor:'#c91818',
                darkBgColor:'white',
                darkColor:'#737373',
                headerColor:'#c91818',
                iconName:'alert-circle'
            })
        }
        else if(props.type === 'success'){
            setTemplate({
                lightBgColor:'#34eb7a',
                darkBgColor:'white',
                darkColor:'#737373',
                headerColor:'#34eb7a',
                iconName:'checkmark-circle'
            })
        }
        else if(props.type === 'yes_no'){
            setTemplate({
                lightBgColor:'#5cb8ff',
                darkBgColor:'white',
                darkColor:'#737373',
                headerColor:'#5cb8ff',
                iconName:'options'
            })
        }else if(props.type === 'ok_cancel'){
            setTemplate({
                lightBgColor:'#5cb8ff',
                darkBgColor:'white',
                darkColor:'#737373',
                headerColor:'#5cb8ff',
                iconName:'options'
            })
        }else{
            //its an information message
        }
    },empty);

    const renderButtons = () => {
        if(props.type == 'yes_no'){
            return(
                <View style={{
                    flex:1,
                    flexDirection:'row'
                }}>
                    <TouchableOpacity
                        style={{
                            flex:1,
                            color:template.darkBgColor,
                            alignItems:'center',
                            justifyContent:'center',
                            borderRightWidth:1,
                            borderRightColor:'rgba(255,255,255,.2)'
                        }}
                        onPress={()=>{props.noButtonOnClick()}}
                    >
                        <Text style={{color:template.darkBgColor}}>Hayır</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flex:1,
                            color:template.darkBgColor,
                            alignItems:'center',
                            justifyContent:'center'
                        }}
                        onPress={()=>{props.yesButtonOnClick()}}
                    >
                        <Text style={{color:template.darkBgColor}}>Evet</Text>
                    </TouchableOpacity>
                </View>
            )
        }else if(props.type == 'ok_cancel'){
            return(
                <View style={{
                    flex:1,
                    flexDirection:'row'
                }}>
                    <TouchableOpacity
                        style={{
                            flex:1,
                            color:template.darkBgColor,
                            alignItems:'center',
                            justifyContent:'center',
                            borderRightWidth:1,
                            borderRightColor:'rgba(255,255,255,.2)'
                        }}
                        onPress={()=>{props.cancelButtonOnClick()}}
                    >
                        <Text style={{color:template.darkBgColor}}>İptal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{
                            flex:1,
                            color:template.darkBgColor,
                            alignItems:'center',
                            justifyContent:'center'
                        }}
                        onPress={()=>{props.okButtonOnClick()}}
                    >
                        <Text style={{color:template.darkBgColor}}>Tamam</Text>
                    </TouchableOpacity>
                </View>
            )
        }else{
            return(
                <View style={{
                    flex:1,
                    flexDirection:'row'
                }}>
                    <TouchableOpacity
                        style={{
                            flex:1,
                            color:template.darkBgColor,
                            alignItems:'center',
                            justifyContent:'center'
                        }}
                        onPress={()=>{props.okButtonOnClick()}}
                    >
                        <Text style={{color:template.darkBgColor}}>Tamam</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }
    return (
        <Modal
            transparent={true}
            animationType='fade'
            visible={props.isModalVisible}
        >
            <TouchableOpacity
                disabled={true}
                style={styles.container}
            >
                <View style={styles.modal}>
                    <Icon
                        size={HEIGHT_M/3}
                        color={template.lightBgColor}
                        name={template.iconName}
                    />
                    <Text style={{color:template.lightBgColor,fontSize:22,fontWeight:'bold'}}>
                        {props.header}
                    </Text>
                    <Text style={{color:template.darkColor,marginTop:10}}>
                        {props.message}
                    </Text>
                </View>
                <View style={[styles.interactions,{backgroundColor:template.lightBgColor}]}>
                    {renderButtons()}
                </View>
            </TouchableOpacity>
        </Modal>
        
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'rgba(0,0,0,.6)'
    },
    modal:{
        minHeight:HEIGHT_M/1.1,
        width:WIDTH_M/1.5,
        backgroundColor:'white',
        borderTopLeftRadius:50,
        borderTopRightRadius:50,
        justifyContent:'center',
        alignItems:'center',
        padding:10
    },
    interactions:{
        height:HEIGHT_M/5,
        width:WIDTH_M/1.5,
        borderBottomLeftRadius:25,
        borderBottomRightRadius:25
    }
})