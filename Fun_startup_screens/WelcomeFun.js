import React, { Component , useEffect } from 'react'
import {View , Text , StyleSheet , TouchableOpacity , Image , Button} from 'react-native'
import { Avatar } from 'react-native-elements'
import { connect } from 'react-redux'
import { ScreenHeight , ScreenWidth} from 'react-native-elements/dist/helpers'

export const WelcomeFun = (props) => {
    useEffect(()=>{
        // props.app_started()
    },[])
    return (
        <View style = {styles.container}>
            <Image height = {0.4 * ScreenHeight} width = {0.7 * ScreenWidth}  source = {require('../assets/Notifications.png')} style = {{
                height : 0.75 * ScreenHeight , width : 0.98 * ScreenWidth , opacity : 0.3
            }}/>
            <View style = {styles.holder}>
                <Text style = {styles.heading}>
                    Already have an account ? Just login
                </Text>
                <View style = {styles.buttons}>
                        <Button title = {'Sign up'} onPress = {
                                () => {
                                    props.navigation.navigate('Personal info')
                                }
                        }/>  
                            <Button onPress = {
                                () =>{
                                    props.navigation.navigate('Sign in')
                                }
                            } title = {'Log in'} titleStyle = {{ color : 'white' }} />
                                
                </View>
            </View>
        </View>
    )
}

const mapStateToProps = (state) => {
    return {state}
}

const mapDispatchToProps = (dispatch) =>({
    app_started : () => dispatch({type : 'app_started'}),
})

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeFun)

const styles = StyleSheet.create({
    container : {
        flex : 1 ,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : 'black'

    },
    holder : {
        position : 'absolute',
        height : 0.3 * ScreenHeight,
        width : 0.98 * ScreenWidth,
        justifyContent : 'space-around',
        alignItems : 'center',
        backgroundColor : 'transparent'
    },
    heading : {
        color : 'white',
        fontWeight : 'bold',
        fontSize : 15
    },
    buttons : {
        flexDirection : 'row',
        width : 0.7 * ScreenWidth,
        height : 0.17 * ScreenHeight,
        justifyContent : 'space-between',
        alignItems : 'center',
    }

})
