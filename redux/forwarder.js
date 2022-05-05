import * as SQLite from 'expo-sqlite'
import * as Contacts from 'expo-contacts';
import axios from 'axios'
import * as FileSystem from 'expo-file-system';
import * as mime from 'react-native-mime-types'
import * as MediaLibrary from 'expo-media-library'
import fun_database from './Database_fun_transactions'
import Chat from '../websockets/Chat_notifications'

export class forwarder{
    static init(props){
        this.props = props
    }
    static message_unique_token_generator = () => {
        let rand_letters = ['A' ,'B' , 'C', 'F' , 'H' , 'j' , 'Y' , 'Z' , 'R' , 'T']
        let rand_symbs  = ['!' , '#' , '%' , '&' , '@' , '&' , '$' , '+' , '|' , '_']
        let token = [...this.props.fun.Fun_profile.Multix_token.slice(0,5)];
        for(let i = 0; i < 6; i++){
            token.push(Math.floor(Math.random()*10))
        }
        for(let i = 0; i<6; i++){
            token.push(rand_letters[Math.floor(Math.random()*10)])
        }
        for(let i = 0; i<6; i++){
            token.push(rand_symbs[Math.floor(Math.random()*10)])
        }
        // console.log(token.join(''))
        return token.join('')
    }
    static Index_checker = (id) => {
        if (this.props.fun.chats_positions){
            for(let i=0; i<(this.props.fun.chats_positions).length; i++){
                if(this.props.fun.chats_positions[i].Server_id === id){
                    return this.props.fun.chats_positions[i].index
                }
            }
            return false
        } else {
            return false
        }
        
    }
    static text_forwarder(Receivers , message , store_redux , send_message_new , create_new_chat_position , update_chat_position , setspin ){
        // A loop that is gonna run for every receiver
        for(let i=0; i<Receivers.length; i++){
            //Generating the Muk key for the message 
            let Muk = this.message_unique_token_generator()
            //Getting the index of the chat
            let index = this.Index_checker(Receivers[i].Server_id ? Receivers[i].Server_id : Receivers[i].id)
            //Saving the message first to the database
            fun_database.store_message_db({
                'Contact' : Receivers[i].Contact,
                'Message' : message,
                'Status' : this.props.fun.Connected ? 'sent' : 'failed',
                'Date' : new Date().toString(),
                'Receiving' : false,
                'Server_id' : Receivers[i].Server_id ? Receivers[i].Server_id : Receivers[i].id,
                'forwarded' : true,
                'Starred' : false,
                'Replied': 'null',
                'Type' : 'text',
                'Muk' : Muk,
                'Seen' : false
            })
            // Sending the message 
            Chat.sendMessage({
                'type' : 'Message',
                'Receiver' : Receivers[i].Server_id ? Receivers[i].Server_id : Receivers[i].id,
                'Sender' : this.props.fun.Fun_profile.Server_id,
                'Name' : this.props.fun.Fun_profile.Name,
                'Contact' : this.props.fun.Fun_profile.Contact,
                'Message' : message,
                'forwarded' : true,
                'Starred' : false,
                'Replied' : 'null',
                'Type' : 'text',
                'Muk' : Muk
            })
            if (index === 0 || index ){
                console.log(index , 'from forwarede')
                store_redux(index , {
                    'id' : 'Not saved',
                    'Contact' : Receivers[i].Contact,
                    'Message' : message,
                    'Receiving' : false,
                    'Date' : new Date().toString(),
                    'Status' : this.props.fun.Connected ? 'sent' : 'failed',
                    'Server_id' : Receivers[i].Server_id ? Receivers[i].Server_id : Receivers[i].id,
                    'Starred' : false,
                    'Type' : 'text',
                    'forwarded' : true,
                    'Muk' : Muk,
                    'Seen' : true,
                })
                update_chat_position(Receivers[i].Server_id ? Receivers[i].Server_id : Receivers[i].id)
            } else {
                let info = {
                    'Server_id' : Receivers[i].Server_id ? Receivers[i].Server_id : Receivers[i].id,
                    'Name' : Receivers[i].Name,
                    'Contact_name' : '@unknown',
                    'Messages' : [
                        { 
                            'id' : 'Not saved',
                            'Contact' : Receivers[i].Contact,
                            'Message' : message,
                            'Receiving' : false,
                            'Date' : new Date().toString(),
                            'Status' : this.props.fun.Connected ? 'sent' : 'failed',
                            'Server_id' : Receivers[i].Server_id ? Receivers[i].Server_id : Receivers[i].id,
                            'Type' : 'text',
                            'Starred' : false,
                            'forwarded' : true,
                            'Muk' : Muk,
                            'Seen' : true
                        }
                    ]
                }
                send_message_new(info)
                //console.log(info)
                create_new_chat_position({
                    'Server_id' : Receivers[i].Server_id ? Receivers[i].Server_id : Receivers[i].id,
                    'index' : index,
                })

            }
            //adding it to our real time redux store
            
            if(i == Receivers.length-1 ){
                setspin(false)
                this.props.state.navigation.navigation.goBack()
                this.props.state.navigation.navigation.goBack()

            }
   

        }

    }

    static async media_forwarder(Receivers , file , store_redux , send_message_new , create_new_chat_position , update_chat_position , setspin ){
        for(let i = 0; i<Receivers.length; i++){
            //Generating the Muk key for the message 
            let Muk = this.message_unique_token_generator()
            //Getting the index of the chat
            let index = this.Index_checker(Receivers[i].Server_id ? Receivers[i].Server_id : Receivers[i].id)
            //storing the media locally
            const saved_file = await fun_database.store_sent_message(file)
            //processing the file
            const newImageUri = "file:///" + file.split("file:/").join("")
            const new_file = {
                uri : newImageUri,
                type : mime.lookup(newImageUri),
                name : newImageUri.split("/").pop()
            }
            const form = new FormData()
            form.append('To' , Receivers[i].Server_id ? Receivers[i].Server_id : Receivers[i].id)
            form.append('forwarded' , true)
            form.append('Reply' , false)
            form.append('File' , new_file )

            //Saving the message first to the database
            await fun_database.store_message_db({
                'Contact' : Receivers[i].Contact,
                'Message' : newImageUri,
                'Status' : this.props.fun.Connected ? 'sent' : 'failed',
                'Date' : new Date().toString(),
                'Receiving' : false,
                'Server_id' : Receivers[i].Server_id ? Receivers[i].Server_id : Receivers[i].id,
                'forwarded' : true,
                'Starred' : false,
                'Replied': 'null',
                'Type' : mime.lookup(saved_file).split('/')[0],
                'Muk' : Muk,
                'Seen' : true
            })
            if (index === 0 || index ){
                store_redux(index , {
                    'id' : 'Not saved',
                    'Contact' : Receivers[i].Contact,
                    'Message' : newImageUri,
                    'Receiving' : false,
                    'Date' : new Date().toString(),
                    'Status' : this.props.fun.Connected ? 'sent' : 'failed',
                    'Server_id' : Receivers[i].Server_id ? Receivers[i].Server_id : Receivers[i].id,
                    'Starred' : false,
                    'Type' : mime.lookup(file).split('/')[0],
                    'forwarded' : true,
                    'Muk' : Muk,
                    'Seen' : true,
                })
                update_chat_position(Receivers[i].Server_id ? Receivers[i].Server_id : Receivers[i].id)
            } else {
                let info = {
                    'Server_id' : Receivers[i].Server_id ? Receivers[i].Server_id : Receivers[i].id,
                    'Name' : Receivers[i].Name,
                    'Contact_name' : '@unknown',
                    'Messages' : [
                        { 
                            'id' : 'Not saved',
                            'Contact' : Receivers[i].Contact,
                            'Message' : saved_file,
                            'Receiving' : false,
                            'Date' : new Date().toString(),
                            'Status' : this.props.fun.Connected ? 'sent' : 'failed',
                            'Server_id' : Receivers[i].Server_id ? Receivers[i].Server_id : Receivers[i].id,
                            'Type' : mime.lookup(file).split('/')[0],
                            'Starred' : false,
                            'forwarded' : true,
                            'Muk' : Muk,
                            'Seen' : true
                        }
                    ]
                }
                send_message_new(info)
                //console.log(info)
                create_new_chat_position({
                    'Server_id' : Receivers[i].Server_id ? Receivers[i].Server_id : Receivers[i].id,
                    'index' : index,
                })

            }

            //sending the message to the servers
            await axios({
                method : 'POST',
                url : (this.props.state.Debug) ? ('http://192.168.43.232:8040/Post_media') : ('https://multix-fun.herokuapp.com/Post_media'),
                data : form,
                headers : {
                    'content-type' : 'multipart/form-data',
                    'Authorization': 'Token ' + this.props.fun.Fun_profile['Multix_token'] ,
                },
                onUploadProgress : (progressEvent) => {
                    // setprogress( (progressEvent.loaded/progressEvent.total))
                }
            }).then(async(response)=>{
                if (response.status == 201){
                    //console.log(props.state.fun['Messages'][props.Index]['Messages'][props.message_index])
                    //props.notify_status(props.Index , props.message_index)
                    //Sending the message to the receiver
                    await Chat.sendMessage({
                        'type' : 'File',
                        'Receiver' : Receivers[i].Server_id ? Receivers[i].Server_id : Receivers[i].id,
                        'id' : response.data,
                        'Sender' : this.props.fun.Fun_profile.Server_id,
                        'Name' : this.props.fun.Fun_profile.Name,
                        'Contact' : this.props.fun.Fun_profile.Contact,
                        'Message' : response.data,
                        'forwarded' : true,
                        'Starred' : false,
                        'Replied' : 'null',
                        'Type' : mime.lookup(saved_file).split('/')[0],
                        'Muk' : Muk
                    })
                    if(i == Receivers.length-1 ){
                        setspin(false)
                        this.props.state.navigation.navigation.goBack()
                        this.props.state.navigation.navigation.goBack()
        
                    }
                    // await fun_database.update_message_progress(props.Muk , 'sent')
                    // for(let i = 0; i < props.fun.Messages.length; i++){
                    //     // console.log(props.fun.Messages[i])
                    //     if(props.fun.Messages[i].Server_id == props.Server_id){
                    //         for(let p = 0; p<props.state.fun.Messages[i]['Messages'].length; p++){
                    //         console.log(props.state.fun.Messages[i]['Messages'][p]['Muk'] , ' ' , props.Muk )
                    //           if (props.state.fun.Messages[i]['Messages'][p]['Muk'] == props.Muk){
                    //             props.message_confirmation(i , p , 'sent')
                    //             break
                    //           } 
                    //         } 
                    //     }
                    //   }   
        
                }
            })
                
               
        }
    }

   
}

export default forwarder

