import React, { Component  , useState} from 'react'
import {View , Text , StyleSheet , TouchableOpacity , ScrollView } from 'react-native'
import {Avatar} from 'react-native-elements'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'
import { Sae , Fumi , Kohana , Hoshi } from 'react-native-textinput-effects'


export const Fun_2 = (props) => {
    const [Email , SetEmail] = useState('')
    const [Nickname , SetNickname] = useState('')
    const [Hobby , SetHobby] = useState('')
    const [pressed , setpressed] = useState(false)
    const [ valid_email , setvalid_email] = useState(false)
    const [email_error , setemail_error] = useState(null)
   

    return (
        <ScrollView contentContainerStyle = {{
            alignItems : 'center',
            justifyContent : 'center',
        }} horizontal = {false} style = {styles.container}>
            
            <View style = {styles.input_container}>
            <View style = {styles.header}>
                <Avatar icon = {{ name : 'cloud-upload' , type : 'fontawesome' , size : 40 , color : props.state.fun.Layout_Settings.Icons_Color }} size = {'medium'} />
                <Text style = {styles.Header_text}>
                    Emails will help lighten up our connection with you for the best experience
                </Text>

            </View>
                {
                    email_error ? (
                        <View>
                        <Text style = {{ fontSize : 10 , color : 'red' }}>
                           # Email is invalid . please input a valid email
                        </Text>
                    </View>
                    ) : (<View/>)
                }
                <Fumi
                    style = {{ width : ScreenWidth-10 }}
                    label={'Email'}
                    iconClass={FontAwesomeIcon}
                    iconName={'envelope'}
                    iconColor={props.state.fun.Layout_Settings.Icons_Color}
                    iconSize={20}
                    value = {Email}
                    iconWidth={40}
                    inputPadding={16}
                    inputStyle = {{ color : 'black' }}
                    onChangeText = { text => {
                        SetEmail(text)
                    } }
                    onEndEditing = {
                        (text) => {
                            if (Email.includes('@gmail.com')){
                                setemail_error(null)
                            } else {
                                setemail_error(true)
                                SetEmail('')
                            }
                        }
                    }
                />
                    <Fumi
                    style = {{ width : ScreenWidth-10 }}
                    label={'Nickname'}
                    iconClass={FontAwesomeIcon}
                    iconName={'smile-o'}
                    iconColor={props.state.fun.Layout_Settings.Icons_Color}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    inputStyle = {{ color : 'black' }}
                    onChangeText = { text => {
                        SetNickname(text)
                    } }
                />
                <Fumi
                    style = {{ width : ScreenWidth-10 }}
                    label={'Hobby, Anything you find interesting'}
                    iconClass={FontAwesomeIcon}
                    iconName={'hourglass-2'}
                    iconColor={props.state.fun.Layout_Settings.Icons_Color}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    inputStyle = {{ color : 'black' }}
                    onChangeText = { text => {
                        SetHobby(text)
                    } }
                />
                <View style = {{ position : 'relative' , height : ScreenHeight * 0.2 , top : 50 , bottom : 0 }}>
                    <TouchableOpacity onPress = {
                        () => {
                            if (!email_error){
                                if (!pressed){
                                    setpressed(true)
                                    props.store_Email(Email)
                                    props.store_Hobby(Hobby)
                                    props.store_Nickname(Nickname)
                                    props.state.business.navigation.navigation.navigate('Birth date')
                                    }
                            } else {
                                alert('Please correct your email address to continue with the sign up')
                            }
                           
                        }
                    } style = {{ width : 180 , height : 42 , borderRadius :21  , backgroundColor : props.state.fun.Layout_Settings.Icons_Color, justifyContent : 'center' , alignItems : 'center'  }}>
                        <Text style = {{color : 'white'}}>Next</Text>
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

const mapDispatchToProps = (dispatch) =>({
    store_Email : (Email)=>dispatch({type : 'sign_up_info' , key : 'Email' , value : Email.trim()}),
    store_Hobby : (Hobby) => dispatch({type : 'sign_up_info' , key : 'Hobby' , value : Hobby.trim()}),
    store_Nickname : (Nickname) => dispatch({ type : 'sign_up_info' , key : 'Nickname' , value : Nickname.trim() })
 
})
    


export default connect(mapStateToProps, mapDispatchToProps)(Fun_2)

const styles = StyleSheet.create({
    container : {
        flex : 1,
       
    },
    header : {
        height : 0.2 * ScreenHeight,
        width : 0.9 * ScreenWidth,
        justifyContent : 'space-between',
        alignItems : 'center',
        flexWrap : 'nowrap'
    },
    Header_text : {
        fontSize : 14,
        fontWeight : 'bold',
    },
    input_container : {
        height : 0.9 * ScreenHeight,
        width : 0.98 * ScreenWidth,
        justifyContent : 'space-around',
        alignItems : 'center'
    }

})
