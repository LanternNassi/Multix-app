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



export function Sign_in(props){
        const [Name , setName] = useState('')
        const [Password , setPassword] = useState('')
        const [spin , setspin] = useState(false)

        return (
            <ScrollView contentContainerStyle = {{
                alignItems : 'center',
                justifyContent : 'center',
            }} horizontal = {false} style = {styles.container}>
                
                <View style = {styles.input_container}>
                <View style = {styles.header}>
                <Avatar  source = {require('../assets/Notifications.png')} rounded size = {'large'} />
                    <Text style = {styles.Header_text}>
                        Sign in 
                    </Text>
    
                </View>
                <Spinner
                    visible={spin}
                    textContent={'Signing in...wait a minute'}
                    textStyle={styles.spinnerTextStyle}
                />
                    <Fumi
                        style = {{ width : ScreenWidth-10 , backgroundColor : '#121212' }}
                        label={'Username / Name'}
                        iconClass={FontAwesomeIcon}
                        iconName={'user'}
                        iconColor={props.state.fun.Layout_Settings.Icons_Color}
                        iconSize={20}
                        value = {Name}
                        iconWidth={40}
                        inputPadding={16}
                        inputStyle = {{ color : 'white' }}
                        onChangeText = { text => {
                            setName(text.trim())
                        } }
                       
                    />
                      <Fumi
                        style = {{ width : ScreenWidth-10 , backgroundColor : '#121212'}}
                        label={'Password'}
                        iconClass={FontAwesomeIcon}
                        iconName={'eye-slash'}
                        iconColor={props.state.fun.Layout_Settings.Icons_Color}
                        iconSize={20}
                        secureTextEntry = {true}
                        iconWidth={40}
                        inputPadding={16}
                        inputStyle = {{ color : 'white' }}
                        onChangeText = { text => {
                            setPassword(text)
                        } }
                    />
                    
                    {/* <View style = {{
                       top : 0.06 * ScreenHeight,
                    }}>
                        <TouchableOpacity onPress = {()=>{
                            props.state.business.navigation.navigation.navigate('Reset Password')
                        }}>
                            <Text style = {{
                                fontSize : 14,
                                fontWeight : 'bold',

                            }}>Forgot password ? </Text>
                        </TouchableOpacity>
                       
                    </View> */}
                  
                    <View style = {{ position : 'relative' , height : ScreenHeight * 0.2 , top : 50 , bottom : 0 }}>

                        <TouchableOpacity onPress = {
                            () => {
                               setspin(true)
                               function navigate(processed_info){
                                        // OneSignal.push(function() {
                                        //     OneSignal.setExternalUserId(processed_info.Profile['Multix_token']);
                                        //     OneSignal.setEmail(processed_info.Profile['Email']);
                                        // });
                                    //Loading the profile into redux store for use 
                                    props.store_fun_profile({...processed_info.Profile , 'Server_id' : processed_info.Profile.id})
                                    //Loading the contacts into the redux for use
                                    props.store_contacts_redux(processed_info.Contacts) 
                                    props.store_online_chats({})
                                    props.store_messages_redux([])
                                    props.store_positions_redux([])  
                                    setspin(false)                                
                                    //Navigating to the original initial screen after signing up
                                    props.state.business.navigation.navigation.navigate('Multix')
                               }

                               function invalid(){
                                   alert('Invalid credentials. Account doesnt exist...')
                                   setspin(false)
                               }
                               function are_contacts_allowed(){
                                   let will;
                                   
                                    return will
                               }

                               SignInLogic.init(Name , Password , props.state.business.Debug , navigate , invalid , are_contacts_allowed)
                            }
                        } style = {{ width : 180 , height : 42 , borderRadius :21  , backgroundColor : props.state.fun.Layout_Settings.Icons_Color, justifyContent : 'center' , alignItems : 'center'  }}>
                            <Text style = {{color : 'black'}}>Sign in </Text>
                        </TouchableOpacity>

    
                    </View>
                </View>
    
                
            </ScrollView>
        )
  
}

const mapStateToProps = (state_redux) => {
    let state  = state_redux
    return {state}    
}

const mapDispatchToProps = (dispatch) => ({
    store_pic : (pic) => dispatch({ type : 'fun_sign_up_processed_image' , pic : pic }),
    store_fun_profile : (Profile) => dispatch({ type : 'store_fun_account_info' , Profile : Profile }),
    store_contacts_redux : (Contacts) => dispatch({ type : 'store_active_contacts' , Contacts : Contacts }),
    store_online_chats : (online_chats) => dispatch({ type : 'online_chats' , Online_chats : online_chats }),
    store_messages_redux : (Messages) => dispatch({ type : 'Load_messages' , Messages : Messages }),
    store_positions_redux : (Positions) => dispatch({type : 'chats_positions' , list : Positions}),
    
}) 

export default connect(mapStateToProps, mapDispatchToProps)(Sign_in)


const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : 'black'
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
        color : 'white'
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