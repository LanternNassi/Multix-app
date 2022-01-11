import React , {Component , useEffect} from 'react'
import {Avatar} from 'react-native-elements'
import {View , Text , TextInput , Image , Button, StyleSheet} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Header_business from '../constants/Header_business.js'
import Business_page from './business_tabs/Business_page.js'
import Hiring from './business_tabs/Hiring.js';
import Hot_deals from './business_tabs/Hot_deals.js'
//import transactions from './business_tabs/transactions.js'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { createAppContainer } from 'react-navigation'
import {connect} from 'react-redux'
import * as SQLite from 'expo-sqlite'
import business_database from '../redux/Database_transactions.js'





export function business(props) {
        
    const Tab_Navigator = createMaterialTopTabNavigator({
        Business : {
            screen :Business_page,
            navigationOptions : {
                tabBarLabel : 'Business',
            }},
        Deals : {
            screen : Hot_deals,
            navigationOptions : {
                tabBarLabel : 'Deals',

            }},
    
        Hiring : {
            screen : Hiring,
            navigationOptions : {
                tabBarLabel : 'Hiring',
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
        
    useEffect(()=>{
        let Gigs = business_database.gig_data();
        props.store_gigs_redux(Gigs)
        props.create_request_instances((props.state.Business_profile.Account)?(props.state.Business_profile.Account.Multix_token) : ('000'))
        
    },
    [])
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
    create_request_instances : (token) => dispatch({ type : 'create_business_request_instances' , token : token })
})
export default connect(mapStateToProps , mapDispatchToProps)(business)

const styles = StyleSheet.create({
   
})
