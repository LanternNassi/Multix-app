import React, { Component  , useState , useEffect} from 'react'
import {View , Text , StyleSheet , TouchableOpacity , ScrollView , Alert } from 'react-native'
import {Avatar} from 'react-native-elements'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'
import { Sae , Fumi , Kohana , Hoshi } from 'react-native-textinput-effects'
import SignInLogic from './SignInLogic.js'
import axios from 'axios'
import Spinner from 'react-native-loading-spinner-overlay'
import OneSignal from 'react-native-onesignal';
import OtpInputs from 'react-native-otp-inputs'


export function Forgot_password(props){
        const [Name , setName] = useState('')
        const [Email , setEmail] = useState('')
        const [spin , setspin] = useState(false)
        const [sent_otp , setSent_otp] = useState(false)
        const [true_otp , settrue_otp ] = useState('')

        return (
            <ScrollView contentContainerStyle = {{
                alignItems : 'center',
                justifyContent : 'center',
            }} horizontal = {false} style = {styles.container}>
                {
                    sent_otp ? (
                        <View style = {styles.input}>
                            {/* <OtpInputs
                                // handleChange={async (code) => {
                                //     // setspin(true)
                                //     function finish(){
                                //         // setspin(false)
                                //         alert('successful otp')
                                //         // sent_otp(true)
                                //     }
                                //     await SignInLogic.verify_otp(Name , code , props.state.business.Debug , finish )
                                // }}
                                numberOfInputs={6}
                            /> */}
                             <Fumi
                                style = {{ width : ScreenWidth-10 }}
                                label={'OTP'}
                                iconClass={FontAwesomeIcon}
                                iconName={'user'}
                                iconColor={props.state.fun.Layout_Settings.Icons_Color}
                                iconSize={20}
                                value = {true_otp}
                                iconWidth={40}
                                inputPadding={16}
                                inputStyle = {{ color : 'black' }}
                                onChangeText = { text => {
                                    settrue_otp(text.trim())
                                } }
                               
                            />
                        </View>
                    ) : (
                        <View style = {styles.input_container}>
                        <View style = {styles.header}>
                        <Avatar  source = {require('../assets/Notifications.png')} rounded size = {'large'} />
                            <Text style = {styles.Header_text}>
                                Reset Password 
                            </Text>
            
                        </View>
                        <Spinner
                            visible={spin}
                            textContent={'Signing in...wait a minute'}
                            textStyle={styles.spinnerTextStyle}
                        />
                            <Fumi
                                style = {{ width : ScreenWidth-10 }}
                                label={'Username / Name'}
                                iconClass={FontAwesomeIcon}
                                iconName={'user'}
                                iconColor={props.state.fun.Layout_Settings.Icons_Color}
                                iconSize={20}
                                value = {Name}
                                iconWidth={40}
                                inputPadding={16}
                                inputStyle = {{ color : 'black' }}
                                onChangeText = { text => {
                                    setName(text.trim())
                                } }
                               
                            />
                              <Fumi
                                style = {{ width : ScreenWidth-10 }}
                                label={'Email'}
                                iconClass={FontAwesomeIcon}
                                iconName={'envelope'}
                                iconColor={props.state.fun.Layout_Settings.Icons_Color}
                                iconSize={20}
                                secureTextEntry = {false}
                                iconWidth={40}
                                inputPadding={16}
                                inputStyle = {{ color : 'black' }}
                                onChangeText = { text => {
                                    setEmail(text)
                                } }
                            />
                           
                            <View style = {{ position : 'relative' , height : ScreenHeight * 0.2 , top : 50 , bottom : 0 }}>
        
                                <TouchableOpacity onPress = {
                                    async () => {
                                       setspin(true)
                                       function finish(otp){
                                           setspin(false)
                                           alert('Your otp is '+otp)
                                           setSent_otp(true)
                                       }
                                      await SignInLogic.send_otp(Name , props.state.business.Debug , finish )
                                    }
                                } style = {{ width : 180 , height : 42 , borderRadius :21  , backgroundColor : props.state.fun.Layout_Settings.Icons_Color, justifyContent : 'center' , alignItems : 'center'  }}>
                                    <Text style = {{color : 'white'}}>Send OTP</Text>
                                </TouchableOpacity>
        
            
                            </View>
                        </View>
            
                    )
                }
             
                
            </ScrollView>
        )
  
}

const mapStateToProps = (state_redux) => {
    let state  = state_redux
    return {state}    
}

const mapDispatchToProps = (dispatch) => ({
   
    
}) 

export default connect(mapStateToProps, mapDispatchToProps)(Forgot_password)


const styles = StyleSheet.create({
    container : {
        flex : 1,
        
    },
    header : {
        height : 0.15 * ScreenHeight,
        width : 0.9 * ScreenWidth,
        justifyContent : 'space-between',
        alignItems : 'center',
        flexWrap : 'nowrap'
    },
    Header_text : {
        fontSize : 16,
        fontWeight : 'bold',
    },
    input_container : {
        height : 0.8 * ScreenHeight,
        width : 0.98 * ScreenWidth,
        justifyContent : 'space-around',
        alignItems : 'center'
    },
    spinnerTextStyle: {
        color: '#FFF'
      },

})