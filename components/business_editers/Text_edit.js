import React, { Component , useState } from 'react'
import {View  , Text , StyleSheet , TouchableOpacity , Button , ScrollView} from 'react-native'
import { Avatar , Card} from 'react-native-elements'
import { connect } from 'react-redux'
import * as Animatable from 'react-native-animatable'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import { Sae , Fumi , Kohana , Hoshi } from 'react-native-textinput-effects'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import business_database from '../../redux/Database_transactions'
import * as SQLite from 'expo-sqlite'
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';



const come_out = {
    0 : {
        top : ScreenHeight

    },
    0.5 : {
        top : 0.5 * ScreenHeight,

    },
    1 : {
        top : 0.2 * ScreenHeight,

    }

}

const collapse = {
    0 : {
        top : 0.2 * ScreenHeight,

    },
    0.5 : {
        top : 0.5 * ScreenHeight,


    },
    1 : {
        top : 3 * ScreenHeight

    }

}


export const Text_edit = (props) => {
    const [ value , setvalue ] = useState(props.value)
    const [ done , setdone ] = useState(false)
   

    
    
        return (
            <Animatable.View animation = {props.state.business_edit && !done ? come_out : collapse} style = {styles.container}>
                <ScrollView style = {{
                   
                }}>
                <Card containerStyle = {{
                    backgroundColor:'rgba(0,0,0,0.8)'
                }}>
                    <Card.Title style = {{
                        color : 'white'
                    }}> {(props.type==='Quantity')?('Input quantity'):('Add a review')}</Card.Title>
                    <Card.Divider/>
                    <View style = {styles.text_input}>
                       
                    { props.type === 'Description' ? (
                        <Fumi

                        onChangeText = {
                            (text) =>{
                                setvalue(text)
                            }
                        }
                        value = {value}
                        style = {{ width : 0.8 * ScreenWidth , borderWidth : 1  }}
                        label={props.type}
                        
                        iconClass={FontAwesomeIcon}
                        iconName={props.icon}
                        iconColor={props.state.theme.icons_surrounding}
                        iconSize={20}
                        height = {0.14 * ScreenHeight}
                        iconWidth={40}
                        inputPadding={16}
                        inputStyle = {{ color : 'black' }}
                        multiline = {true}
                        
                        
                    />
                    ) : (
                        <Fumi
                        onChangeText = {
                            (text) =>{
                               setvalue(text)
                            }
                        }
                        value = {value}
                        style = {{ width : 0.8 * ScreenWidth , borderWidth : 1 }}
                        label={props.type}
                        iconClass={FontAwesomeIcon}
                        iconName={props.icon}
                        iconColor={props.state.theme.icons_surrounding}
                        iconSize={20}
                        iconWidth={40}
                        inputPadding={16}
                        inputStyle = {{ color : 'black' }}
                        multiline = {true}
                        
                    />
                    ) }
                    
                    </View>
                    <Text style={{marginBottom: 8 , color : 'white'}}>
                    {(props.type==='Quantity')?('You will be contacted by the sales team shortly after comforming with us'):('How are you finding this product')} 
                        </Text>
                        <Card.Divider/>
                        <View style = {styles.buttons_container}>
                        <Button title = {'Confirm'} onPress = {
                            ()=>{
                               
                                setdone(true)
                                    setTimeout(()=>{
                                        props.notifier([false,'Quantity'])
                                        setdone(false)
                                        props.submit_function(value ,props.product.id ,()=>{
                                            alert('You will be contacted by our sales team shortly.')
                                        })
                                        },800)
                            }
                        }/>
                            
                            <Button onPress = {
                                () =>{
                                    setdone(true)
                                    setTimeout(()=>{
                                        props.notifier([false,'Quantity'])
                                        setdone(false)
                                    },800)
                                }
                            } title = {'Cancel'} titleStyle = {{ color : 'white' }} />
                             
                        </View>

                </Card>
                </ScrollView>
            </Animatable.View>
        )

   


    
}

const mapStateToProps = (state_redux) => {
    let state = state_redux.business
    return {state}
    
}

const mapDispatchToProps = (dispatch) => ({
    notifier : (action) => dispatch({type : 'done' , decide : action}),
    
})

export default connect(mapStateToProps, mapDispatchToProps)(Text_edit)

const styles = StyleSheet.create({
    container : {
        position : 'absolute',
        
    },
    text_input : {
        height : 0.16 * ScreenHeight,
        width : 0.83 * ScreenWidth,
        justifyContent : 'center',
        alignItems : 'center',
    },
    buttons_container : {
        width : 0.82 * ScreenWidth,
        height : 0.08 * ScreenHeight,
        flexDirection :'row',
        justifyContent : 'space-around',
        alignItems : 'center',
    },
    button : {
        width : 0.4 * ScreenWidth,
        height : 48,
        borderRadius : 24,
        flexDirection : 'row',
        justifyContent : 'space-around',
        alignItems : 'center',
    }
})
