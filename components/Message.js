import React, { Component } from 'react'
import { View , Text , TouchableOpacity , StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements'
import { connect } from 'react-redux';
import { ScreenWidth, ScreenHeight } from 'react-native-elements/dist/helpers';

export class Message extends Component {
    constructor(props){
        super(props)
    }

    convert_time_to_12 = (time) => {
        if ( time.slice(0,2) > 12){
            let new_date = time.slice(0,2)-12 + time.slice(2,time.length) + ' pm'
            return new_date
        } else {
            return time + ' am'
        }
    }

    render() {
        if (!this.props.type){
            return (
                <View style = {{ alignItems : 'center' }} >
                <View style = {{  backgroundColor : this.props.fun.Layout_Settings.Message_component, ...styles.container}}> 
                        <Text style = {{...styles.message_text, color : this.props.fun.Layout_Settings.Message_text_color }}>
                            {this.props.messo}
                        </Text>
                </View>
                <Text style = {{ fontWeight : 'bold' , fontSize : 10}}>{ this.convert_time_to_12(this.props.date)  }</Text>
                </View>
            )

        } else {
            return (
                <View  style = {{ alignItems : 'center'}}>
                <View style = {{  backgroundColor : this.props.fun.Layout_Settings.Sender_component, ...styles.container}}> 
                        <Text style = {{...styles.message_text , color :  this.props.fun.Layout_Settings.Sender_text_color }}>
                            {this.props.messo}
                        </Text>
                </View>
                <Text>{ this.convert_time_to_12(this.props.date) }</Text>
                </View>
            )

        }
        
    }
}

const mapStateToProps = (state_redux) => {
    let state = state_redux.business
    let fun = state_redux.fun
    return {state , fun} 
}



export default connect(mapStateToProps, null)(Message)


const styles = StyleSheet.create({
    container : {
        maxWidth :0.75 * ScreenWidth,
        padding : 11,
        flexWrap : 'nowrap',
        minHeight : 0.04 * ScreenHeight,
        borderRadius : 8,
        alignItems : 'center',
        
    },
    image_wrapper : {
        height : 40,
        width : 40 ,
        borderRadius : 20,
        top : 0,
        alignItems : 'center',
        justifyContent : 'center',
        position : 'relative',
        zIndex : 1,
        top : 0,
        
    },
    text : {
        maxWidth : 0.5 * ScreenWidth,
        justifyContent : 'center',
        alignItems : 'center',
        position : 'relative'
    },
    message_text : {
        fontWeight : "bold",
        fontSize : 14,
        color : 'white',

    }


})
