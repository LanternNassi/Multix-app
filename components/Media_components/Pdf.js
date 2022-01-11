import React, { Component } from 'react'
import {View , Text , StyleSheet , TouchableOpacity} from 'react-native'
import {Avatar} from 'react-native-elements'
import { connect } from 'react-redux'
import { ScreenWidth , ScreenHeight} from 'react-native-elements/dist/helpers'
import * as FileSystem from 'expo-file-system'
import * as IntentLauncher from 'expo-intent-launcher'
import * as mime from 'react-native-mime-types'

export const Pdf = (props) => {

    return (
        <TouchableOpacity style = {styles.container} onPress = {
            async ()=>{
                try {
                    const cUri = await FileSystem.getContentUriAsync(props.file)
                    await IntentLauncher.startActivityAsync("android.intent.action.VIEW",{
                        data : cUri,
                        flags : 1,
                        type : mime.lookup(cUri)
                    })
                } catch(e){
                    console.log(e.message)
                }
            }
        } >
            <View style = {styles.accesories}>
                <Avatar rounded size = {'small'} icon = {{ name : 'music' , type : 'font-awesome'}} />
                <Text>
                    { props.file.split('/').pop() }
                </Text>
            </View>
        </TouchableOpacity>
    )
}
const mapStateToProps = (state) => {
    return { state }   
}

const mapDispatchToProps = (dispatch) => ({
    
})


export default connect(mapStateToProps, mapDispatchToProps)(Pdf)

const styles = StyleSheet.create({
    container : {
        height : 0.1 * ScreenHeight ,
        width : 0.4 * ScreenWidth,
        justifyContent : 'center',
        alignItems : 'center'
    },
    accesories : {
        height : 0.06 * ScreenHeight,
        width : 0.3 * ScreenWidth,
    }
})
