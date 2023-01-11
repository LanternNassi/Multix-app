import React, { Component  , useState} from 'react'
import {View , Text , StyleSheet , TouchableOpacity , ScrollView , DatePickerAndroid } from 'react-native'
import {Avatar} from 'react-native-elements'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'
import { Sae , Fumi , Kohana , Hoshi } from 'react-native-textinput-effects'


export const Fun_3 = (props) => {
    const [Birthdate , SetBirthdate] = useState('')
    const [Residence , SetResidence] = useState('')
    const [pressed , setpressed] = useState(false)
    
    const pick_Birth_date = async () => {
        try{
            const {action , year , month , day} = await DatePickerAndroid.open({ 
                date : new Date(),
                mode : 'default',
             })

             if (action !== DatePickerAndroid.dismissedAction){
                 SetBirthdate(year + "-" + month + "-" + day)
             }
    
        } catch ({code , message}){
            console.warn("Cannot open date picker",message)
    
        }
    }

    return (
        <ScrollView contentContainerStyle = {{
            alignItems : 'center',
            justifyContent : 'center',
        }} horizontal = {false} style = {styles.container}>

            <View style = {styles.input_container}>
            <View style = {styles.header}>
            <Avatar  source = {require('../assets/Notifications.png')} rounded size = {'medium'} />
                <Text style = {styles.Header_text}>
                    This will help us know you more ....
                </Text>

            </View>
                <Fumi
                    style = {{ width : ScreenWidth-10 }}
                    label={'Residence'}
                    iconClass={FontAwesomeIcon}
                    iconName={'bank'}
                    iconColor={props.state.fun.Layout_Settings.Icons_Color}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    inputStyle = {{ color : 'black' }}
                    onChangeText = { text => {
                        SetResidence(text)
                    } }
                />
                    <Fumi
                    value = {Birthdate}
                    style = {{ width : ScreenWidth-10 }}
                    label={'Date of Birth'}
                    iconClass={FontAwesomeIcon}
                    iconName={'calendar'}
                    iconColor={props.state.fun.Layout_Settings.Icons_Color}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    inputStyle = {{ color : 'black' }}
                    onFocus = {
                        () => {
                            pick_Birth_date()

                        }
                    }
                  
                />
                <View style = {{ position : 'relative' , height : ScreenHeight * 0.2 , top : 50 , bottom : 0 }}>
                    <TouchableOpacity onPress = {
                        () => {
                            if (!pressed){
                                setpressed(true)
                                props.store_birth_date(Birthdate) 
                                props.store_residence(Residence)
                                props.state.business.navigation.navigation.navigate('Profile picture')
                                }
                        }
                    } style = {{ width : 180 , height : 42 , borderRadius :21  , backgroundColor :props.state.fun.Layout_Settings.Icons_Color, justifyContent : 'center' , alignItems : 'center'  }}>
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

const mapDispatchToProps = (dispatch) => ({
    store_residence : (Residence) => dispatch({type : 'sign_up_info' , key : 'Residence' , value : Residence.trim()}),
    store_birth_date : (BirthDate) => dispatch({type : 'sign_up_info' , key : 'Birth_date' , value : BirthDate}),
}) 
    


export default connect(mapStateToProps, mapDispatchToProps)(Fun_3)

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
    }

})
