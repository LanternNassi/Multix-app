import React, { Component } from 'react';
import {View , Text , StyleSheet , FlatList , TouchableOpacity , ScrollView , Image} from 'react-native';
import {Avatar , Card } from 'react-native-elements';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { createAppContainer } from 'react-navigation'
import {connect} from 'react-redux';
import {CirclesLoader} from 'react-native-indicator';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import NumberFormat from 'react-number-format'
import Pending from './Contracts_screens/Pending.js'
import Approved from './Contracts_screens/Approved.js'


const tab = createMaterialTopTabNavigator({
    Pending : {
        screen : Pending,
        navigationOptions : {
            tabBarLabel : 'Pending Contracts'
        }
    },
    Approved : {
        screen : Approved,
        navigationOptions : {
            tabBarLabel : 'Approved Contracts'
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

export class Contracts extends Component {
    render() {
        return (
            <View style = {{ flex : 1 }} >
                <Navigator>
                    <Pending/>
                </Navigator>
            </View>
        )
    }
}

let mapDispatchToProps = (dispatch) => ({

})
let mapStateToProps = (state_redux) => {
    let state = state_redux.business
    return {state}

}

export default connect(mapStateToProps , mapDispatchToProps )(Contracts)

