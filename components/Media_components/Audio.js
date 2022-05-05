import React, { Component , useEffect , useState } from 'react'
import { connect } from 'react-redux'
import {View , Text , StyleSheet , Image , TouchableOpacity} from 'react-native'
import {Avatar} from 'react-native-elements'
import { ScreenWidth, ScreenHeight } from 'react-native-elements/dist/helpers';
import Slider from '@react-native-community/slider'
import { Audio,Video } from 'expo-av';
import axios from 'axios'
import fun_database from '../../redux/Database_fun_transactions.js'
import Chat from '../../websockets/Chat_notifications.js'
import * as mime from 'react-native-mime-types'





export const Audio_comp = (props) => {
    const [playing , setplaying] = useState(false)
    const [sound , setsound] = useState()
    co
    useEffect(async ()=>{
        const { sound: soundObject, status } = await Audio.Sound.createAsync(
            props.audio_uri,
            {},
            (status) => {},
            
          );
        console.log(soundObject)
        console.log(status)
        // setsound(soundObject)

        // if (props.Status == 'sent' || props.Status == 'delivered'){
        //     //Veryfing taht the message has been seen 
        //     if(props.type && !props.Seen){
        //         for(let i = 0; i < props.fun.Messages.length; i++){
        //             if(props.fun.Messages[i].Server_id == props.Server_id){
        //                 for(let p = 0; p<props.fun.Messages[i]['Messages'].length; p++){
        //                   if (props.fun.Messages[i]['Messages'][p]['Muk'] == props.Muk){
        //                     props.Seen(i , p )
        //                     await fun_database.update_seen_status_message(props.Muk)
        //                     break
        //                   } 
        //                 } 
        //             }
        //           }   
        //     }
        // } else if (props.Status == 'first-tym' || props.Status == 'failed') {
        //     const upload_media = async (info , file , Server_id , Contact) => {
        //         const newImageUri = "file:///" + file.split("file:/").join("")
        //         const saved_file = await fun_database.store_sent_message(file)
        //         if (props.Status == 'first-tym'){
        //             //Storing the message in the database
        //            await fun_database.store_message_db({
        //                'Contact' : Contact,
        //                'Message' : saved_file,
        //                'Status' : 'sent',
        //                'Date' : new Date().toString(),
        //                'Receiving' : false,
        //                'Server_id' : Server_id,
        //                'forwarded' : false,
        //                'Starred' : false,
        //                'Replied' : null,
        //                'Type' : mime.lookup(saved_file).split('/')[0],
        //                'Muk' : props.Muk,
        //                'Seen' : true
        //            })
        //        }
        //         const new_file = {
        //             uri : newImageUri,
        //             type : mime.lookup(newImageUri),
        //             name : newImageUri.split("/").pop()
        //         }
        //         const form = new FormData()
        //         form.append('To' , info['To'])
        //         form.append('forwarded' , info['forwarded'])
        //         form.append('Reply' , info['Reply'])
        //         form.append('File' , new_file )
        //         axios({
        //             method : 'POST',
        //             url : props.business.Debug ? ('http://192.168.43.232:8040/Post_media') : ('http://multix-fun.herokuapp.com/Post_media'),
        //             data : form,
        //             timeout : 0,
        //             headers : {
        //                 'content-type' : 'multipart/form-data',
        //                 'Authorization': 'Token ' + props.fun.Fun_profile['Multix_token'] ,
        //             },
        //             onUploadProgress : (progressEvent) => {
        //                 setprogress( (progressEvent.loaded/progressEvent.total))
        //             }
        //         }).then(async(response)=>{
        //             if (response.status == 201){
        //                 // props.notify_status(props.Index , props.message_index)
                       
        //                 //Sending the message to the receiver
        //                 await Chat.sendMessage({
        //                     'type' : 'File',
        //                     'Receiver' :Server_id,
        //                     'id' : response.data,
        //                     'Sender' : props.fun.Fun_profile.Server_id,
        //                     'Name' : props.fun.Fun_profile.Name,
        //                     'Contact' : props.fun.Fun_profile.Contact,
        //                     'Message' : response.data,
        //                     'forwarded' : 'false',
        //                     'Starred' : false,
        //                     'Type' : mime.lookup(saved_file).split('/')[0],
        //                     'Replied' : null,
        //                     'Muk' : props.Muk,
        //                 })

        //                 // Clearing the textinput for more  input

        //                 await fun_database.update_message_progress(props.Muk , 'sent')
        //                 console.log(props.Status)
        //                 for(let i = 0; i < props.fun.Messages.length; i++){
        //                     // console.log(props.fun.Messages[i])
        //                     if(props.fun.Messages[i].Server_id == props.Server_id){
        //                         for(let p = 0; p<props.fun.Messages[i]['Messages'].length; p++){
        //                         console.log(props.fun.Messages[i]['Messages'][p]['Muk'] , ' ' , props.Muk )
        //                           if (props.fun.Messages[i]['Messages'][p]['Muk'] == props.Muk){
        //                             props.message_confirmation(i , p , 'sent')
        //                             break
        //                           } 
        //                         } 
        //                     }
        //                   }   
                      
        //             }
        //             else {
        //                 if (props.Status == 'first-tym'){
        //                     await fun_database.update_message_progress(props.Muk , 'failed')
        //                     for(let i = 0; i < props.state.fun.Messages.length; i++){
        //                         // console.log(props.fun.Messages[i])
        //                         if(props.fun.Messages[i].Server_id == props.Server_id){
        //                             for(let p = 0; p<props.fun.Messages[i]['Messages'].length; p++){
        //                               if (props.fun.Messages[i]['Messages'][p]['Muk'] == props.Muk){
        //                                     props.message_confirmation(i , p , 'failed')
        //                                 break
        //                               } 
        //                             } 
        //                         }
        //                       } 
        //                 }
        //             }
                   
        //         }).catch(async()=>{
        //             if (props.Status == 'first-tym'){
        //                 await fun_database.update_message_progress(props.Muk , 'failed')
        //                 for(let i = 0; i < props.fun.Messages.length; i++){
        //                     // console.log(props.fun.Messages[i])
        //                     if(props.fun.Messages[i].Server_id == props.Server_id){
        //                         for(let p = 0; p<props.fun.Messages[i]['Messages'].length; p++){
        //                           if (props.fun.Messages[i]['Messages'][p]['Muk'] == props.Muk){
        //                                 props.message_confirmation(i , p , 'failed')
        //                             break
        //                           } 
        //                         } 
        //                     }
        //                   } 
        //             }
        //         })
        //     }
        //     if (!props.type){
        //         upload_media(props.info , props.audio_uri , props.Server_id , props.Contact)
        // }
        //}
    },[])
    return (
        <View style = {styles.container} >
            <Avatar rounded containerStyle = {{ backgroundColor : props.fun.Layout_Settings.Icons_Color , elevation : 18  }} icon = {{ name : playing === true? 'play':'pause' , color : props.fun.Layout_Settings.Icons_Color , type : 'font-awesome'  }} size = {'medium'}/>
            <Slider maximumValue = {1}
                disabled = {false}
                onValueChange = {(seconds)=>{
                    // sound.playFromPositionAsync(seconds) 
                }}
                style = {{ width : 0.06 * ScreenWidth }} 
                minimumValue = {0}
                value = {this.state.current_time}
                    maximumTrackTintColor = {'red'} 
                    minimumTrackTintColor = { props.fun.Layout_Settings.Icons_Color}  />
        </View>
    )
}

const mapStateToProps = (state_redux) => {
    let state = state_redux.business
    let fun = state_redux.fun
    return {state,fun}
}

const mapDispatchToProps = (dispatch) => ({
    message_confirmation : (Index , messo_index , status) => dispatch({type : 'message_confirmation' , Index : Index , messo_index : messo_index , status : status }),
    update_seen : (Index , messo_index) => dispatch({type : 'update_seen' , Index : Index , messo_index : messo_index}),

    
})

export default connect(mapStateToProps, mapDispatchToProps)(Audio_comp)

const styles = StyleSheet.create({
    container : {
        width : 0.35 * ScreenWidth,
        height : 0.1 * ScreenHeight,
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        elevation : 9,
        borderRadius : 10,
        backgroundColor : 'red'
    }

})
