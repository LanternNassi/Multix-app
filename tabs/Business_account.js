import React, { Component } from 'react';
import {View , Text , StyleSheet, BackHandler } from 'react-native';
import {Avatar , Card } from 'react-native-elements';
import {connect} from 'react-redux';
import {CirclesLoader} from 'react-native-indicator';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
//Bringing in the tab screens
import Profile from './business_profile_tabs/Profile.js'
import Notifications from './business_profile_tabs/Notifications.js'
import Proposals from './business_profile_tabs/Proposals.js'
import Contracts from './business_profile_tabs/Contracts.js'
import * as animatable from 'react-native-animatable'
import * as SQLite from 'expo-sqlite'



const Tab = createBottomTabNavigator();


export class Business_account extends Component {
  constructor(props){
    super(props)
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    
  }
    state = {
      open : false
    }

    handleBackButtonClick(){
      this.props.state.navigation.navigation.navigate('Multix')
      return true
    }

    fetch_resources = async() => {
      this.props.state.request_business_json({
        method : 'GET',
        url : 'fetch_contracts_notifications_proposals/',
        data : {},
        timeout : 1000000
      }).then((response)=>{
        if (response.status === 200){
          this.setState({ open : true })
          console.log(response.data)
          this.props.store_gig_notifications(response.data)
        }
      })
    }
    //Intermediate = async() => {
      //if (!this.state.open){
        //await this.fetch_resources()
        //setTimeout(async()=>{this.Intermediate()},2000)
      //}
    //}
    componentDidMount = async() =>{
      //await this.Intermediate()
      await this.fetch_resources()
    }
    componentWillMount(){
      BackHandler.addEventListener('hardwareBackPress' , this.handleBackButtonClick)
    }
    componentWillUnmount(){
      BackHandler.removeEventListener('hardwareBackPress' , this.handleBackButtonClick)
    }
   
    state = {
        anime : ''
    }
    render() {
        return (
            <Tab.Navigator initialRouteName = {'PROFILE'}  screenOptions = {{tabBarLabelPosition :'below-icon',
            tabBarShowLabel:'true',
             tabBarHideOnKeyboard : true,
             tabBarActiveBackgroundColor : this.props.fun.Layout_Settings.Bottom_navigation,
             tabBarInactiveBackgroundColor : this.props.fun.Layout_Settings.Bottom_navigation
             
    }}>
      <Tab.Screen  name="PROFILE" component={Profile}
      options={{
        headerShown : false,
        tabBarIcon : ({ color, size}) => (
          <animatable.Text animation = {this.state.anime} iterationCount={'infinite'} direction="alternate">
          <MaterialCommunityIcons name = "account-circle" color = {this.props.fun.Layout_Settings.Bottom_navigation_icons_color} size={26}/>
          </animatable.Text>
        ),
      }}/>
      <Tab.Screen name="CONTRACTS" component={Contracts} options={{
        headerShown : false,
        tabBarIcon : ({ color, size}) => (
          <animatable.Text animation = {this.state.anime} iterationCount={'infinite'} direction="alternate-reverse">
          <MaterialCommunityIcons name = "account-tie" color = {this.props.fun.Layout_Settings.Bottom_navigation_icons_color} size={26}/>
          </animatable.Text>
        ),
      }}/>
      <Tab.Screen name="PROPOSALS" component={Proposals} options={{
        headerShown : false,
        tabBarIcon : ({ color, size}) => (
          <animatable.Text animation = {this.state.anime} iterationCount={'infinite'} direction="alternate">
          <MaterialCommunityIcons name = "account-switch" color = {this.props.fun.Layout_Settings.Bottom_navigation_icons_color} size={26}/>
          </animatable.Text>
        ),
      }} />
      <Tab.Screen name="NOTIFICATIONS" component={Notifications}  options={{
      headerShown : false,
        tabBarIcon : ({ color, size}) => (
          <animatable.Text animation = {this.state.anime} iterationCount={'infinite'} direction="alternate-reverse">
          <MaterialCommunityIcons name = "comment-account" color = {this.props.fun.Layout_Settings.Bottom_navigation_icons_color} size={26}/>
          </animatable.Text>
        ),
      }} />
    
    </Tab.Navigator>
        )
    }
}

let mapDispatchToProps = (dispatch) => ({
  store_profile_redux : (Profile) => dispatch({type : 'update_business_profile' , value : Profile}),
  update_profile_redux : (key , value) => dispatch({type : 'business_profile_up' , key : key , value : value}),
  store_gig_notifications : (Message) => dispatch({type : 'ws_gig_notifications_message' , Message : Message}),


})
let mapStateToProps = (state_redux) => {
  let state = state_redux.business
  let fun = state_redux.fun
    return {state,fun}

}

export default connect( mapStateToProps , mapDispatchToProps )(Business_account)

const styles = StyleSheet.create({


})