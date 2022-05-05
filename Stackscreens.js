import { registerRootComponent } from 'expo';
import React,{Component,useState,useEffect} from 'react';
import {Avatar,Badge } from 'react-native-elements'
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Keyboard,Share } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import fun_database from './redux/Database_fun_transactions';
import App from './App.js'
import myTabs from './landing.js'
import MyTabs from './landing.js';
import Chats_screen from './components/Chats_screen.js'
import * as Sharing from 'expo-sharing'

import { Provider,connect } from 'react-redux';
import store from './redux/Default_State/State.js';
import Camera_screen  from './hardware/Camera.js';
import Pics_review from './hardware/Pic_review.js';
import Chat_screen_add_conts_to_chat  from './components/Chat_screen_add_conts_to_chat.js';
import Chat_screen_settings from './components/Chat_screen_settings.js';
import Video_screen from './tabs/tools_tabs/Video_screen.js';
// Business signup Screens 
import Welcome_Info from './business_startup_screens/Welcome_Info.js'
import Screen_2 from './business_startup_screens/Screen_2.js'
import Screen_3 from './business_startup_screens/Screen_3.js'
import Screen_4_Billing from './business_startup_screens/Screen_4_Billing.js'
import Screen_5_Pic from './business_startup_screens/Screen_5_Pic.js';
import Screen_6_Preferences from './business_startup_screens/Screen_6_Preferences.js'
//Business screens
import Business_account from './tabs/Business_account.js'
//Gig startup screens
import Credentials from './Gig_startup_screens/Screen_1'
import Extra_info from './Gig_startup_screens/Screen_2'
import Show_case from './Gig_startup_screens/Screen_3'
import Category from './Gig_startup_screens/Screen_4'
//Gig profile screens
import Gig_account from './tabs/Gig_account.js'
import { ScreenWidth } from 'react-native-elements/dist/helpers';
import Account_profile from './tabs/stare_profiles/Account_profile.js';
import GigProfile from './tabs/stare_profiles/Gig_profile.js';

import Selling from './components/Front_actions/Selling.js'

// Fun signUp screens 
import Fun_1 from './Fun_startup_screens/Screen_1.js'
import Fun_2 from './Fun_startup_screens/Screen_2.js'
import Fun_3 from './Fun_startup_screens/Screen_3'
import Fun_4 from './Fun_startup_screens/Screen_4.js'
import Sign_in from './Fun_startup_screens/Sign_in.js'
import WelcomeFun from './Fun_startup_screens/WelcomeFun.js'

//Fun FAB screens 
import Chats_FAB from './components/Lets_connect_FAB_screens/Chats_FAB.js'


//Settings Screens 
import Layout from './tabs/Settings_screens/Layout.js'
import Feedback from './tabs/Settings_screens/Feedback.js'
import Privacy_policy from './tabs/Privacy_policy.js'
import TermsAndConditions from './tabs/Terms_and_conditions.js'

import Full_media_view from './components/Media_components/Full_media_view.js'

function Stackscreens(props) {
    const Stack  =  createStackNavigator();
    const [search , setsearch] = useState(false)
 
   return(
     
     <NavigationContainer>
       <Stack.Navigator initialRouteName = "Welcome" detachInactiveScreens = {true} >
         {
           !props.fun.app_started ? (
            <Stack.Screen name = "Welcome" component = {App} options={{headerShown :false}}/>
           ) : (
             console.log()
           )
         }
         <Stack.Screen name = "Multix" component = {MyTabs} options = {{headerShown : false}}/>
           <Stack.Screen name = "Chat_screen"  component = {Chats_screen} options = {{  headerShown : true,
              headerPressColorAndroid : "black",
              headerTintColor : props.fun.Layout_Settings.Icons_Color,
              headerTitleAlign : 'left',
              headerTransparent : false,
              headerTitle : props.fun.current_chat? (props.fun.current_chat.Name) : ('Multix'),
              headerRight : ()=> 
                <View style = {{
                  flexDirection : 'row',
                  justifyContent : 'flex-end',
                  alignItems : 'center',
                  height:20,
                  width:100,
                  
                }}>
                  <TouchableOpacity style = {{  }}>
                    <Avatar rounded containerStyle = {{ elevation:5 , backgroundColor : props.fun.Layout_Settings.Icons_surroundings }} icon = {{ name : 'envelope' , color : props.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }} size = {'medium'}/>
                  </TouchableOpacity>
                  <TouchableOpacity onPress = {
                    async () => {
                      props.state.navigation.navigation.navigate('Settings',{chat_index : props.fun.current_chat['Index'],
                      Name : props.fun.current_chat['Name'],
                      Profile_pic : props.fun.current_chat['Profile_photo'],
                      Color : props.fun.current_chat['Color']
                    })

                    }
                  }>
                    <Avatar rounded containerStyle = {{ elevation:5, backgroundColor : props.fun.Layout_Settings.Icons_surroundings}} icon = {{ name : 'gear' , color : props.fun.Layout_Settings.Icons_Color , size : 20, type : 'font-awesome' }} size = {'medium'}/>
                  </TouchableOpacity>
                </View>
              ,
              headerLeft : ()=> 
                <TouchableOpacity onPress = {()=>{props.state.navigation.navigation.navigate('Multix')}} style = {{ width : 0.18 * ScreenWidth ,
                 height : 20 , 
                 flexDirection : 'row',
                 alignItems : 'center',
                 

                  }}>
                <Avatar containerStyle = {{backgroundColor : props.fun.Layout_Settings.Icons_surroundings}} rounded icon = {{ name :'arrow-left',color : props.fun.Layout_Settings.Icons_Color,type:'font-awesome'  }} size = {"small"} />
                {props.fun.current_chat.Profile_photo ? (
                  (props.fun.Online_chats[props.fun.current_chat.Name])? (
                    <View>
                      <Avatar  source = {{ uri : props.fun.current_chat.Profile_photo }} rounded size = {'small'}/>
                      <Badge status = {'success'} containerStyle = {{ position : 'absolute' , top : -4 , right : -4 }} />
                    </View>
                  ) : (
                    <Avatar  source = {{ uri : props.fun.current_chat.Profile_photo }} rounded size = {'small'}/>
                  )
                ) : (
                  <Avatar  title = { (props.fun.current_chat.Name).slice(0,2) } containerStyle = {{ backgroundColor : props.fun.current_chat.Color }} rounded size = {'small'}/>
                )}
              </TouchableOpacity>
              
              
          
          }}/>
          <Stack.Screen name = "Settings" component = { Chat_screen_settings  } options = {{ haederShown : true }}/>
          <Stack.Screen name = "Add chats to conversation" component = { Chat_screen_add_conts_to_chat } options = {{ headerShown : true,
          headerTitle : ' ',
            headerLeft : ()=> 
            (search)? 
              <View  style = {{ width : 800 ,
                height : 20 , 
                flexDirection : 'row',
                
                alignItems : 'center',
                

                 }}>
                   <TouchableOpacity onPress = {()=>{ props.state.navigation.navigation.goBack(); setsearch(false)  }}>
               <Avatar containerStyle = {{}} rounded icon = {{ name :'arrow-left',color : props.fun.Layout_Settings.Icons_Color ,type:'font-awesome'  }} size = {"small"} />
               </TouchableOpacity>
             <View style = {{   }} >
             <TextInput  placeholder = {'Search'} style = {{ left : 30 , borderBottomWidth : 1 , width : 200 , height : 50 , fontWeight : '700'  }} />
             </View>
             </View>
             :
             <View style = {{ width : 800 ,
              height : 20 , 
              flexDirection : 'row',
              alignItems : 'center',
               }}>
               <TouchableOpacity onPress = {()=>{props.state.navigation.navigation.goBack(); setsearch(false) }}>
               <Avatar containerStyle = {{}} rounded icon = {{ name :'arrow-left',color : props.fun.Layout_Settings.Icons_Color,type:'font-awesome'  }} size = {"small"} />
               </TouchableOpacity>
               <Text style  ={{ fontSize : 19, fontWeight : '700'  }} > Add chats to conversation  </Text>
             </View>
            ,
            headerRight : ()=> <View style = {{flexDirection : 'row',
            justifyContent : 'center',
            alignItems : 'center',
            height:20,
            width:80}}>
              <TouchableOpacity onPress = {
                ()=> {
                  if(search){
                    Keyboard.dismiss();
                    setsearch(false)
                  } else {
                    setsearch(true);
                  }
                }
                
              }>
              <Avatar rounded containerStyle = {{ elevation:5,}} icon = {{ name : search? 'close' : 'search' , color : props.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }} size = {'small'}/>

              </TouchableOpacity>
             
            </View>
            }}/>
          <Stack.Screen name = "Camera" component = {Camera_screen} options = {{ headerShown : true }}/>
          <Stack.Screen name = "Preview" component = {Pics_review} options = {{ headerShown : true  }}/>
          <Stack.Screen name = "Video" component = {Video_screen} options = {{ headerShown : true }}/>
          {
            // Business sign up stack screens
          }
          <Stack.Screen name = "Welcome Information" component = {Welcome_Info} options = {{ headerShown : true }} />
          <Stack.Screen name = "Step 2" component = {Screen_2} options = {{ headerShown : true }} />
          <Stack.Screen name = "Step 3" component = {Screen_3} options = {{ headerShown : true }} />
          <Stack.Screen name = 'Billing Information' component = {Screen_4_Billing} options = {{ haederShown : true }}/>
          <Stack.Screen name = 'Profile Picture' component = {Screen_5_Pic} options = {{ haederShown : true }}/>
          <Stack.Screen name = 'Certifications And Preferences' component = {Screen_6_Preferences} options = {{ haederShown : true }}/>
          {
            //Business screens
          }
          <Stack.Screen name = 'Business Profile' component = {Business_account} options = {{
            headerShown : true,
            headerTitle : 'Profile',
            headerLeft : ()=> 
            <TouchableOpacity onPress = {()=>{props.state.navigation.navigation.navigate('Multix')}} style = {{ width : 0.22 * ScreenWidth ,
             height : 20 , 
             flexDirection : 'row',
             justifyContent : 'space-around',
             alignItems : 'center',
             

              }}>
            <Avatar containerStyle = {{}} rounded icon = {{ name :'arrow-left',color :props.fun.Layout_Settings.Icons_Color ,type:'font-awesome'  }} size = {"small"} />
          <Avatar rounded containerStyle = {{ elevation : 5 }} source = { props.state.Business_profile.Account.Profile_pic ?({uri : props.state.Business_profile.Account.Profile_pic}) : (require('./assets/Male_no_profile_pic.jpg'))} size = {"small"} />
          </TouchableOpacity>
          
            
          }} />
          {
            //Gig startup screens
          }
          <Stack.Screen name = 'Credentials' component = {Credentials} options = {{ headerShown : true }}/>
          <Stack.Screen name = 'Extra Information' component = {Extra_info} options = {{ headerShown : true }}/>
          <Stack.Screen name = 'Show Case' component = {Show_case} options = {{ headerShown : true }}/>
          <Stack.Screen name = 'Category' component = {Category} options = {{ headerShown : true }}/>
          {
            //Gig Profile Screen
          }
          <Stack.Screen name = 'Gig' component = {Gig_account} options = {{ headerShown : true,
              headerLeft : ()=> 
              <TouchableOpacity onPress = {()=>{props.state.navigation.navigation.navigate('Business Profile')}} style = {{ width : 0.22 * ScreenWidth ,
                height : 20 , 
                flexDirection : 'row',
                justifyContent : 'space-around',
                alignItems : 'center',
                

                }}>
              <Avatar containerStyle = {{}} rounded icon = {{ name :'arrow-left',color : props.state.theme.icons_surrounding,type:'font-awesome'  }} size = {"small"} />
            <Avatar rounded containerStyle = {{ elevation : 5 }} source = {{uri : props.state.Business_profile.Account.Profile_pic}} size = {"small"} />
            </TouchableOpacity>
         
           }}/>

           <Stack.Screen name = 'Account Profile' component = {Account_profile} options = {{ headerShown : true }}/>
           <Stack.Screen name = 'Gig Profile' component = {GigProfile} options = {{ headerShown : true }}/>
           <Stack.Screen name = {'information'} component = {Selling} options = {{ headerShown : true }}/>

          {
            // Fun Screens sign up
          }
          {
            !props.fun.app_started ? (
              <Stack.Screen name = 'Personal info' component = {Fun_1} options = {{ headerShown : true }}/>
            ) : (console.log())
          }
          {
            !props.fun.app_started ? (
              <Stack.Screen name = 'Email' component = {Fun_2} options = {{ headerShown : true }}/>
            ) : (console.log())
          }
          {
            !props.fun.app_started ? (
              <Stack.Screen name = 'Birth date' component = {Fun_3} options = {{ headerShown : true }}/>
            ) : (console.log())
          }
          {
            !props.fun.app_started ? (
              <Stack.Screen name = 'Profile picture' component = {Fun_4} options = {{ headerShown : true }}/>
            ) : (console.log())
          }
            {
              !props.fun.app_started ? (
                <Stack.Screen name = 'Sign in' component = {Sign_in} options = {{ headerShown : true}} />
              ) : (console.log())
            }
            {
              !props.fun.app_started ? (
                <Stack.Screen name = 'Terms And Conditions' component = {TermsAndConditions} options = {{ headerShown : true}}/>
              ) : (console.log())
            }
             {
              !props.fun.app_started ? (
                <Stack.Screen name = 'Welcome to Multix' component = {WelcomeFun} options = {{ headerShown : true }}/>
              ) : (console.log())
            }
          {
            // Fun FAB screens
          }
          <Stack.Screen name = 'Chats' component = {Chats_FAB} options = {{ headerShown : true }} />
          {
            // Settings Screens 
          }
          <Stack.Screen name = 'Layout' component = {Layout} options = {{ headerShown : true }} />
          <Stack.Screen name = 'Feedback' component = {Feedback} options = {{ headerShown : true }}/>
          <Stack.Screen name = 'Privacy Policy' component = {Privacy_policy} options = {{headerShown : true}}/>
          {
            // Full content screen
          }
          <Stack.Screen name = 'Full View' component = {Full_media_view} options = {{ 
            headerShown : true,
            headerTintColor : 'black',
            headerBackgroundContainerStyle : {backgroundColor : 'black'},
             }}/>
          
       </Stack.Navigator>
       
     </NavigationContainer>
     
   );
  }

const mapStateToProps = (state_redux) => {
  let state = state_redux.business
  let fun = state_redux.fun
  return{state , fun}
}

export default connect(mapStateToProps,null)(Stackscreens)
  
  
  