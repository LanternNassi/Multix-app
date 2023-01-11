import React, { Component , useEffect , useState } from 'react'
import {View , Text , StyleSheet , Image , TouchableOpacity} from 'react-native'
import {Avatar} from 'react-native-elements'
import { ScreenWidth, ScreenHeight } from 'react-native-elements/dist/helpers';
import { connect } from 'react-redux'
import * as mime from 'react-native-mime-types'
import Chat from '../../websockets/Chat_notifications.js'
import fun_database from '../../redux/Database_fun_transactions.js'
import * as Progress from 'react-native-progress'
import axios from 'axios'



export const Picture = (props) => {
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
    useEffect(async()=>{
        if (props.Status == 'sent' || props.Status == 'delivered' ){
            if(props.type && !props.Seen){
                for(let i = 0; i < props.state.fun.Messages.length; i++){
                    if(props.state.fun.Messages[i].Server_id == props.Server_id){
                        for(let p = 0; p<props.state.fun.Messages[i]['Messages'].length; p++){
                          if (props.state.fun.Messages[i]['Messages'][p]['Muk'] == props.Muk){
                            await fun_database.store_received_media(props.image_uri , 'image').then(async(resource)=>{
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
            console.log(props.Status)
            const upload_media = async (info , file , Server_id , Contact) => {
                 //Storing the message in the database
                 const saved_file = await fun_database.store_sent_message(file)
                 if (props.Status == 'first-tym'){
                    await fun_database.store_message_db({
                        'Contact' : Contact,
                        'Message' : saved_file,
                        'Status' : 'failed',
                        'Date' : new Date().toString(),
                        'Receiving' : false,
                        'Server_id' : Server_id,
                        'forwarded' : false,
                        'Starred' : false,
                        'Replied' : null,
                        'Type' : mime.lookup(saved_file).split('/')[0],
                        'Muk' : props.Muk,
                        'Seen' : true,
                    })
                 } 
              
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
                    url : (props.state.business.Debug) ? ('http://192.168.43.232:8040/Post_media') : ('https://multix-fun.herokuapp.com/Post_media'),
                    data : form,
                    headers : {
                        'content-type' : 'multipart/form-data',
                        'Authorization': 'Token ' + props.state.fun.Fun_profile['Multix_token'] ,
                    },
                    onUploadProgress : (progressEvent) => {
                        setprogress( (progressEvent.loaded/progressEvent.total))
                    }
                }).then(async(response)=>{
                    
                    if (response.status == 201){
                        //console.log(props.state.fun['Messages'][props.Index]['Messages'][props.message_index])
                        //props.notify_status(props.Index , props.message_index)
                        //Sending the message to the receiver
                        await Chat.sendMessage({
                            'type' : 'File',
                            'Receiver' :Server_id,
                            'id' : response.data,
                            'Sender' : props.state.fun.Fun_profile.Server_id,
                            'Name' : props.state.fun.Fun_profile.Name,
                            'Contact' : props.state.fun.Fun_profile.Contact,
                            'Message' : response.data,
                            'forwarded' : false,
                            'Starred' : false,
                            'Type' : mime.lookup(saved_file).split('/')[0],
                            'Replied' : null,
                            'Muk' : props.Muk
                        })
                        await fun_database.update_message_progress(props.Muk , 'sent')
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
                upload_media(props.info , props.image_uri , props.Server_id , props.Contact)
            }
        }
    },[])
    return (
        <View style = {{
            alignItems : 'center'
        }} >
        <TouchableOpacity style = {styles.container} onPress = {
            () => {
                props.state.business.navigation.navigation.navigate('Full View' , {'media_type' : 'Picture' , 'media' : props.image_uri})
            }
        }>
            <Image source = {{ uri : props.image_uri }} style = {styles.image}/>
            {
                (progress >= 1 || props.Status == 'sent')  ?(
                    <Avatar rounded style = {styles.play} icon = {{ name : 'music' , type : 'font-awesome' , color : 'white' }} size = {'large'} />
                ) : (
                    <Progress.CircleSnail  size = { 60 } progress = {progress} color = {'white'} style = { styles.play }/>
                ) 
            }
        </TouchableOpacity>
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


export default connect(mapStateToProps, mapDispatchToProps)(Picture)

const styles = StyleSheet.create({
    container : {
        height : 0.5 * ScreenHeight,
        width : 0.68 * ScreenWidth,
        borderRadius : 20,
        elevation : 20,
        backgroundColor : 'white',
        justifyContent : 'center',
        alignItems : 'center',
    },
    image : {
        height : 0.48 * ScreenHeight,
        width : 0.65 * ScreenWidth,
        // justifyContent : 'center',
        // alignItems : 'center'
    },
    play : {
        position : 'absolute',
        right : 0.13 * ScreenWidth ,
        top : 0.18 * ScreenHeight,
        elevation : 30,
    }
})
