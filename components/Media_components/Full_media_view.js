import React, { Component } from 'react'
import {View , Text , StyleSheet , Image} from 'react-native'
import {Avatar} from 'react-native-elements'
import { connect } from 'react-redux'
import { ScreenWidth, ScreenHeight } from 'react-native-elements/dist/helpers';

export const Full_media_view = (props) => {
    if (props.route.params['media_type'] == 'Picture'){
        return (
            <View style = {styles.container}>
                <Image source = {{ uri : props.route.params['media'] }} style = {{ flex : 1 }} />
            </View>
        )
    } else {
        return (
            <View>
                
            </View>
        )
    }
   
}

const mapStateToProps = (state) => {
    return { state }   
}

const mapDispatchToProps = (dispatch) => ({
    
})


export default connect(mapStateToProps, mapDispatchToProps)(Full_media_view)

const styles = StyleSheet.create({
    container : {
        width : ScreenWidth, 
        height : 0.9 * ScreenHeight,
    }
})
