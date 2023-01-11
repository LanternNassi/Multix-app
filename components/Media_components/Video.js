import React, { Component , useState , useEffect} from 'react'
import {View , Text , StyleSheet, TouchableOpacity , Image} from 'react-native'
import { ScreenWidth, ScreenHeight } from 'react-native-elements/dist/helpers';
import {Avatar} from 'react-native-elements'
import { connect } from 'react-redux'
import { Video, AVPlaybackStatus } from 'expo-av'
import * as VideoThumbnails from 'expo-video-thumbnails';
import * as mime from 'react-native-mime-types'
import Chat from '../../websockets/Chat_notifications.js'
import fun_database from '../../redux/Database_fun_transactions.js'
import * as Progress from 'react-native-progress'
import axios from 'axios'



export const Video_comp = (props) => {
    const [ video , setvideo ] = useState()
    const [thumbnail , setthumbnail] = useState()
    const [maxtime , setmaxtime] = useState(0)
    const [progress , setprogress] = useState(0)

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
    
    function millistoMinutesAndSeconds(millis){
        var minutes = Math.floor((millis/1000)/60);
        var seconds = ((((millis/1000) / 60)-minutes)*60).toFixed(0);
        return (
            seconds == 60 || seconds >= 60 ? 
            (minutes+1) + ":00":
            minutes + ":" + (seconds < 10 ? "0" : "") + seconds
        )

    }

   

    useEffect(async()=>{
        const get_thumbnail = async () => {
            try {
                const thumb = await VideoThumbnails.getThumbnailAsync(
                    uri = props.video_uri,
                    {
                      time: 1000,
                    }
                  );
                  setthumbnail(thumb.uri)
                } catch (e) {
                    console.log(e)
                }
           }
        get_thumbnail()
        if (props.Status == 'sent' || props.Status == 'delivered'){
            //Veryfing taht the message has been seen 
            if(props.type && !props.Seen){
                for(let i = 0; i < props.state.fun.Messages.length; i++){
                    if(props.state.fun.Messages[i].Server_id == props.Server_id){
                        for(let p = 0; p<props.state.fun.Messages[i]['Messages'].length; p++){
                          if (props.state.fun.Messages[i]['Messages'][p]['Muk'] == props.Muk){
                            await fun_database.store_received_media(props.video_uri , 'image').then(async(resource)=>{
                                props.update_seen(i , p )
                                props.update_url(i , resource , p)
                                props.update_Status(i , p , 'delivered')
                                await fun_database.update_seen_status_message(props.Muk)
                                await fun_database.replace_url_database(props.Muk , resource)
                                await fun_database.update_status_message(props.Muk , 'delivered')
                                // break
                            })
                          } 
                        } 
                    }
                  }   
            }
        } else if (props.Status == 'first-tym' || props.Status == 'failed') {
            const upload_media = async (info , file , Server_id , Contact) => {
                const newImageUri = "file:///" + file.split("file:/").join("")
                const saved_file = await fun_database.store_sent_message(file)
                if (props.Status == 'first-tym'){
                    //Storing the message in the database
                   await fun_database.store_message_db({
                       'Contact' : Contact,
                       'Message' : saved_file,
                       'Status' : 'sent',
                       'Date' : new Date().toString(),
                       'Receiving' : false,
                       'Server_id' : Server_id,
                       'forwarded' : false,
                       'Starred' : false,
                       'Replied' : null,
                       'Type' : mime.lookup(saved_file).split('/')[0],
                       'Muk' : props.Muk,
                       'Seen' : true
                   })
               }
                const new_file = {
                    uri : newImageUri,
                    type : mime.lookup(newImageUri),
                    name : newImageUri.split("/").pop()
                }
                const form = new FormData()
                form.append('To' , info['To'])
                form.append('forwarded' , info['forwarded'])
                form.append('Reply' , info['Reply'])
                form.append('File' , new_file )
                axios({
                    method : 'POST',
                    url : props.state.business.Debug ? ('http://192.168.43.232:8040/Post_media') : ('http://multix-fun.herokuapp.com/Post_media'),
                    data : form,
                    timeout : 0,
                    headers : {
                        'content-type' : 'multipart/form-data',
                        'Authorization': 'Token ' + props.state.fun.Fun_profile['Multix_token'] ,
                    },
                    onUploadProgress : (progressEvent) => {
                        setprogress( (progressEvent.loaded/progressEvent.total))
                    }
                }).then(async(response)=>{
                    if (response.status == 201){
                        // props.notify_status(props.Index , props.message_index)
                       
                        //Sending the message to the receiver
                        await Chat.sendMessage({
                            'type' : 'File',
                            'Receiver' :Server_id,
                            'id' : response.data,
                            'Sender' : props.state.fun.Fun_profile.Server_id,
                            'Name' : props.state.fun.Fun_profile.Name,
                            'Contact' : props.state.fun.Fun_profile.Contact,
                            'Message' : response.data,
                            'forwarded' : 'false',
                            'Starred' : false,
                            'Type' : mime.lookup(saved_file).split('/')[0],
                            'Replied' : null,
                            'Muk' : props.Muk,
                        })

                        // Clearing the textinput for more  input

                        await fun_database.update_message_progress(props.Muk , 'sent')
                        console.log(props.Status)
                        for(let i = 0; i < props.state.fun.Messages.length; i++){
                            // console.log(props.fun.Messages[i])
                            if(props.state.fun.Messages[i].Server_id == props.Server_id){
                                for(let p = 0; p<props.state.fun.Messages[i]['Messages'].length; p++){
                                console.log(props.state.fun.Messages[i]['Messages'][p]['Muk'] , ' ' , props.Muk )
                                  if (props.state.fun.Messages[i]['Messages'][p]['Muk'] == props.Muk){
                                    props.message_confirmation(i , p , 'sent')
                                    break
                                  } 
                                } 
                            }
                          }   
                      
                    }
                    else {
                        if (props.Status == 'first-tym'){
                            await fun_database.update_message_progress(props.Muk , 'failed')
                            for(let i = 0; i < props.state.fun.Messages.length; i++){
                                // console.log(props.fun.Messages[i])
                                if(props.state.fun.Messages[i].Server_id == props.Server_id){
                                    for(let p = 0; p<props.state.fun.Messages[i]['Messages'].length; p++){
                                      if (props.state.fun.Messages[i]['Messages'][p]['Muk'] == props.Muk){
                                            props.message_confirmation(i , p , 'failed')
                                        break
                                      } 
                                    } 
                                }
                              } 
                        }
                    }
                   
                }).catch(async()=>{
                    if (props.Status == 'first-tym'){
                        await fun_database.update_message_progress(props.Muk , 'failed')
                        for(let i = 0; i < props.state.fun.Messages.length; i++){
                            // console.log(props.fun.Messages[i])
                            if(props.state.fun.Messages[i].Server_id == props.Server_id){
                                for(let p = 0; p<props.state.fun.Messages[i]['Messages'].length; p++){
                                  if (props.state.fun.Messages[i]['Messages'][p]['Muk'] == props.Muk){
                                        props.message_confirmation(i , p , 'failed')
                                    break
                                  } 
                                } 
                            }
                          } 
                    }
                })
            }
            if (!props.type){
                upload_media(props.info , props.video_uri , props.Server_id , props.Contact)
            }
        }
    },[])
    return (
        <View style = {{
            alignItems : 'center',
        }}>
        <TouchableOpacity style = {styles.container} onPress = {
            async () => {
                if (props.Status == 'delivered'){
                    await video.presentFullscreenPlayer()
                }
            }
        }>
            <Image source = {{ uri : thumbnail }} style = {styles.video}/>
            {
                (progress >= 1 || props.Status == 'sent' ) ?(
                    <Avatar rounded style = {styles.play} icon = {{ name : 'play' , type : 'font-awesome' , color : 'white' }} size = {'large'} />
                ) : (
                    <Progress.CircleSnail size = { 60 } progress = {progress} color = {'white'} style = { styles.play }/>
                ) 
            }
            <View style = {{ height : 0  , width : 0 }}>
            <Video
                ref={async video => {
                    setvideo(video)
                    const status = await video.getStatusAsync()
                    setmaxtime(status.playableDurationMillis)
                } }
                useNativeControls
                resizeMode="contain"
                source = {{uri : props.video_uri}}
                shouldPlay = {false}
            />
            </View>
           
        </TouchableOpacity>
        <Text style = {{ fontSize : 10 , fontWeight : 'bold'}}>
            {millistoMinutesAndSeconds(maxtime)}
        </Text>
        <View style = {{
                // width : 200,
            flexDirection : 'row',
            justifyContent : 'space-around',
            alignItems : 'center'
        }} >
        <Avatar containerStyle = {{backgroundColor : 'transparent' }} rounded icon = {{name : type_status(), color : props.Status == 'deliverd'? ('black') : ('black'), type : 'font-awesome' , size : 12}}/>
        <Text style = {{ fontStyle : 'italic' , fontSize : 12 }}>@{convert_time_to_12(props.date) }</Text>
        </View>
        </View>
    )
}

const mapStateToProps = (state) => {
    return { state }   
}

const mapDispatchToProps = (dispatch) => ({
    // notify_status : (Index , messo_index) => dispatch({ type : 'after_upload_download' , Index : Index , messo_index : messo_index }),
    message_confirmation : (Index , messo_index , status) => dispatch({type : 'message_confirmation' , Index : Index , messo_index : messo_index , status : status }),
    update_seen : (Index , messo_index) => dispatch({type : 'update_seen' , Index : Index , messo_index : messo_index}),
    update_url : (Index , url , messo_index) => dispatch({type : 'update_url' , url : url , Index : Index , messo_index : messo_index}),
    update_Status : (Index , messo_index , Status) => dispatch({type : '' ,  Index : Index , messo_index : messo_index , Status : Status})

})
export default connect(mapStateToProps, mapDispatchToProps)(Video_comp)

const styles = StyleSheet.create({
    container : {
        height : 0.28 * ScreenHeight,
        width : 0.28 * ScreenHeight,
        borderRadius : 0.14 * ScreenHeight,
        elevation : 20,
        backgroundColor : 'white',
        justifyContent : 'center',
        alignItems : 'center',
    },
    video : {
        height : 0.24 * ScreenHeight,
        width : 0.24 * ScreenHeight,
        borderRadius : 0.5 * ( 0.24 * ScreenHeight )
    },
    play : {
        position : 'absolute',
        right : 0.14 * ScreenHeight ,
        top : 0.14 * ScreenHeight,
        elevation : 100,
    }
})
