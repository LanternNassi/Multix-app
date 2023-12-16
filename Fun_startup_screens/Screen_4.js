import React, { Component  , useState} from 'react'
import {View , Text , StyleSheet , TouchableOpacity , ScrollView  , Alert} from 'react-native'
import {Avatar} from 'react-native-elements'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'
import { Sae , Fumi , Kohana , Hoshi } from 'react-native-textinput-effects'
import fun_sign_up from './SignUpLogic.js'
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Spinner from 'react-native-loading-spinner-overlay'
import OneSignal from 'react-native-onesignal';



export const Fun_4 = (props) => {
    const [Pic , SetPic] = useState(false)
    const [Action , setAction] = useState(false)
    const [pressed , setpressed] = useState(false)
    const [spin , setspin] = useState(false)

    return (
        <ScrollView contentContainerStyle = {{
            alignItems : 'center',
            justifyContent : 'center',
        }} horizontal = {false} style = {styles.container}>
            
            <View style = {styles.input_container}>
            <View style = {styles.header}>
            <Avatar  source = {require('../assets/Notifications.png')} rounded size = {'medium'} />

                <Text style = {styles.Header_text}>
                    For the best experience with Multix , we recommend you to have a nice and classic looking profile picture
                </Text>

            </View>
            <Spinner
                visible={spin}
                textContent={'Signing up...'}
                textStyle={styles.spinnerTextStyle}
            />
            <TouchableOpacity style = {styles.input_container_2} onPress = {
                async ()=>{
                    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
                            if (status === "granted"){
                            try {
                                let result = await ImagePicker.launchImageLibraryAsync({
                                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                  allowsEditing: true,
                                  aspect: [4, 3],
                                  quality: 1,
                                });
                                if (!result.cancelled) {
                                    SetPic(result.uri)
                                    setTimeout(()=>{
                                        setAction(true)
                                    } , 100)
                                }
                              } catch (E) {
                                console.log(E);
                              }} else {
                                  console.log("No permissions")
                              }
                }
            } >
                { Action ? ( 
                    <Avatar rounded source = {{ uri : Pic }} size = {'xlarge'}  />

                 ) : (
                    <Avatar rounded containerStyle = {{ backgroundColor : 'rgba(0,0,0,0.7)' }} icon = {{  name : 'user' , type : 'font-awesome' }} size = {'xlarge'}  />
                  ) }
                
                <TouchableOpacity style = {{ position : 'absolute' , top : ScreenHeight * 0.31, right : ScreenWidth *0.3 }} onPress = {
                    async () => {
                        let image = await ImagePicker.launchCameraAsync({mediaTypes : ImagePicker.MediaTypeOptions.Images , allowsEditing : true , aspect : [4,3] , quality : 0.8 , base64 : true})
                        if (image.uri){
                            SetPic(image.uri)
                            setTimeout(()=>{
                                setAction(true)
                            } , 100)
                        } else {
                            console.log("No image")
                        }
                    }
                } >
                <Avatar rounded containerStyle = {{ backgroundColor : 'white' , elevation : 10 ,  }} icon = {{  name : 'camera' , color : props.state.business.theme.icons_surrounding, type : 'font-awesome' }} size = {'medium'} />
                </TouchableOpacity>
            </TouchableOpacity>
            <View style = {{ position : 'relative' , height : ScreenHeight * 0.2 , top : 50 , bottom : 0 }}>
                    <TouchableOpacity onPress = {
                         () => {
                            if (!pressed){
                                setspin(true)
                                setpressed(true)
                                if (Pic){
                                    props.store_pic(Pic)
                                } 
                                setTimeout(async ()=>{
                                    let signUp = new fun_sign_up(props.state.fun.Fun_sign_up , 
                                        props.state.fun.processed_image_fun_sign_up ? (props.state.fun.processed_image_fun_sign_up) : (null),
                                        props.state.business.Debug
                                        )
                                    // Signing up the user to our server
                                    function clean_up(processed_info){
                                        //setting one signal external id for this user
                                        // OneSignal.push(function() {
                                        //     OneSignal.setExternalUserId(processed_info.Profile.Profile['Multix_token']);
                                        //     OneSignal.setEmail(processed_info.Profile.Profile['Email']);
                                        //   });
                                        // console.log(processed_info)
                                        //Loading the profile into redux store for use 
                                        props.store_fun_profile({...processed_info.Profile.Profile , 'Server_id' : processed_info.Profile.Profile.id})
                                        //Loading the contacts into the redux for use
                                        props.store_contacts_redux(processed_info.Contacts) 
                                        props.store_online_chats({})
                                        props.store_messages_redux([])
                                        props.store_positions_redux([])  
                                        setspin(false)                                
                                        //Navigating to the original initial screen after signing up
                                        props.state.business.navigation.navigation.navigate('Multix')
                                    }
                                    signUp.sign_up(clean_up)
                                    
                                },
                                800)
                                }
                        }
                    } style = {{ width : 180 , height : 42 , borderRadius :21  , backgroundColor : props.state.fun.Layout_Settings.Icons_Color, justifyContent : 'center' , alignItems : 'center'  }}>
                        <Text style = {{color : 'black'}}>Sign up</Text>
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
    
    

export default connect(mapStateToProps, mapDispatchToProps)(Fun_4)

const styles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : '#121212'
    },
    spinnerTextStyle: {
        color: '#FFF'
      },
    header : {
        height : 0.3 * ScreenHeight,
        width : 0.9 * ScreenWidth,
        justifyContent : 'space-evenly',
        alignItems : 'center',
        flexWrap : 'nowrap'
    },
    Header_text : {
        fontSize : 14,
        fontWeight : 'bold',
        color : 'white',
    },
    input_container : {
        height : 0.76 * ScreenHeight,
        width : 0.9 * ScreenWidth,
        justifyContent : 'space-around',
        alignItems : 'center'
    },
    input_container_2 : {
        position : 'relative',
        flexDirection : 'column',
        justifyContent : 'space-around',
        alignItems : 'center',
        height : ScreenHeight * 0.5,
        width : ScreenWidth ,
        

    }

})
