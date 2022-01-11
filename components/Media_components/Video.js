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

    convert_time_to_12 = (time) => {
        if ( time.slice(0,2) > 12){
            let new_date = time.slice(0,2)-12 + time.slice(2,time.length) + ' pm'
            return new_date
        } else {
            return time + ' am'
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

   

    useEffect(()=>{
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
        if (props.Status == 'finished'){

        } else {
            const upload_media = async (info , file , Server_id , Contact) => {
                const newImageUri = "file:///" + file.split("file:/").join("")
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
                        props.notify_status(props.Index , props.message_index)
                        const saved_file = await fun_database.store_sent_message(file)
                        //Sending the message to the receiver
                        await Chat.sendMessage({
                            'type' : 'File',
                            'Receiver' :Server_id,
                            'id' : response.data,
                            'Sender' : props.state.fun.Fun_profile.Server_id,
                            'Name' : props.state.fun.Fun_profile.Name,
                            'Contact' : props.state.fun.Fun_profile.Contact,
                            'Message' : response.data,
                            'forwarded' : 'Not forwarded',
                            'Starred' : false,
                            'Type' : mime.lookup(saved_file).split('/')[0],
                            'Replied' : null
                        })
                        // Clearing the textinput for more  input
                       //Storing the message in the database
                        await fun_database.store_message_db({
                            'Contact' : Contact,
                            'Message' : saved_file,
                            'Status' : 'finished',
                            'Date' : new Date().toString(),
                            'Receiving' : false,
                            'Server_id' : Server_id,
                            'forwarded' : false,
                            'Starred' : false,
                            'Replied' : null,
                            'Type' : mime.lookup(saved_file).split('/')[0],
                        })
                    }
                    else {
                        console.log(response.status)
                    }
                   
                })
            }
            upload_media(props.info , props.video_uri , props.Server_id , props.Contact)
        }
    },[])
    return (
        <View style = {{
            alignItems : 'center',
        }}>
        <TouchableOpacity style = {styles.container} onPress = {
            async () => {
                await video.presentFullscreenPlayer()
            }
        }>
            <Image source = {{ uri : thumbnail }} style = {styles.video}/>
            {
                (progress >= 1 || props.Status == 'finished') ?(
                    <Avatar rounded style = {styles.play} icon = {{ name : 'music' , type : 'font-awesome' , color : 'white' }} size = {'large'} />
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
        <Text>
        @{convert_time_to_12(props.date)}
        </Text>
        </View>
    )
}

const mapStateToProps = (state) => {
    return { state }   
}

const mapDispatchToProps = (dispatch) => ({
    notify_status : (Index , messo_index) => dispatch({ type : 'after_upload_download' , Index : Index , messo_index : messo_index })
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
        right : 0.08 * ScreenHeight ,
        top : 0.08 * ScreenHeight,
        elevation : 30,
    }
})
