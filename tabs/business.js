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
import Gig_notifications from '../websockets/Gig_notifications.js'





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
        if (props.state.Business_profile['Account']){
            console.log('opened')
            let notifier = new Gig_notifications(props.state.Business_profile['Account']['Name'] , props.state.Debug)
            notifier.onOpen((e)=>{
              //console.log('opened')
            })
            notifier.onError((error)=>{
              //console.log('error')
              //console.log(error)
              
            })
            notifier.onMessage((message)=>{
              let data = JSON.parse(message.data)
              //console.log(data)
              Setbusiness_anime('')
              Setbusiness_anime('slideInDown')
              axios({
                method : 'GET',
                url : props.state.Debug ? ('http://192.168.43.232:8000/fetch_contracts_notifications_proposals/'):('http://multix-business.herokuapp.com/fetch_contracts_notifications_proposals/') ,
                data : {},
                headers : { 
                  'content-type' : 'application/json',
                  'Authorization': 'Token ' + props.state.Business_profile['Account']['Multix_token'] ,
                  
              }
              }).then((response)=>{
                if (response.status === 200){
                  props.store_gig_notifications(response.data)
                }
              })
            })
            notifier.onClose((e)=>{
              //console.log('closed')
            })
            props.start_gig_notifications(notifier)
          } else {
            //console.log('Didnt quite catch that')
          }
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
    create_request_instances : (token) => dispatch({ type : 'create_business_request_instances' , token : token }),
    start_gig_notifications : (Name) => dispatch({type : 'create_business_websocket_instances' , Instance : Name}),
    store_gig_notifications : (Message) => dispatch({type : 'ws_gig_notifications_message' , Message : Message}),

})
export default connect(mapStateToProps , mapDispatchToProps)(business)

const styles = StyleSheet.create({
   
})
