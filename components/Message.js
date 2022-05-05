import React, { Component , useEffect , useState } from 'react'
import { View , Text , TouchableOpacity , StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements'
import Chat from '../websockets/Chat_notifications.js'
import { connect } from 'react-redux';
import fun_database from '../redux/Database_fun_transactions'
import { ScreenWidth, ScreenHeight } from 'react-native-elements/dist/helpers';

export const Message = (props) =>  {
    //const [results , setresults] = useState(checker(props))
    const convert_time_to_12 = (time) => {
        if ( time.slice(0,2) > 12){
            let new_date = time.slice(0,2)-12 + time.slice(2,time.length) + ' pm'
            return new_date
        } else {
            return time + ' am'
        }
    }

   
    function type_status(){
        if (props.Status == 'failed'){
            return 'history'
        } else if (props.Status == 'sent'){
            return 'bolt'
        } else if (props.Status == 'deliverd'){
            return 'check'
        }
    }
    // function color_type_status(){
    //     if (props.Status == 'failed'){
    //         return 'red'
    //     } else if (props.Status == 'sent'){
    //         return 'red'
    //     } else if (props.Status == 'deliverd'){
    //         return 'red'
    //     }
    // }


    function checker(props){
        if(!props.type){
            // console.log(props.Status)
            if (props.Status == 'first-tym'){
                fun_database.store_message_db({
                    'Contact' : props.Contact,
                    'Message' : props.messo,
                    'Status' : props.fun.Connected ? 'sent' : 'failed',
                    'Date' : new Date().toString(),
                    'Receiving' : false,
                    'Server_id' : props.Server_id,
                    'forwarded' : false,
                    'Starred' : false,
                    'Replied': 'null',
                    'Type' : 'text',
                    'Muk' : props.Muk,
                    'Seen' : true
                })
                Chat.sendMessage({
                    'type' : 'Message',
                    'Receiver' : props.Server_id,
                    'Sender' : props.fun.Fun_profile.Server_id,
                    'Name' : props.fun.Fun_profile.Name,
                    'Contact' : props.fun.Fun_profile.Contact,
                    'Message' : props.messo,
                    'forwarded' : false,
                    'Starred' : false,
                    'Replied' : 'null',
                    'Type' : 'text',
                    'Muk' : props.Muk
                })
                // console.log(props.fun.Messages)
                for(let i = 0; i < props.fun.Messages.length; i++){
                    // console.log(props.fun.Messages[i])
                    if(props.fun.Messages[i].Server_id == props.Server_id){
                        for(let p = 0; p<props.fun.Messages[i]['Messages'].length; p++){
                          if (props.fun.Messages[i]['Messages'][p]['Muk'] == props.Muk){
                            if (props.fun.Connected){
                                props.message_confirmation(i , p , 'sent')
                            } else {
                                props.message_confirmation(i , p , 'failed')
                            }
                          } 
                        } 
                    }
                  }    
                
            } else if ( props.Status === 'failed'){
                
                if(props.fun.Connected){
                    Chat.sendMessage({
                        'type' : 'Message',
                        'Receiver' : props.Server_id,
                        'Sender' : props.fun.Fun_profile.Server_id,
                        'Name' : props.fun.Fun_profile.Name,
                        'Contact' : props.fun.Fun_profile.Contact,
                        'Message' : props.messo,
                        'forwarded' : false,
                        'Starred' : false,
                        'Replied' : 'null',
                        'Type' : 'text',
                        'Muk' : props.Muk
                    })
                    fun_database.update_message_progress(props.Muk , 'sent')
                    for(let i = 0; i < props.fun.Messages.length; i++){
                        // console.log(props.fun.Messages[i])
                        if(props.fun.Messages[i].Server_id == props.Server_id){
                            for(let p = 0; p<props.fun.Messages[i]['Messages'].length; p++){
                              if (props.fun.Messages[i]['Messages'][p]['Muk'] == props.Muk){
                                    // console.log(props.fun.Messages[i]['Messages'][p])
                                    props.message_confirmation(i , p , 'sent')
                                    
                                break
                              } 
                            } 
                        }
                      }    
                } 
                
            }
            return true
        } else {
            return false
        }
    }
    useEffect(async()=>{
         //Veryfing taht the message has been seen 
         if(props.type && !props.Seen){
            for(let i = 0; i < props.fun.Messages.length; i++){
                if(props.fun.Messages[i].Server_id == props.Server_id){
                    for(let p = 0; p<props.fun.Messages[i]['Messages'].length; p++){
                      if (props.fun.Messages[i]['Messages'][p]['Muk'] == props.Muk){
                        props.update_seen(i , p )
                        await fun_database.update_seen_status_message(props.Muk)
                        break
                      } 
                    } 
                }
              }   
        }
        //checker(props)
      
    },[])


    if (!props.type){
        checker(props)
        return (
            <View style = {{ alignItems : 'center' }} >
            <View style = {{  backgroundColor : props.fun.Layout_Settings.Message_component, ...styles.container}}> 
                    <Text style = {{...styles.message_text, color : props.fun.Layout_Settings.Message_text_color }}>
                        {props.messo}
                    </Text>
            </View>
            <View style = {{
                // width : 200,
                flexDirection : 'row',
                justifyContent : 'space-around',
                alignItems : 'center'
            }} >
            <Avatar containerStyle = {{backgroundColor : 'transparent' }} rounded icon = {{name : type_status(), color : 'black', type : 'font-awesome' , size : 12}}/>
            <Text style = {{ fontStyle : 'italic' , fontSize : 12 }}>@{convert_time_to_12(props.date) }</Text>
            </View>
            </View>
        )

    } else {
        return (
            <View  style = {{ alignItems : 'center'}}>
            <View style = {{  backgroundColor : props.fun.Layout_Settings.Sender_component, ...styles.container}}> 
                    <Text style = {{...styles.message_text , color :  props.fun.Layout_Settings.Sender_text_color }}>
                        {props.messo}
                    </Text>
            </View>
            <View style = {{
                flexDirection : 'row',
                justifyContent : 'space-between',
                alignItems : 'center'
            }} >
            <Avatar containerStyle = {{ backgroundColor : 'transparent' }} rounded icon = {{name : type_status(), color : props.Status == 'deliverd'? ('black') : ('black'), type : 'font-awesome' , size : 12}}/>
            <Text style = {{ fontStyle : 'italic' , fontSize : 12 }}>@{convert_time_to_12(props.date) }</Text>
            </View>
            </View>
        )

    }
   
    

  
}


const mapStateToProps = (state_redux) => {
    let state = state_redux.business
    let fun = state_redux.fun
    return {state , fun} 
}

const mapDispatchToProps = (dispatch) => ({
    message_confirmation : (Index , messo_index , status) => dispatch({type : 'message_confirmation' , Index : Index , messo_index : messo_index , status : status }),
    update_seen : (Index , messo_index) => dispatch({type : 'update_seen' , Index : Index , messo_index : messo_index})


})

export default connect(mapStateToProps, mapDispatchToProps)(Message)


const styles = StyleSheet.create({
    container : {
        maxWidth :0.75 * ScreenWidth,
        padding : 11,
        flexWrap : 'nowrap',
        minHeight : 0.04 * ScreenHeight,
        borderRadius : 8,
        alignItems : 'center',
        
    },
    image_wrapper : {
        height : 40,
        width : 40 ,
        borderRadius : 20,
        top : 0,
        alignItems : 'center',
        justifyContent : 'center',
        position : 'relative',
        zIndex : 1,
        top : 0,
        
    },
    text : {
        maxWidth : 0.5 * ScreenWidth,
        justifyContent : 'center',
        alignItems : 'center',
        position : 'relative'
    },
    message_text : {
        fontWeight : "bold",
        fontSize : 14,
        color : 'white',

    }


})
