import React , {useState , useEffect} from 'react'
import { View , StyleSheet , Text , TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { Sae , Fumi , Kohana , Hoshi } from 'react-native-textinput-effects'
import {connect} from 'react-redux'
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import notify from '../websockets/Notifications.js'
import axios from 'axios'


export function Welcome_Info(props) {
    const [Name , setName] = useState('')
    const [Contact , setContact] = useState('')
    const [notifications_token , setnotificaions_token] = useState('')
    const [pressed , setpressed] = useState(false)

    const [name_error , setname_error] = useState(false)
    const [phone_error , setphone_error] = useState(false)

    useEffect(()=>{
        //props.create_instance();
    })

    const validate_name = () => {
        props.state.request_business_json({
            method : 'POST',
            url : '/Validate_name',
            data : {'Name' : Name}
        }).then((response)=>{
            if (response.status == 207){
                setName('')
                setname_error(true)
            } else {
                setname_error(false)
            }
        })
    }

    const validate_phone = () => {
        props.state.request_business_json({
            method : 'POST',
            url : '/Validate_number',
            data : {'Contact' : Contact}
        }).then((response)=>{
            if (response.status == 207){
                setContact('')
                setphone_error(true)
            } else {
                setphone_error(false)
            }
        })
    }

    return (
        <View style = {styles.container}>
            <View style = {{ top : 20 , alignItems : 'center' }}>   
            <View style = {{ justifyContent : 'space-around' , alignItems : 'center'  }}>
                <Avatar rounded containerStyle = {{ backgroundColor: props.fun.Layout_Settings.Icons_surroundings , elevation : 10 }} icon = {{ name : 'user-plus' , color : props.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }} size = {'medium'} />
                <Text style = {styles.disclaimer}>STEP 1 OF 6</Text>
            </View>
            <View style = {styles.input_container} >
                {
                    name_error ? (
                        <View>
                            <Text style = {{
                                color : 'red',
                                fontSize : 9
                            }}> # The name is already in use by another client . Please kindly use another name </Text>
                        </View>
                    ) : (
                        <View/>
                    )
                }
            <Fumi
                style = {{ width : ScreenWidth-10 }}
                label={'Name'}
                iconClass={FontAwesomeIcon}
                iconName={'user-circle'}
                iconColor={props.fun.Layout_Settings.Icons_Color}
                iconSize={20}
                value = {Name}
                iconWidth={40}
                inputPadding={16}
                inputStyle = {{ color : 'black' }}
                onEndEditing = {
                    (text) => {
                        validate_name()
                    }
                }
                onChangeText = {text =>{
                    setName(text)
                }}
            />
             {
                    phone_error ? (
                        <View>
                            <Text style = {{
                                color : 'red',
                                fontSize : 9
                            }}> # The telephone is already in use by another client </Text>
                        </View>
                    ) : (
                        <View/>
                    )
                }
            <Fumi
                keyboardType = {'numeric'}
                style = {{ width : ScreenWidth-10 }}
                label={'Contact'}
                iconClass={FontAwesomeIcon}
                iconName={'phone'}
                iconColor={props.fun.Layout_Settings.Icons_Color}
                iconSize={20}
                iconWidth={40}
                value = {Contact}
                inputPadding={16}
                inputStyle = {{ color : 'black' }}
                onEndEditing = {
                    (text) => {
                        validate_phone()
                    }
                }
                onChangeText = {text =>{
                    setContact(text)
                }}
            />
            
            
  </View>
  <View style = {{ position : 'relative' , bottom : -20 }}>
        <TouchableOpacity onPress = {
            async ()=>{
                if (!pressed){
                    if (!name_error && !phone_error && Name && Contact){
                        props.cleanup()
                        setpressed(true)
                        //setnotificaions_token(await notify.get_push_notification_token())
                        setTimeout(()=>{
                            props.create_instance();
                            props.send_info_name(Name)
                            props.send_info_contact(Contact)
                            props.send_info_notification_token(notifications_token)
                            //console.log(props.state.Business_sign_up)
                        },800)
                        props.state.navigation.navigation.navigate('Step 2')
                    }else {
                        alert('Please correct the caught errors to continue with the signup')
                    }
                } else {

                } 
            }
        } style = {{ width : 180 , height : 42 , borderRadius :21  , backgroundColor : props.fun.Layout_Settings.Icons_Color, justifyContent : 'center' , alignItems : 'center'  }}>
            <Text style = {{color : 'white'}}>Next</Text>
        </TouchableOpacity>

  </View>
  </View>

        </View>
    )
}
let mapStateToProps = (state_redux) => {
    let state = state_redux.business
    let fun = state_redux.fun
    return {state,fun}
}

let mapDispatchToProps = (dispatch) => ({
    create_instance : () => dispatch({type : 'initiate_business_sign_up'}),
    send_info_name : (Name) => dispatch({type : 'Business account' , key : 'Name' , value : Name}),
    send_info_contact : (Contact) => dispatch({type : 'Business account' , key : 'Contact' , value : Contact}),
    send_info_notification_token : (token) => dispatch({type : 'Business account' , key : 'Notifications_token' , value : token }),
    cleanup : () => dispatch({type : 'Business_account_destroyer'})

})

export default connect(mapStateToProps,mapDispatchToProps)(Welcome_Info)

const styles = StyleSheet.create({
    container : {
        flexDirection : 'column',
        alignItems : 'center',
        flex : 1,
    },
    disclaimer : {
        color : 'black',
        fontSize : 20,
        fontWeight : '700',
    },
    input_container : {
        position : 'relative',
        flexDirection : 'column',
        justifyContent : 'space-around',
        alignItems : 'center',
        height : 200,
        width : ScreenWidth ,
        elevation : 10

    }

})
