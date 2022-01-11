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
    convert_time_to_12 = (time) => {
        if ( time.slice(0,2) > 12){
            let new_date = time.slice(0,2)-12 + time.slice(2,time.length) + ' pm'
            return new_date
        } else {
            return time + ' am'
        }
    }
    useEffect(()=>{
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
            upload_media(props.info , props.image_uri , props.Server_id , props.Contact)
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
                (progress >= 1 || props.Status == 'finished')  ?(
                    <Avatar rounded style = {styles.play} icon = {{ name : 'music' , type : 'font-awesome' , color : 'white' }} size = {'large'} />
                ) : (
                    <Progress.CircleSnail  size = { 60 } progress = {progress} color = {'white'} style = { styles.play }/>
                ) 
            }
        </TouchableOpacity>
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
    },
    play : {
        position : 'absolute',
        right : 0.13 * ScreenWidth ,
        top : 0.18 * ScreenHeight,
        elevation : 30,
    }
})
