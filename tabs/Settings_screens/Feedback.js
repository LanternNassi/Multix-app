import React, { Component , useEffect , useState } from 'react'
import {View , Text , StyleSheet , TouchableOpacity , TextInput , ScrollView} from 'react-native'
import {Avatar} from 'react-native-elements'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import { Sae , Fumi , Kohana , Hoshi } from 'react-native-textinput-effects'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import { connect } from 'react-redux'
import axios from 'axios'
import Spinner from 'react-native-loading-spinner-overlay'


export const Feedback = (props) => {
    const [ feedback , setfeedback ] = useState('')
    const {type} = props.route.params
    const [spin , setspin] = useState(false)

    const submit = () => {
        if (type === 'Feedback'){
            console.log(props.fun.Fun_profile['Multix_token'])
            axios({
                method : 'POST',
                url : props.business.Debug? ('http://192.168.43.232:8040/Feedback') : ('http://multix-fun.herokuapp.com/Feedback'),
                data : {'Message': feedback},
                headers : {
                    'content-type' : 'application/json',
                    'Authorization': 'Token ' + props.fun.Fun_profile['Multix_token'],
                }
            }).then((response) => {
                if (response.status === 207){
                    setspin(false)
                    alert('The Multix community is happy to hear from you..Thanks for your feedback')
                    props.business.navigation.navigation.navigate('Multix')
                } else {
                    setspin(false)
                    alert('A problem was encoutered. Please try again with your submission in 10 seconds.. Your Feedback is important to us..')
                    props.business.navigation.navigation.navigate('Multix')
                }
            })
        }else {
            axios({
                method : 'POST',
                url : props.business.Debug ? ('http://192.168.43.232:8040/Issues') : ('http://multix-fun.herokuapp.com/Issues'),
                data : {'Message' : feedback},
                headers : {
                    'content-type' : 'application/json',
                    'Authorization': 'Token ' + props.fun.Fun_profile['Multix_token'] ,
                }
            }).then((response) => {
                if (response.status === 207){
                    setspin(false)
                    alert('We are delighted by your continuous help to the Multix engineers in helping them transition the Multix app to better standards')
                    props.business.navigation.navigation.navigate('Multix')
                } else {
                    setspin(false)
                    alert('A problem was encoutered. Please try again in 20 seconds... Your Issues are our priorities.')
                    props.business.navigation.navigation.navigate('Multix')
                }
            })

        }
    }

    useEffect(()=>{
        //console.log(type)
    },[])

    return (
        <View style = {{ flex : 1  , alignItems : 'center'}} >
            <View style = {styles.header} >
                <Text style = {styles.header_text}>  
                    Please submit your { type } in the input provided below
                </Text>
            </View>
            <Spinner
                visible={spin}
                textContent={'Submitting ' + type + '....'}
                textStyle={{
                    fontSize : 16,
                    color : 'white'
                }}
            />
            <View style = {styles.input} >
                <Fumi
                    onChangeText = {text => {
                        setfeedback(text)
                    }}
                    label = {'Talk to us. We shall be more than glad to hear from you '}
                    iconClass={FontAwesomeIcon}
                    iconName={'user'}
                    iconSize={20}
                    iconWidth={40}
                    inputPadding={16}
                    inputStyle = {{ color : 'black',fontSize: 15, }}
                    style = {{ width : 0.98 * ScreenWidth }}
                    height = {0.28 * ScreenHeight}
                    multiline = {true}
                />
                 <TouchableOpacity onPress = {
                    () => {
                        setspin(true)
                        submit()
                    }
                } style = {{ width : 180 , height : 42 , borderRadius :21  , backgroundColor : props.fun.Layout_Settings.Icons_Color, justifyContent : 'center' , alignItems : 'center'  }}>
                    <Text style = {{color : 'white'}}>Submit</Text>
                </TouchableOpacity>
            </View>

            
        </View>
    )
}

const mapStateToProps = (state) => {
    let fun = state.fun
    let business = state.business
    return {fun , business}   
}

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Feedback)


const styles = StyleSheet.create({

    header : {
        height : 0.25 * ScreenHeight,
        width : ScreenWidth,
        alignItems : 'center',
        justifyContent : 'center',
        
    },
    header_text : {
        fontSize : 13,
        fontWeight : 'bold',
    },
    input : {
        height : 0.46 * ScreenHeight,
        width : ScreenWidth,
        flexDirection : 'column',
        justifyContent : 'space-around',
        alignItems : 'center',
    }

})