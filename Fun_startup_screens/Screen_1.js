import React, { Component  , useState , useEffect} from 'react'
import {View , Text , StyleSheet , TouchableOpacity , ScrollView } from 'react-native'
import {Avatar} from 'react-native-elements'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'
import { Sae , Fumi , Kohana , Hoshi } from 'react-native-textinput-effects'
import fun_sign_up from './SignUpLogic.js'
import axios from 'axios'


export const Fun_1 = (props) => {
    const [Name , SetName] = useState('')
    const [Contact , SetContact] = useState('')
    const [Password , SetPassword] = useState('')
    const [pressed , setpressed] = useState(false)
    const [name_error , setName_error] = useState(null)
    const [contact_error , setcontact_error] = useState(null)
    useEffect(() => {
    })
    const validate_name = () => {
        axios({
            method : 'POST',
            url : props.state.business.Debug ? ('http://192.168.43.232:8040/Verify_name') : ('http://multix-fun.herokuapp.com/Verify_name'),
            data : {'username' : Name}
        }).then((response)=>{
            // console.log(response)
            if (response.status === 200){
                setName_error(false)
            } else if (response.status === 207){
                setName_error(true)
                SetName('')
            }
        })
    }
  
    const validate_contact = () => {
        axios({
            method : 'POST',
            url : props.state.business.Debug ? ('http://192.168.43.232:8040/Verify_contact') : ('http://multix-fun.herokuapp.com/Verify_contact'),
            data : {'contact' : Contact}
        }).then((response)=>{
            if (response.status === 200){
                setcontact_error(false)
            } else if (response.status === 207){
                setcontact_error(true)
                //SetContact('')
            }
        })
    }

    return (
        <ScrollView contentContainerStyle = {{
            alignItems : 'center',
            justifyContent : 'center',
        }} horizontal = {false} style = {styles.container}>
            
            <View style = {styles.input_container}>
                <View style = {styles.header}>
                <Avatar icon = {{ name : 'cloud-upload' , type : 'fontawesome' , size : 40 , color : props.state.fun.Layout_Settings.Icons_Color }} size = {'medium'} />
                    <Text style = {styles.Header_text}>
                        Welcome to Multix . We are happy to have you here at the moment.... Please take your time 
                        through the registration process to get in touch with us fully
                    </Text>

                </View>
                {
                    name_error ? (
                        <View>
                        <Text style = {{ fontSize : 10 , color : 'red' }}>
                           # Name is already in use by another client, Please input another name
                        </Text>
                    </View>
                    ) : (<View/>)
                }
              
                <Fumi
                    style = {{ width : ScreenWidth-10 }}
                    label={'Name'}
                    iconClass={FontAwesomeIcon}
                    iconName={'user'}
                    value = {Name}
                    iconColor={props.state.fun.Layout_Settings.Icons_Color}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    inputStyle = {{ color : 'black' }}
                    onChangeText = { text => {
                        SetName(text)
                    } }
                    onEndEditing = {
                        text => {
                           validate_name()
                        }
                    }
                />
                 {
                    contact_error ? (
                        <View>
                        <Text style = {{ fontSize : 10 , color : 'red' }}>
                           # Contact is already in use by another client, Please input another contact
                        </Text>
                    </View>
                    ) : (<View/>)
                }
              
                    <Fumi
                    style = {{ width : ScreenWidth-10 }}
                    label={'Contact'}
                    iconClass={FontAwesomeIcon}
                    iconName={'phone'}
                    iconColor={props.state.fun.Layout_Settings.Icons_Color}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    inputStyle = {{ color : 'black' }}
                    onChangeText = { text => {
                        SetContact(text)
                    } }
                    onEndEditing = {
                        text => {
                           validate_contact()
                        }
                    }
                />
                <View/>
                <Fumi
                    style = {{ width : ScreenWidth-10 }}
                    label={'Password'}
                    iconClass={FontAwesomeIcon}
                    iconName={'eye-slash'}
                    iconColor={props.state.fun.Layout_Settings.Icons_Color}
                    iconSize={20}
                    secureTextEntry = {false}
                    iconWidth={40}
                    inputPadding={16}
                    inputStyle = {{ color : 'black' }}
                    onChangeText = { text => {
                        SetPassword(text)
                    } }
                />
                
                 <View style = {{ position : 'relative' , height : ScreenHeight * 0.2 , top : 50 , bottom : 0 }}>
                    <TouchableOpacity onPress = {
                        () => {
                            if ( !name_error ){
                                if (!pressed){
                                    setpressed(true)
                                    props.intiate_sign_up_process()
                                    props.store_Name(Name)
                                    props.store_Contact(Contact)
                                    props.store_Password(Password)
                                    props.state.business.navigation.navigation.navigate('Email')
                                }
                            } else {
                                alert('Please validate the suggested queries to proceed with the sign up')
                            }
                           
                        }
                    } style = {{ width : 180 , height : 42 , borderRadius :21  , backgroundColor : props.state.fun.Layout_Settings.Icons_Color, justifyContent : 'center' , alignItems : 'center'  }}>
                        <Text style = {{color : 'white'}}>Continue with signup</Text>
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
    intiate_sign_up_process : () => dispatch({type : 'initiate_sign_up'}),
    store_Name : (Name) => dispatch({type : 'sign_up_info' , key : 'Name' , value : Name}),
    store_Password : (Password) => dispatch({ type : 'sign_up_info' , key : 'Password' , value : Password.trim()}),
    store_Contact : (Contact) =>{
        let number = [...Contact]
        if (number[0] == '0'){
            let country_code = ['+','2','5','6']
            for( let i=0; i<=3; i++){
                if (number[0] == '0'){
                    number.splice(i,1,country_code[i])
                }else {
                    number.splice(i,0,country_code[i])
                }
            }
        }
        for(let i = 0; i < number.length; i++){
            if ( (number[i] === " ") || (number[i] === "-")){
                number.splice(i,1)
            }
            
        }
        dispatch({type : 'sign_up_info' , key : 'Contact' , value : number.join('')})
    } 

}) 
    

export default connect(mapStateToProps, mapDispatchToProps)(Fun_1)

const styles = StyleSheet.create({
    container : {
        flex : 1,
       
    },
    header : {
        height : 0.16 * ScreenHeight,
        width : 0.9 * ScreenWidth,
        justifyContent : 'space-between',
        alignItems : 'center',
        flexWrap : 'nowrap',
        
    },
    Header_text : {
        fontSize : 14,
        fontWeight : 'bold',
    },
    input_container : {
        height : 0.87 * ScreenHeight,
        width : 0.98 * ScreenWidth,
        justifyContent : 'space-around',
        alignItems : 'center'
    }

})
