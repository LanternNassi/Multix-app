import React , {Component , useEffect} from 'react'
import {Avatar} from 'react-native-elements'
import {View , Text , TextInput , Image , Button, StyleSheet} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Header_business from '../constants/Header_business.js'
import Business_page from './business_tabs/Business_page.js'
import Hiring from './business_tabs/Hiring.js';
import Hires from './business_tabs/Hires.js'
//import transactions from './business_tabs/transactions.js'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { createAppContainer } from 'react-navigation'
import {connect} from 'react-redux'
import * as SQLite from 'expo-sqlite'
import business_database from '../redux/Database_transactions.js'
import Gig_notifications from '../websockets/Gig_notifications.js'
import ProductsScreen from './business_tabs/ProductsScreen.js'


export function business(props) {
        
    const Tab_Navigator = createMaterialTopTabNavigator({
        Business : {
            screen :()=><ProductsScreen type = {'products'}/>,
            navigationOptions : {
                tabBarLabel : 'Products',
            }},
        Deals : {
            screen : ()=><ProductsScreen type = {'deals'}/>,
            navigationOptions : {
                tabBarLabel : 'Deals',
            }},
    
        Hiring : {
            screen : Hires,
            navigationOptions : {
                tabBarLabel : 'Hires',
            }},
        
        
    }, {
        tabBarOptions : {
            showIcon : false,
            showLabel : true,
            style : {
                backgroundColor : props.fun.Layout_Settings.Top_navigation,
                marginTop : 0,
            },
        }
    });

    const Navigator = createAppContainer(Tab_Navigator);
        
    
    return (
        <View style = {{flex : 1}}>
            <Header_business/>
            <Navigator>
                <Business_page/>
            </Navigator>
            
            
        </View>
    )
}
let mapStateToProps = (state_redux) => {
    let state = state_redux.business
    let fun = state_redux.fun
    return {state,fun}

}
let mapDispatchToProps = (dispatch) => ({
    store_gigs_redux : (Gigs) => dispatch({type : 'update_bus_profile' , key : 'Gigs' , value : Gigs}),
    create_request_instances : (token) => dispatch({ type : 'create_business_request_instances' , token : token }),
    start_gig_notifications : (Name) => dispatch({type : 'create_business_websocket_instances' , Instance : Name}),
    store_gig_notifications : (Message) => dispatch({type : 'ws_gig_notifications_message' , Message : Message}),

})
export default connect(mapStateToProps , mapDispatchToProps)(business)

const styles = StyleSheet.create({
   
})
