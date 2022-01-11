import React, { Component } from 'react'
import { View , Text , TouchableOpacity , StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements'
import { connect } from 'react-redux';
import { ScreenWidth, ScreenHeight } from 'react-native-elements/dist/helpers';

export class Reply_Message extends Component {
    constructor(props){
        super(props)
    }
    convert_time_to_12 = (time) => {
        if ( time.slice(0,2) > 12){
            let new_date = time.slice(0,2)-12 + time.slice(2,time.length) + 'pm'
            return new_date
        } else {
            return time  + 'am'
        }
    }
    render() {
        if (!this.props.type){
            return (
                <View style = {{ alignItems : 'center' }} >
                <View style = {{...styles.container, backgroundColor :  this.props.state.theme.icons_surrounding }}>
                    <View style = {{...styles.replied_text , backround : this.props.state.theme.icons_surrounding}} >
                        <Text style = {{...styles.replied_text_style , color : 'white'}}>
                            { this.props.replied.length > 30 ?this.props.replied.slice(0,30) + '...' : this.props.replied }
                        </Text>
                    </View>
                    <Text style = {{...styles.message, color : 'white' }}>
                        {this.props.messo.length > 200 ? this.props.messo.slice(0,200) + '...' : this.props.messo }
                    </Text>
                </View>
                <Text style = {{ fontWeight : 'bold' }}>{ this.convert_time_to_12(this.props.date)  }</Text>
                </View>
            )

        } else {
            return (
                <View style = {{ alignItems : 'center' }}>
                <View style = {{...styles.container, backgroundColor :  'white' }}>
                <View style = {{...styles.replied_text , backround : 'white'}} >
                    <Text style = {{...styles.replied_text_style , color : 'black'}}>
                        { this.props.replied.length > 30 ?this.props.replied.slice(0,30) + '...' : this.props.replied }
                    </Text>
                </View>
                <Text style = {{...styles.message, color : 'black' }}>
                    {this.props.messo.length > 200 ? this.props.messo.slice(0,200) + '...' : this.props.messo }
                </Text>
             </View>
                <Text>{ this.convert_time_to_12(this.props.date)  }</Text>
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



export default connect(mapStateToProps, null)(Reply_Message)


const styles = StyleSheet.create({
    container : {
        maxWidth : 0.75 * ScreenWidth,
        minHeight : 0.5 * ScreenHeight,
        borderRadius : 10,
        alignItems : 'center',
        padding : 11,
        flexWrap : 'nowrap'
    },
    replied_text : {
        height : 0.09 * ScreenHeight,
        width : 0.2 * ScreenWidth,
        justifyContent : 'center',
        elevation : -10,
        alignItems : 'flex-start',
        borderRadius : 10,
        flexWrap : 'nowrap',
    },
    replied_text_style : {
        fontSize : 9,
    },
    message : {
        fontSize : 14,
        fontWeight : 'bold'
    }
  
})
