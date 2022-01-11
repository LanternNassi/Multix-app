import React, { Component, useEffect , useState} from 'react';
import {View , Text , StyleSheet , FlatList, Image,TouchableOpacity } from 'react-native';
import {Avatar , Card } from 'react-native-elements';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { createAppContainer } from 'react-navigation'
import {connect} from 'react-redux';
import {CirclesLoader} from 'react-native-indicator';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import NumberFormat from 'react-number-format'
import Approved from './Proposals_screens/Approved.js'
import Pending from './Proposals_screens/Pending.js'


const tab = createMaterialTopTabNavigator({
    Pending : {
        screen : Pending,
        navigationOptions : {
            tabBarLabel : 'Pending proposals'
        }
    },
    Approved : {
        screen : Approved,
        navigationOptions : {
            tabBarLabel : 'Approved proposals'
        }
    }
}, {
    tabBarOptions : {
        showIcon : false,
        showLabel : true,
        style : {
            backgroundColor : '#006600',
            marginTop : 0,
            height : 0.08 * ScreenHeight,
        },
    }
    })

const Navigator = createAppContainer(tab)

export function Proposals (props) { 
    useEffect(()=>{
        
    },[props.state.notifications])

  
        return (
            <View style = {{ flex : 1 }}>
                <Navigator>
                    <Pending/>
                </Navigator> 
            </View>
        )
    
}

let mapDispatchToProps = (dispatch) => ({

})
let mapStateToProps = (state_redux) => {
    let state = state_redux.business
    return {state}

}

export default connect( mapStateToProps , mapDispatchToProps )(Proposals)

