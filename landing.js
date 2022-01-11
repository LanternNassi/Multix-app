import React , {useState , useEffect} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Fun from './tabs/fun.js';
import business from './tabs/business.js';
import tools from './tabs/tools.js';
import Settings from './tabs/Settings.js';
import {Card, ListItem, Button, Icon} from 'react-native-elements'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as animatable from 'react-native-animatable'
import { connect } from 'react-redux'
import Gig_notifications from './websockets/Gig_notifications.js'
import Chat from './websockets/Chat_notifications.js'
import axios from 'axios'
import fun_database from './redux/Database_fun_transactions.js';
import Reconnectingwebsocket from 'react-native-reconnecting-websocket'



const Tab = createBottomTabNavigator();

export function MyTabs(props) {
  //const nav = {navigation}
  const [fun_anime,Setfun_anime] = useState('')
  const [business_anime,Setbusiness_anime] = useState('')
  const [open , setopen] = useState(false)
  function websockets(){
    setTimeout(()=>{

      function initialise(){
        if (props.state.business.Business_profile['Account']){
          let notifier = new Gig_notifications(props.state.business.Business_profile['Account']['Name'] , props.state.business.Debug)
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
              url : props.state.business.Debug ? ('http://192.168.43.232:8000/fetch_contracts_notifications_proposals/'):('http://multix-business.herokuapp.com/fetch_contracts_notifications_proposals/') ,
              data : {},
              headers : { 
                'content-type' : 'application/json',
                'Authorization': 'Token ' + props.state.business.Business_profile['Account']['Multix_token'] ,
                
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
        // Setting and opening chat stream for fun server if the personnel is authenticated
        if( props.state.fun.Fun_profile['Name']){
  
            //instantiating the first init method
            Chat.init(props.state.fun.Fun_profile['Server_id'],props.state.business.Debug)
  
            //Defining the on message handler for the chat websockets 
            Chat.onMessage(async (Message)=>{
              
              var message = JSON.parse(Message.data)
              if (message['type'] == 'Receive_Message'){
                if (props.state.fun.Fun_profile.Server_id !== message['From'] ){
                  Setfun_anime('')
                  Setfun_anime('slideInDown')
                  let index = fun_database.verify_if_number_exists(props.state.fun.Messages , message['From'])
                  // Checking if the contact has any recent messages in our redux store
                  if (index === 0 || index ){
                      // Checking the type of the message whether its text or not
                      if (message['Type'] == 'text'){
                              //if it is text and known to our redux store
                              props.send_message( index , {
                                'id' : 'Not saved',
                                'Message' : message['Message'],
                                'Receiving' : true,
                                'Date' : new Date().toString(),
                                'status' : 'delivered',
                                'Contact' : message['Contact'],
                                'Server_id' : message['From'],
                                'forwarded' : message['forwarded'],
                                'Starred' : false,
                                'Replied' : message['Replied'],
                                'Type' : 'text',
                            });
                            props.update_chat_position(message['From'])
                            await fun_database.store_message_db({
                                'Contact' : message['Contact'],
                                'Message' : message['Message'],
                                'Status' : 'Delivered',
                                'Date' : new Date().toString(),
                                'Receiving' : true,
                                'Server_id' : message['From'],
                                'forwarded' : message['forwarded'],
                                'Starred' : false,
                                'Replied' : message['Replied'],
                                'Type' : 'text'
                            })
  
                      } else {
                        //Then if it is not text and known to our redux store
                        await fun_database.store_received_media(message['Message'] , message['Type']).then(async(resource)=>{
                          await fun_database.store_message_db({
                            'Contact' : message['Contact'],
                            'Message' : resource,
                            'Status' : 'finished',
                            'Date' : new Date().toString(),
                            'Receiving' : true,
                            'Server_id' : message['From'],
                            'forwarded' : message['forwarded'],
                            'Starred' : false,
                            'Replied' : message['Replied'],
                            'Type' : message['Type']
                          })
                          props.send_message( index , {
                            'id' : 'Not saved',
                            'Message' : resource,
                            'Receiving' : true,
                            'Contact' : message['Contact'],
                            'Date' : new Date().toString(),
                            'Status' : 'finished',
                            'Server_id' : message['From'],
                            'forwarded' : message['forwarded'],
                            'Starred' : false,
                            'Replied' : message['Replied'],
                            'Type' : message['Type'],
                        });
                        props.update_chat_position(message['From'])
                        })
  
                      }
                      // If he is a newbie then we proceed we the code below
                  } else {
                      if (message['Type'] == 'text'){
                        //if they are a newbie and not known to the redux store while the message is text
                          let info = {
                                'Name' : message['Name'],
                                'Server_id' : message['From'],
                                'Contact_name' : '@unknown',
                                'Messages' : [
                                    { 
                                        'id' : 'Not saved',
                                        'Contact' : message['Contact'],
                                        'Message' : message['Message'],
                                        'Receiving' : true,
                                        'Date' : new Date().toString(),
                                        'status' : 'delivered',
                                        'Server_id' : message['From'],
                                        'forwarded' : message['forwarded'],
                                        'Starred' : false,
                                        'Replied' : message['Replied'],
                                        'Type' : 'text'
                                    }
                                ]
                            }
                            props.send_message_new(info)
                            props.create_new_chat_position({
                                'Server_id' : message['From'],
                                'index' : (props.state.fun.Messages.length-1),
                            })
                            await fun_database.store_message_db({
                              'Contact' : message['Contact'],
                              'Message' : message['Message'],
                              'Status' : 'Delivered',
                              'Date' : new Date().toString(),
                              'Receiving' : true,
                              'Server_id' : message['From'],
                              'forwarded' : message['forwarded'],
                              'Starred' : false,
                              'Replied' : message['Replied'],
                              'Type' : 'text'
                            })
                        
                        
                      } else {
                          //if they are a newbie and the message is not text
                          await fun_database.store_received_media(message['Message'] , message['Type']).then(async(resource)=>{
                            await fun_database.store_message_db({
                              'Contact' : message['Contact'],
                              'Message' : resource,
                              'Status' : 'finished',
                              'Date' : new Date().toString(),
                              'Receiving' : true,
                              'Server_id' : message['From'],
                              'forwarded' : message['forwarded'],
                              'Starred' : false,
                              'Replied' : message['Replied'],
                              'Type' : message['Type']
                            })
                            let info = {
                              'Name' : message['Name'],
                              'Server_id' : message['From'],
                              'Contact_name' : '@unknown',
                              'Messages' : [
                                  { 
                                      'id' : 'Not saved',
                                      'Contact' : message['Contact'],
                                      'Message' :resource,
                                      'Receiving' : true,
                                      'Date' : new Date().toString(),
                                      'Status' : 'finished',
                                      'Server_id' : message['From'],
                                      'forwarded' : message['forwarded'],
                                      'Starred' : false,
                                      'Replied' : message['Replied'],
                                      'Type' : message['Type']
                                  }
                              ]
                          }
                          props.send_message_new(info)
                          props.create_new_chat_position({
                              'Server_id' : message['From'],
                              'index' : (props.state.fun.Messages.length-1),
                          })
                        })
                      }
  
                  }
                 
                      
              } else {
                  console.log(message)
              }
              } else if ( message['type'] == 'Heartbeat' ){
                let matched_data = fun_database.online_chats([message['From']] , props.state.fun.Contacts)
                props.update_online_chat(matched_data)
              } else if ( message['type'] == 'Dieing'){
                for (const [key , value] of Object.entries(props.state.fun.Online_chats)){
                  if (value == message['From']){
                    props.disconnect_online_chat(key)
                    break
                  }
                }
              }
            })
  
            //Defining the onOpen handler for the chat websockets
            Chat.onOpen((e)=>{
              //props.notify_disconnect(false)
             setopen(true)
             props.connected(true)
  
            })
            //Defining the onError handler for the chat websockets
            Chat.onError((error)=>{
              props.connected(false)
              props.offline_disconnect_chats()

            })
            Chat.onClose((error)=>{
              //props.notify_disconnect(true)
              setopen(false)
              props.connected(false)
              props.offline_disconnect_chats()

            })
        } 
      }
      //if (!open){
        //initialise()
        //setTimeout(()=>{
          //websockets()
        //},3700)
      //}
      initialise()
    },2000)
   
  }
  useEffect(()=>{
      //Instatiating websockets to the business server
      websockets()
  },[])
  return (
    <Tab.Navigator initialRouteName = {Fun}  screenOptions = {{tabBarLabelPosition :'below-icon',
    tabBarShowLabel:'true', tabBarHideOnKeyboard : true, tabBarInactiveBackgroundColor : props.state.fun.Layout_Settings.Bottom_navigation,
    tabBarActiveBackgroundColor : props.state.fun.Layout_Settings.Bottom_navigation
    }}>
      <Tab.Screen  name="fun" component={Fun}
      options={{
        headerShown : false,
        tabBarIcon : ({ color, size}) => (
          <animatable.Text animation = {fun_anime} iterationCount={4} direction="alternate">
          <MaterialCommunityIcons name = "heart-multiple" color = {props.state.fun.Layout_Settings.Bottom_navigation_icons_color} size={26}/>
          </animatable.Text>
        ),
      }}/>
      <Tab.Screen name="business" component={business} options={{
        headerShown : false,
        tabBarIcon : ({ color, size}) => (
          <animatable.Text animation = {business_anime} iterationCount={4} direction="alternate-reverse">
          <MaterialCommunityIcons name = "battlenet" color = {props.state.fun.Layout_Settings.Bottom_navigation_icons_color} size={26}/>
          </animatable.Text>
        ),
      }}/>
      <Tab.Screen name="Music" component={tools} options={{
        headerShown : false,
        tabBarIcon : ({ color, size}) => (
          <animatable.Text animation = {''} iterationCount={'infinite'} direction="alternate">
          <MaterialCommunityIcons name = "music" color = {props.state.fun.Layout_Settings.Bottom_navigation_icons_color} size={26}/>
          </animatable.Text>
        ),
      }} />
     
      <Tab.Screen name="Settings" component={Settings} options={{
        headerShown : false,
        tabBarIcon : ({ color, size}) => (
          <animatable.Text animation = {''} iterationCount={'infinite'} direction="alternate">
          <MaterialCommunityIcons name = "cog" color = {props.state.fun.Layout_Settings.Bottom_navigation_icons_color} size={26}/>
          </animatable.Text>
        ),
      }} />
    </Tab.Navigator>
  );
}

let mapStateToProps = (state_redux) => {
  let state = state_redux
  return {state}
}

let mapDispatchToProps = (dispatch) => ({
  start_gig_notifications : (Name) => dispatch({type : 'create_business_websocket_instances' , Instance : Name}),
  store_gig_notifications : (Message) => dispatch({type : 'ws_gig_notifications_message' , Message : Message}),
  update_messages : (Name , Content) => dispatch({ type : 'update_messages' , Name : Name , Content : Content}),
  send_message : (Index,message ) => dispatch({type : 'message_handler', content : message , Index : Index }),
  send_message_new : (content) => dispatch({type : 'new_chats' , content : content}),
  create_new_chat_position : (Values) => dispatch({ type : 'new_chats_position' , New : Values }),
  update_chat_position : (Server_id) => dispatch({type : 'update_chats_positions' , Server_id : Server_id }),
  update_online_chat : (chat) => dispatch({type : 'update_online_chat' , chat : chat }),
  disconnect_online_chat : (Name) => dispatch({ type : 'disconnect_online_chat' , Name : Name }),
  notify_disconnect : (value) => dispatch({ type : 'Refresh' , value : value }),
  connected : (value) => dispatch({ type : 'Connected' , value : value }),
  offline_disconnect_chats : () => dispatch({ type : 'offline_disconnect_chats' })
})


export default  connect(mapStateToProps , mapDispatchToProps)(MyTabs)