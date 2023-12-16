
import React , {Component} from 'react'
import {View , Text , TextInput , Image , Button, StyleSheet, ScrollView,TouchableOpacity } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SpeedDial, Card, ListItem,  Icon , Avatar, BottomSheet , Badge} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Chats_bars from '../../components/Chats_bar.js'
import Chats_container from '../../components/Chats_container';
import * as animatable from 'react-native-animatable';
import { FAB,Portal,Provider } from 'react-native-paper';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers'

import {connect} from 'react-redux'

export class Lets_connect extends Component {
    constructor(props){
        super(props)
    }
    state = {
        open : false
    }
    render(){
        return (
                <View style = {{ flex : 1 , backgroundColor : 'white' } }>
                    <Chats_bars/>
                    <Chats_container navigation = {this.props.navigation}/>
                    <TouchableOpacity onPress = {
                        () => {
                            this.props.state.navigation.navigation.navigate('Chats')
                        }
                    } style = {{
                        position : 'absolute',
                        bottom : 0.06 * ScreenHeight,
                        right : 0.09 * ScreenWidth,
                        elevation : 10
                    }}>
                        <Avatar rounded containerStyle = {{ backgroundColor :this.props.fun.Layout_Settings.Icons_surroundings   }} icon = {{ name : 'comment' , type : 'fontawesome' , color : this.props.fun.Layout_Settings.Icons_Color , size : 30}} size = {'large'}/>
                        <View style = {{
                            height : 18,
                            width : 18,
                            borderRadius : 9,
                            backgroundColor : 'pink',
                            top : 2,
                            right : 2,
                            position : 'absolute',
                            alignItems : 'center',
                            //padding : 4
                        }}>
                            <Text>
                            
                            {
                            this.props.fun.Contacts ? (this.props.fun.Contacts.length) : (0)
                            }
                            </Text>
                        </View>
                    </TouchableOpacity>

                </View>
                
        )
    }
        
}
let mapStateToProps = (state_redux) => {
    let state = state_redux.business
    let fun = state_redux.fun
    return {state , fun}

}

let mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps , mapDispatchToProps)(Lets_connect)


const styles = StyleSheet.create({
    header : {
        flexDirection : 'row',
        justifyContent : 'space-between',
    },
    fab : {
        position : 'absolute',
        //top : 0.26 * ScreenHeight,
        right : 0.0001* ScreenWidth,
        bottom : 0.001 * ScreenHeight
    
    }
})