import React , {Component} from 'react'
import {Text , View, StyleSheet ,TextInput, TouchableOpacity , FlatList,TouchableNativeFeedback,Share , Keyboard } from 'react-native';
import { Avatar,SpeedDial,Badge } from 'react-native-elements'
import { ScreenWidth, ScreenHeight } from 'react-native-elements/dist/helpers';
import Theme from './../constants/Theme.js'
import {connect} from 'react-redux';
import Message from './Message.js';
import Reply_Message from './Reply_Message.js';
import { FAB,Portal,Provider } from 'react-native-paper';
import { Camera  } from 'expo-camera';
import Camera_Screen from '../hardware/Camera.js'
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Chat from '../websockets/Chat_notifications.js'
import fun_database from '../redux/Database_fun_transactions.js'
import * as Animatable from 'react-native-animatable';
import axios from 'axios'
import FormData, {getHeaders} from 'form-data'
import * as mime from 'react-native-mime-types'
import * as Sharing from 'expo-sharing'
import * as FileSystem from 'expo-file-system';




import Picture from './Media_components/Picture.js'
import Video_comp from './Media_components/Video.js'
import Audio_comp from './Media_components/Audio.js'
import Pdf from './Media_components/Pdf.js'
 
const spread_out = {
    0 : {
        
        width : 1 * ScreenWidth,
        height : 0* ScreenHeight,
        backgroundColor : 'rgba(0,0,0,0)'
    },
   
    0.5 : {
        
        width : 1 * ScreenWidth,
        height : 1 * ScreenHeight,
        backgroundColor : 'rgba(0,0,0,0.4)'
    },
},



 jump_up_timer = {
    0 : {
        left : 0.88*ScreenWidth ,
         bottom : 0.1*ScreenHeight
       
    },
    0.5 : {
        left : 0.88*ScreenWidth ,
        bottom : 0.5*ScreenHeight,
    }
},

ressurect = {
    0 : {
        bottom : 0.03 * ScreenHeight,
    }, 
    0.5 : {
        bottom : 0.45 * ScreenHeight,
    },
    1 : {
        bottom : 0.14 * ScreenHeight
    }
}


reply_message = {
    0 : {
        bottom : 0,
        height : 0,
        width : ScreenWidth,
        backgroundColor : 'rgba(0,0,0,0.6)'

    },
    0.5 : {
        bottom : 0,
        height : 0.09 * ScreenHeight,
        width : ScreenWidth,
        backgroundColor : 'rgba(0,0,0,0.6)'

    },
    1 : {
        bottom : 0,
        height : 0.2 * ScreenHeight,    
        width : ScreenWidth,
        backgroundColor : 'rgba(0,0,0,0.8)'
    }
}


after_reply_message = {
    0 : {
        bottom : 0,
        height : 0.2 * ScreenHeight,
        width : ScreenWidth,
        backgroundColor : 'rgba(0,0,0,0.8)'
    },
    0.5 : {
        bottom : 0,
        height : 0.09 * ScreenHeight,
        width : ScreenWidth,
        backgroundColor : 'rgba(0,0,0,0.6)'

    },
    1 : {
        bottom : 0,
        height : 0,
        width : ScreenWidth,
        backgroundColor : 'rgba(0,0,0,0.6)'

    },
}

 const spread_out_camera = {
    0 : {
        bottom : 0,
        right : 0 ,

    },
    1 : {
        bottom : 0.5*ScreenHeight-90,
        right : 0.5*ScreenWidth-90,
    }

}

class Chats_screen extends Component {
    constructor(props){
        super(props)
    }
    times = 0
    video_uri = ''
    cam = null;
    video_resource = null
    message = null
    messo_flatlist = null;
    state= {
        
        theme : Theme.lovely,
        open : false,
        video : false,
        video_audio_action_icon : 'microphone',
        action_opener : 'plus',
        video_height : 0,
        video_width : 0,
        Are_permissions_granted : false,
        camera_video_active : false,
        message_action : false,
        message : null,
        recording : new Audio.Recording(),
        time_recorded : 0,
        files_picked : null,
        image : null,
        reply : false,
        reply_animation : true,
        //curent_date : 0,

        //cam : null
        //current_index : 0,
        
    }
    
    

    
    store_to_redux = async (file) => {
        // console.log(mime.lookup(file).split('/')[0])
        if (this.state.current_index === 0 || this.state.current_index){
            this.props.send_message( this.state.current_index ,  {
                'id' : 'Not saved',
                'Contact' : this.state.Contact,
                'Message' : file,
                'Receiving' : false,
                'Date' : new Date().toString(),
                'Status' : 'first-tym',
                'Server_id' : this.props.route.params['Server_id'],
                'Starred' : false,
                'Type' : mime.lookup(file).split('/')[0],
                'Muk' : this.message_unique_token_generator()
            });
            this.props.update_chat_position(this.props.route.params['Server_id'])
            
        } else {
            let info = {
                'Server_id' : this.props.route.params['Server_id'],
                'Name' : this.props.route.params['Name'],
                'Contact_name' : '@unknown',
                'Messages' : [
                    { 
                        'id' : 'Not saved',
                        'Contact' : this.state.Contact,
                        'Message' : file,
                        'Receiving' : false,
                        'Date' : new Date().toString(),
                        'Status' : 'first-tym',
                        'Server_id' :this.props.route.params['Server_id'],
                        'Starred' : false,
                        'Type' : mime.lookup(file).split('/')[0],
                        'Muk' : this.message_unique_token_generator()
                    }
                ]
            }
            let index = this.props.state.fun.Messages.length
            this.props.send_message_new(info)
            this.props.create_new_chat_position({
                'Server_id' : this.props.route.params['Server_id'],
                'index' : (index),
            })
            this.setState({current_index : index })
        }
       
    }

  

    Receiver_id = (Name) => {
        for(let i=0; i<(this.props.state.fun.Contacts).length; i++){
            if ( Name === this.props.state.fun.Contacts[i].Name){
                if (this.props.state.fun.Contacts.Server_id){
                    return this.props.state.fun.Contacts[i].Server_id
                } else {
                    return this.props.state.fun.Contacts[i].id
                }
            }
        }
    }

    message_unique_token_generator = () => {
        let rand_letters = ['A' ,'B' , 'C', 'F' , 'H' , 'j' , 'Y' , 'Z' , 'R' , 'T']
        let rand_symbs  = ['!' , '#' , '%' , '&' , '@' , '&' , '$' , '+' , '|' , '_']
        let token = [...this.props.state.fun.Fun_profile.Multix_token.slice(0,5)];
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

    contact = (Server_id) => {
        if ( this.props.state.fun.Contacts[0].Server_id){
            for(let i = 0; i < this.props.state.fun.Contacts.length; i++){
                if (Server_id === this.props.state.fun.Contacts[i].Server_id){
                    return this.props.state.fun.Contacts[i].Contact
                }
            }
        } else {
            for(let i = 0; i < this.props.state.fun.Contacts.length; i++){
                if (Server_id === this.props.state.fun.Contacts[i].id){
                    return this.props.state.fun.Contacts[i].Contact
                }
            }

        }
    }
    current_date = 0;
   
    componentDidMount = ()=>{
        const {Index} = this.props.route.params ;
        const Contact = this.contact(this.props.route.params['Server_id'])
        this.setState({current_index : Index , Contact : Contact})
    }

    UNSAFE_componentWillMount = () =>{
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow' , this._keyboardDidShow)
        this.keyboardDidHidelistener = Keyboard.addListener('keyboardDidHide' , this._keyboardDidHide)
    }

    componentWillUnmount = () =>{
        this.keyboardDidShowListener.remove()
        this.keyboardDidHidelistener.remove()
    }

    _keyboardDidShow = async () =>{
        await Chat.sendMessage({
            'type' : 'Typing' ,
            'Receiver' : this.props.route.params['Server_id'],
        })
    }

    _keyboardDidHide = async () =>{
        await Chat.sendMessage({
            'type' : 'Stop_Typing',
            'Receiver' : this.props.route.params['Server_id'],
        })
    }

    render = () =>{
        const {Name , Index , Server_id} = this.props.route.params ;
        //console.log(Name)
        const receiver_id = this.Receiver_id(Name)
    return (
        
        <View style = {styles.container}>
            <View  style = {{ height : 500  }}>
           <FlatList 
            keyExtractor = { (item,index)=>index.toString()}
            ref = { ref => {
                this.messo_flatlist = ref
            }  }
            inverted = {true}
            data = { this.state.current_index === 0 || this.state.current_index ? this.props.state.fun.Messages[this.state.current_index].Messages : [] }
            horizontal = {false}
            renderItem = { 
                (item,index) => {
                    //let previous_date = this.current_date
                    let previous_item = (item.index) > 0 ? (item.index-1) : (item.index)
                    let number = this.props.state.fun.Messages[this.state.current_index].Messages.length
                    let previous_date = this.props.state.fun.Messages[this.state.current_index].Messages[previous_item]['Date']
                    if (item.item.Type == 'text'){
                        // console.log(item.item)
                       
                        return  (
                            <View style = {{
                                width : ScreenWidth,
                                alignItems : 'center'
                            }}>
                                 {
                                   ((item.index === (number-1) )) ? (
                                       <View style = {{
                                    
                                        //width : 0.3 * ScreenWidth,
                                        alignItems : 'center',
                                        justifyContent : 'center',
                                        border : 0.5,
                                        backgroundColor : 'black',
                                        elevation : 10,
                                        borderRadius : 8
                                       }}>       
                                           <Text style = {{ color : 'white',fontWeight : 'bold' }} > { previous_date.slice(0,15) } </Text>
                                       </View>
                                       ) : (
                                       <View/>
                                   )
                               }
                            <TouchableOpacity style = {{ paddingTop : 10 ,
                                 paddingBottom : 10 ,
                                 alignItems : item.item.Receiving ? 'flex-start' : 'flex-end' , 
                                 width : 0.98 * ScreenWidth  }} onLongPress = {
                                ()=> {
                                    this.setState({selected_message : {
                                        Index : item.index,
                                        Message : item.item
                                    },message_action : true})
                                }
                            } >
                                {
                                    (item.item.Reply == null) ? (
                                        <View style = {{ flexDirection : 'row' , justifyContent : 'space-between'  }}>
                                            {!item.item.Receiving && ( item.item.Starred != 0) && !item.item.forwarded? (
                                            <Avatar rounded containerStyle = {{ backgroundColor : 'transparent' }} size = {'small'} icon = {{ name : 'star' , color : this.props.state.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }}/>
                                            ) : (<View/>)}
                                             {!item.item.Receiving && item.item.forwarded? (
                                            <Avatar rounded containerStyle = {{ backgroundColor : 'transparent' }} size = {'small'} icon = {{ name : 'bullhorn' , color : this.props.state.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }}/>
                                            ) : (<View/>)}
                                            <Message 
                                            messo = {item.item.Message} 
                                            type = {item.item.Receiving}
                                            date = {item.item.Date.slice(16,24) }
                                            Starred = {item.item.Starred}
                                            Contact = {this.state.Contact}
                                            Server_id = {Server_id}
                                            Muk = {item.item.Muk}
                                            Status = {item.item.Status}
                                            forwarded = {item.item.forwarded}
                                            Seen = {item.item.Seen}
                                            />
                                             {item.item.Receiving && (item.item.Starred != 0) && !item.item.forwarded? (
                                            <Avatar rounded containerStyle = {{ backgroundColor : 'transparent' }} size = {'small'} icon = {{ name : 'star' , color : this.props.state.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }}/>
                                            ) : (<View/>)}
                                            {item.item.Receiving && item.item.forwarded? (
                                            <Avatar rounded containerStyle = {{ backgroundColor : 'transparent' }} size = {'small'} icon = {{ name : 'bullhorn' , color : this.props.state.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }}/>
                                            ) : (<View/>)}
                                        </View>
                                        
                                    ) : (
                                        <Reply_Message 
                                            messo = {item.item.Message} 
                                            type = {item.item.Receiving} 
                                            replied = { item.item.Replied }
                                            date = { item.item.Date.slice(16,24)}
                                            />
                                    )
                                }
                            </TouchableOpacity>
                            {
                                   (previous_date.slice(8,10) != item.item.Date.slice(8,10) ) ? (
                                       <View style = {{
                                    
                                        //width : 0.3 * ScreenWidth,
                                        alignItems : 'center',
                                        justifyContent : 'center',
                                        border : 0.5,
                                        backgroundColor : 'black',
                                        elevation : 10,
                                        borderRadius : 8
                                       }} >       
                                           <Text style = {{ color : 'white',fontWeight : 'bold' }} > { previous_date.slice(0,15) } </Text>
                                       </View>
                                       ) : (
                                       <View/>
                                   )
                               }
                        </View>
                        )
                    } else if (item.item.Type == 'image'){
                        return (
                            <View style = {{
                                width : ScreenWidth,
                                alignItems : 'center'
                            }}>
                             
                             {
                                   ((item.index === (number-1) )) ? (
                                       <View style = {{
                                    
                                        //width : 0.3 * ScreenWidth,
                                        alignItems : 'center',
                                        justifyContent : 'center',
                                        border : 0.5,
                                        backgroundColor : 'black',
                                        elevation : 10,
                                        borderRadius : 8
                                       }} >       
                                           <Text style = {{ color : 'white',fontWeight : 'bold' }} > { previous_date.slice(0,15) } </Text>
                                       </View>
                                       ) : (
                                       <View/>
                                   )
                               }
                            <TouchableOpacity style = {{ paddingTop : 10 ,
                                 paddingBottom : 10 ,
                                 alignItems : item.item.Receiving ? 'flex-start' : 'flex-end' , 
                                 width : 0.98 * ScreenWidth  }} onLongPress = {
                                ()=> {
                                    this.setState({selected_message : {
                                        Index : item.index,
                                        Message : item.item
                                    },message_action : true})
                                }
                            } >
                                <View style = {{ flexDirection : 'row' , justifyContent : 'space-between'  }} >
                                {!item.item.Receiving && ( item.item.Starred != 0) && !item.item.forwarded? (
                                <Avatar rounded containerStyle = {{ backgroundColor : 'transparent' }} size = {'small'} icon = {{ name : 'star' , color : this.props.state.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }}/>
                                ) : (<View/>)}
                                {!item.item.Receiving && item.item.forwarded? (
                                    <Avatar rounded containerStyle = {{ backgroundColor : 'transparent' }} size = {'small'} icon = {{ name : 'bullhorn' , color : this.props.state.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }}/>
                                    ) : (<View/>)}
                                        <Picture 
                                        image_uri = {item.item.Message}
                                        info = {{
                                            'To' : Server_id,
                                            'forwarded' : false,
                                            'Reply' : false
                                        }}
                                        Contact = {
                                            this.state.Contact
                                        }
                                        Server_id = {Server_id}
                                        Status = { item.item.Status }
                                        Seen = {item.item.Seeen}
                                        date = {item.item.Date.slice(16,24) }
                                        type = {item.item.Receiving}
                                        Starred = {item.item.Starred}
                                        Index = {Index}
                                        message_index = {item.index}
                                        Muk = {item.item.Muk}
                                    />
                                     {item.item.Receiving && (item.item.Starred || item.item.Starred != 0) && !item.item.forwarded? (
                                    <Avatar rounded containerStyle = {{ backgroundColor : 'transparent' }} size = {'small'} icon = {{ name : 'star' , color : this.props.state.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }}/>
                                    ) : (<View/>)}
                                     {item.item.Receiving && item.item.forwarded? (
                                        <Avatar rounded containerStyle = {{ backgroundColor : 'transparent' }} size = {'small'} icon = {{ name : 'bullhorn' , color : this.props.state.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }}/>
                                        ) : (<View/>)}
                                </View>
                            
                            </TouchableOpacity>
                            {
                                   (previous_date.slice(8,10) != item.item.Date.slice(8,10)) ? (
                                       <View style = {{
                                    
                                        //width : 0.3 * ScreenWidth,
                                        alignItems : 'center',
                                        justifyContent : 'center',
                                        border : 0.5,
                                        backgroundColor : 'black',
                                        elevation : 10,
                                        borderRadius : 8
                                       }} >       
                                           <Text style = {{ color : 'white',fontWeight : 'bold' }} > { previous_date.slice(0,15) } </Text>
                                       </View>
                                       ) : (
                                       <View/>
                                   )
                               }
                            </View>
                        )
                    } else if (item.item.Type == 'video'){  
                                  
                        return (
                            <View style = {{
                                width : ScreenWidth,
                                alignItems : 'center'
                            }}>
                                {
                                   ((item.index === (number-1) )) ? (
                                       <View style = {{
                                    
                                        //width : 0.3 * ScreenWidth,
                                        alignItems : 'center',
                                        justifyContent : 'center',
                                        border : 0.5,
                                        backgroundColor : 'black',
                                        elevation : 10,
                                        borderRadius : 8
                                       }} >       
                                           <Text style = {{ color : 'white',fontWeight : 'bold' }} > { previous_date.slice(0,15) } </Text>
                                       </View>
                                       ) : (
                                       <View/>
                                   )
                               }
                                
                            <TouchableOpacity style = {{ paddingTop : 10 ,
                                 paddingBottom : 10 ,
                                 alignItems : item.item.Receiving ? 'flex-start' : 'flex-end' , 
                                 width : 0.98 * ScreenWidth  }} onLongPress = {
                                ()=> {
                                    this.setState({selected_message : {
                                        Index : item.index,
                                        Message : item.item
                                    },message_action : true})
                                }
                            } >
                            <View style = {{ flexDirection : 'row' , justifyContent : 'space-between' , alignItems : 'center' }} >
                            {!item.item.Receiving && (item.item.Starred || item.item.Starred != '0') && !item.item.forwarded? (
                            <Avatar rounded containerStyle = {{ backgroundColor : 'transparent' }} size = {'small'} icon = {{ name : 'star' , color : this.props.state.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }}/>
                            ) : (<View/>)}
                            {!item.item.Receiving && item.item.forwarded? (
                                <Avatar rounded containerStyle = {{ backgroundColor : 'transparent' }} size = {'small'} icon = {{ name : 'bullhorn' , color : this.props.state.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }}/>
                                ) : (<View/>)}
                            <Video_comp 
                                video_uri = {item.item.Message }
                                info = {{
                                    'To' : Server_id,
                                    'forwarded' : false,
                                    'Reply' : false
                                }}
                                Contact = {
                                    this.state.Contact
                                }
                                type = {item.item.Receiving}
                                Server_id = {Server_id}
                                Status = { item.item.Status }
                                Seen = {item.item.Seen}
                                date = {item.item.Date.slice(16,24) }
                                Starred = {item.item.Starred}
                                Index = {this.state.current_index}
                                message_index = {item.index}
                                Muk = {item.item.Muk}
                              />
                               {item.item.Receiving && (item.item.Starred != 0) && !item.item.forwarded? (
                                <Avatar rounded containerStyle = {{ backgroundColor : 'transparent' }} size = {'small'} icon = {{ name : 'star' , color : this.props.state.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }}/>
                                ) : (<View/>)}
                               {item.item.Receiving && item.item.forwarded? (
                                <Avatar rounded containerStyle = {{ backgroundColor :'transparent' }} size = {'small'} icon = {{ name : 'bullhorn' , color : this.props.state.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }}/>
                                ) : (<View/>)}
                              </View>
                            </TouchableOpacity>
                            {
                                   (previous_date.slice(8,10) != item.item.Date.slice(8,10)) ? (
                                       <View style = {{
                                    
                                        //width : 0.3 * ScreenWidth,
                                        alignItems : 'center',
                                        justifyContent : 'center',
                                        border : 0.5,
                                        backgroundColor : 'black',
                                        elevation : 10,
                                        borderRadius : 8
                                       }} >       
                                           <Text style = {{ color : 'white',fontWeight : 'bold' }} > { previous_date.slice(0,15) } </Text>
                                       </View>
                                       ) : (
                                       <View/>
                                   )
                               }
                            </View>
                        )
                    } else if (item.item.Type == 'audio'){
                        console.log('audio')
                        return (
                            <View style = {{
                                width : ScreenWidth,
                                alignItems : 'center'
                            }}>
                                {
                                   ((item.index === (number-1) )) ? (
                                       <View style = {{
                                    
                                        //width : 0.3 * ScreenWidth,
                                        alignItems : 'center',
                                        justifyContent : 'center',
                                        border : 0.5,
                                        backgroundColor : 'black',
                                        elevation : 10,
                                        borderRadius : 8
                                       }} >       
                                           <Text style = {{ color : 'white',fontWeight : 'bold' }} > { previous_date.slice(0,15) } </Text>
                                       </View>
                                       ) : (
                                       <View/>
                                   )
                               }
                                
                            <TouchableOpacity style = {{ paddingTop : 10 ,
                                 paddingBottom : 10 ,
                                 alignItems : item.item.Receiving ? 'flex-start' : 'flex-end' , 
                                 width : 0.98 * ScreenWidth  }} onLongPress = {
                                ()=> {
                                    this.setState({selected_message : {
                                        Index : item.index,
                                        Message : item.item
                                    },message_action : true})
                                }
                            } >
                            <View style = {{ flexDirection : 'row' , justifyContent : 'space-between' , alignItems : 'center' }} >
                            {!item.item.Receiving && (item.item.Starred || item.item.Starred != '0') && !item.item.forwarded? (
                            <Avatar rounded containerStyle = {{ backgroundColor : 'transparent' }} size = {'small'} icon = {{ name : 'star' , color : this.props.state.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }}/>
                            ) : (<View/>)}
                            {!item.item.Receiving && item.item.forwarded? (
                                <Avatar rounded containerStyle = {{ backgroundColor : 'transparent' }} size = {'small'} icon = {{ name : 'bullhorn' , color : this.props.state.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }}/>
                                ) : (<View/>)}
                            <Audio_comp 
                                audio_uri = {item.item.Message }
                                info = {{
                                    'To' : Server_id,
                                    'forwarded' : false,
                                    'Reply' : false
                                }}
                                Contact = {
                                    this.state.Contact
                                }
                                type = {item.item.Receiving}
                                Server_id = {Server_id}
                                Status = { item.item.Status }
                                Seen = {item.item.Seen}
                                date = {item.item.Date.slice(16,24) }
                                Starred = {item.item.Starred}
                                Index = {this.state.current_index}
                                message_index = {item.index}
                                Muk = {item.item.Muk}
                              />
                               {item.item.Receiving && (item.item.Starred != 0) && !item.item.forwarded? (
                                <Avatar rounded containerStyle = {{ backgroundColor : 'transparent' }} size = {'small'} icon = {{ name : 'star' , color : this.props.state.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }}/>
                                ) : (<View/>)}
                               {item.item.Receiving && item.item.forwarded? (
                                <Avatar rounded containerStyle = {{ backgroundColor :'transparent' }} size = {'small'} icon = {{ name : 'bullhorn' , color : this.props.state.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }}/>
                                ) : (<View/>)}
                              </View>
                            </TouchableOpacity>
                            {
                                   (previous_date.slice(8,10) != item.item.Date.slice(8,10)) ? (
                                       <View style = {{
                                    
                                        //width : 0.3 * ScreenWidth,
                                        alignItems : 'center',
                                        justifyContent : 'center',
                                        border : 0.5,
                                        backgroundColor : 'black',
                                        elevation : 10,
                                        borderRadius : 8
                                       }} >       
                                           <Text style = {{ color : 'white',fontWeight : 'bold' }} > { previous_date.slice(0,15) } </Text>
                                       </View>
                                       ) : (
                                       <View/>
                                   )
                               }
                            </View>
                        )

                    }else if (item.item.Type == 'application'){
                        return (
                            <View style = {{
                                width : ScreenWidth,
                                alignItems : 'center'
                            }}>
                               
                            <TouchableOpacity style = {{ paddingTop : 10 ,
                                 paddingBottom : 10 ,
                                 alignItems : item.item.Receiving ? 'flex-start' : 'flex-end' , 
                                 width : 0.98 * ScreenWidth  }} onLongPress = {
                                ()=> {
                                    this.setState({selected_message : {
                                        Index : item.index,
                                        Message : item.item
                                    },message_action : true})
                                }
                            } >
                            <Pdf file = {item.item.Message} />
                            </TouchableOpacity>
                            </View>
                        )
                    } 
                  
            }
                
            }
            />
            </View>
            
            { this.state.camera_video_active && this.state.Are_permissions_granted  ? (
                
                <View style = {{  position : 'absolute', height : this.state.video_height , width : this.state.video_width , backgroundColor : 'rgba(0,0,0,0.6)'  }}>
                       <Animatable.View animation = {spread_out_camera} style = {{  position : 'absolute', bottom : 0.5 * ScreenHeight-90 , right : 0.5*ScreenWidth-90 ,  }}>
                       <Camera style={styles.camera} type={Camera.Constants.Type.front} 
                               
                                   flashMode = {Camera.Constants.FlashMode.off}
                                   ref = { ref => {
                                //    this.setState({ cam : ref });
                                   this.cam = ref
                                   } }
                               >
                                   
                           
                               </Camera>

                </Animatable.View>
                    
                </View>
           ) : console.log()  }
            {  this.state.message_action ? (
                <Animatable.View animation = {spread_out}
                     style = {{  position : 'absolute', height : ScreenHeight , width : ScreenWidth , backgroundColor : 'rgba(0,0,0,0.6)'  }}>
                    <View style = {{
                        position : 'absolute',
                        bottom : 0.5 * ScreenHeight-90 ,
                        right : 0.05*ScreenWidth ,
                          
                        height : 75,
                        width : 0.9 * ScreenWidth,
                        backgroundColor : 'transparent',
                        flexDirection : 'row',
                        justifyContent : 'space-between',
                        alignItems : "center",
                    }} >
                        <Animatable.View animation = {"slideInDown"} direction = {"alternate"} iterationCount = {1} style = {{
                            height : 75,
                            justifyContent : 'space-between'
                        }} >
                        <TouchableOpacity onPress = {
                            async ()=>{
                                this.props.delete_message( this.state.current_index,this.state.selected_message.Index )
                                this.setState({message_action : false})
                                await fun_database.delete_message_db(this.state.selected_message.Message.id)
                            }
                        }  >
                            <Avatar rounded  containerStyle = {{ backgroundColor : this.props.state.fun.Layout_Settings.Icons_surroundings }} size = {'medium'} icon = {{ name : 'trash' , color : this.props.state.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }}/>
                        </TouchableOpacity>
                        <Text style = {{ color : 'white' }}> Delete </Text>
                        </Animatable.View>
                             <Animatable.View animation = {"slideInDown"} direction = {"alternate"} iterationCount = {1} style = {{
                                height : 75,
                                justifyContent : 'space-between',
                                alignItems : 'center'
                           }} >
                           <TouchableOpacity onPress = {
                               async ()=>{
                                    this.setState({message_action : false})
                                   this.props.state.business.navigation.navigation.navigate('Add chats to conversation' , {'Message' : this.state.selected_message.Message})
                                   // await fun_database.star_message_db(this.state.selected_message.Message.id)
                               }
                           } >
                               <Avatar rounded containerStyle = {{ backgroundColor : this.props.state.fun.Layout_Settings.Icons_surroundings }} size = {'medium'} icon = {{ name : 'reply' , color : this.props.state.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }}/>
                           </TouchableOpacity>
                           <Text style = {{ color : 'white' }}> forward </Text>
                           </Animatable.View>
                       
                        <Animatable.View animation = {"slideInDown"} direction = {"alternate"} iterationCount = {1} style = {{
                             height : 75,
                             justifyContent : 'space-between',
                             alignItems : 'center'
                        }} >
                        <TouchableOpacity onPress = {
                            async ()=>{
                                await fun_database.star_message_db(this.state.selected_message.Message.id)
                                this.setState({message_action : false})
                                this.props.star_message(this.state.current_index,this.state.selected_message.Index ,true)
                            }
                        } >
                            <Avatar rounded containerStyle = {{ backgroundColor : this.props.state.fun.Layout_Settings.Icons_surroundings }} size = {'medium'} icon = {{ name : 'star' , color : this.props.state.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }}/>
                        </TouchableOpacity>
                        <Text style = {{ color : 'white' }}> Star </Text>
                        </Animatable.View>

                        <Animatable.View animation = {"slideInDown"} direction = {"alternate"} iterationCount = {1} style = {{
                             height : 75,
                             justifyContent : 'space-between'
                        }} >
                        <TouchableOpacity onPress = {
                            
                                //this.props.state.business.navigation.navigation.navigate('Add chats to conversation')
                                async () => {
                                    const options = {
                                        message : this.state.selected_message.Message.Message,
                                      };
                                    let sharing_possible = await Sharing.isAvailableAsync()
                                    if (sharing_possible){
                                        try {
                                            const result = await Share.share(options);
                                              if (result.action === Share.sharedAction) {
                                                if (result.activityType) {
                                                    console.log(result.activityType)
                                                  // shared with activity type of result.activityType
                                                } else {
                                                  // shared
                                                }
                                              } else if (result.action === Share.dismissedAction) {
                                                  console.log('shared')
                                                // dismissed
                                              }
                                        } catch (error) {
                                            console.log(error)
                                        }
                                    }
                                }
                            
                        } >
                            <Avatar rounded containerStyle = {{ backgroundColor : this.props.state.fun.Layout_Settings.Icons_surroundings }} size = {'medium'} icon = {{ name : 'share-alt' , color : this.props.state.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }}/>
                        </TouchableOpacity>
                        <Text style = {{ color : 'white' }}> Share </Text>
                        </Animatable.View>

                      
                    </View>

                </Animatable.View>

            ) : ( <View/> )  }
             

                <Portal>
                <FAB.Group
                    fabStyle  = {{ backgroundColor : this.props.state.fun.Layout_Settings.Icons_surroundings,paddingLeft:4 }}
                    visible = {false}
                    color = {this.props.state.fun.Layout_Settings.Icons_Color}
                    style = {{ bottom : 50 , }}
                    onPress = { ()=> this.state.open ? this.setState({open : false}) : this.setState({open : true})  }
                    open = {this.state.open}
                
                    icon = { this.state.open ? 'video-camera' : 'microphone'}
                    
                    actions = {[
                        // {icon : 'microphone' , label : 'Send music' , onPress : async ()=>{
                        //     // const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
                        //     // if (status === "granted"){
                        //     try {
                        //        let result = await DocumentPicker.getDocumentAsync({'type' : 'audio/*' , 'multiple' : false , copyToCacheDirectory : true})
                        //     //    console.log(result)
                        //         if (result){
                        //             // console.log(mime.lookup(result.uri).split('/')[0])
                        //             let check_list = result.uri.split('.')
                        //             if (check_list[3]){
                        //                 console.log('from the obfuscated')
                        //                 let new_uri_list = result.uri.split('')
                        //                 let count_list = check_list[3].split('')
                        //                 new_uri_list.splice(new_uri_list.length-count_list.length , 3 , ...(result.mimeType.split('/')[1].split('')) )
                        //                 console.log(mime.lookup(new_uri_list.join('')))
                        //                 // new_uri_list.pop()
                        //                 // new_uri_list.pop()
                        //                 // new_uri_list.pop()
                        //             } else {
                        //                 let new_uri_list = result.uri.split('')
                        //                 new_uri_list.push(...(result.mimeType.split('/')[1].split('')))
                        //                 console.log(mime.lookup(new_uri_list.join('')))
                        //             }
                                   
                        //             // new_uri_list.splice(new_uri_list.length-3 , new_uri_list.length)
                        //             // console.log(new_uri_list.join(''))
                        //             // console.log(result.uri)
                        //             // console.log((result.uri).split('').splice(result.uri.length-2 , result.uri.length))
                        //             // let new_uri = (result.uri).split('').splice(result.uri.length-3 , result.uri.length).push(...result.mimeType.split('/')[0].split('')).join('')
                        //             // console.log(new_uri)
                        //             // console.log(result.file)
                        //             // this.setState({image : result.uri})
                        //             // await this.store_to_redux(result.uri)
                        //         }
                        //       } catch (E) {
                        //         console.log(E);
                        //       }

                        // }},
                        {icon : 'video-camera' , label : 'Send video' ,  onPress : async ()=>{
                            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
                            if (status === "granted"){
                            try {
                                let result = await ImagePicker.launchImageLibraryAsync({
                                  mediaTypes: ImagePicker.MediaTypeOptions.Videos,
                                  allowsEditing: true,
                                  aspect: [4, 3],
                                  quality: 1,
                                });
                                if (!result.cancelled) {
                                  this.setState({ image: result.uri });
                                //   const info = await FileSystem.getInfoAsync(result.uri)
                                //   console.log(info.size)
                                  await this.store_to_redux(result.uri)
                                  
                                }
                          
                                //console.log(result);
                              } catch (E) {
                                console.log(E);
                              }} else {
                                  alert("No permissions")
                              }
                            

                        } , style : {backgroundColor : this.props.state.fun.Layout_Settings.Icons_surroundings, height : 40 , width : 40   },   color : this.props.state.fun.Layout_Settings.Icons_Color  },
                        
                        {icon : 'image' , label : 'Send an image' ,  onPress : async ()=>{
                            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
                            if (status === "granted"){
                            try {
                                let result = await ImagePicker.launchImageLibraryAsync({
                                  mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                  allowsEditing: true,
                                  //aspect: [4, 3],
                                  quality: 1,
                                });
                                if (!result.cancelled) {
                                  this.setState({ image: result.uri });
                                  await this.store_to_redux(result.uri)
                                  
                                }
                          
                                //console.log(result);
                              } catch (E) {
                                console.log(E);
                              }} else {
                                  alert("No permissions")
                              }
                            
                        } , style : {backgroundColor : this.props.state.fun.Layout_Settings.Icons_surroundings, height : 40 , width : 40   },   color : this.props.state.fun.Layout_Settings.Icons_Color  },
                    ]}
                    onStateChange = {()=> this.state.open ? this.setState({open : false}) : this.setState({open : true})  }
            
                />
                </Portal>  
                        
            <View style = {{ ...styles.accessories , backgroundColor : this.props.state.fun.Layout_Settings.Icons_surroundings}}>
                <TouchableOpacity onPress = {
                    async ()=>{
                        let image = await ImagePicker.launchCameraAsync({mediaTypes : ImagePicker.MediaTypeOptions.Images , allowsEditing : true , aspect : [4,3] , quality : 0.8 , base64 : true})
                        await this.store_to_redux(image.uri)
                        
                    }
                }>
                <Avatar containerStyle = {{elevation : 5 , backgroundColor : this.props.state.fun.Layout_Settings.Icons_Color }} rounded size = {'small'} icon = {{name : 'camera', color : this.props.state.fun.Layout_Settings.Icons_surroundings, type : 'font-awesome'}}/>
                </TouchableOpacity>
                <TextInput  onChangeText = {
                    (text) => {
                        this.setState({ message : text  })
                    
                    }
                }  value = {this.state.message} style = {styles.input} multiline = {true} placeholder = {"       Enter Message "} />
                <TouchableOpacity onPress = {
                   async () => {
                    if (this.state.message){
                         // if (this.props.state.fun.Connected){
                        // Saving the message in the redux store
                    if (this.state.current_index === 0 || this.state.current_index){
                        this.props.send_message( this.state.current_index ,  {
                            'id' : 'Not saved',
                            'Contact' : this.state.Contact,
                            'Message' : this.state.message,
                            'Receiving' : false,
                            'Date' : new Date().toString(),
                            'Status' : 'first-tym',
                            'Server_id' : Server_id,
                            'Starred' : false,
                            'Type' : 'text',
                            'Muk' : this.message_unique_token_generator(),
                            'Seen' : true
                        });
                        this.props.update_chat_position(Server_id)
                        
                    } else {
                        let info = {
                            'Server_id' : Server_id,
                            'Name' : Name,
                            'Contact_name' : '@unknown',
                            'Messages' : [
                                { 
                                    'id' : 'Not saved',
                                    'Contact' : this.state.Contact,
                                    'Message' : this.state.message,
                                    'Receiving' : false,
                                    'Date' : new Date().toString(),
                                    'Status' : 'first-tym',
                                    'Starred' : false,
                                    'Server_id' : Server_id,
                                    'Type' : 'text',
                                    'Muk' : this.message_unique_token_generator(),
                                    'Seen' : true
                                }
                            ]
                        }
                        let index = this.props.state.fun.Messages.length 
                        this.props.send_message_new(info)
                        //console.log(info)
                        this.props.create_new_chat_position({
                            'Server_id' : Server_id,
                            'index' : index,
                        })
                        this.setState({current_index : index })
                    }

                        //Sending the message to the receiver
                        // await Chat.sendMessage({
                        //     'type' : 'Message',
                        //     'Receiver' : Server_id,
                        //     'Sender' : this.props.state.fun.Fun_profile.Server_id,
                        //     'Name' : this.props.state.fun.Fun_profile.Name,
                        //     'Contact' : this.props.state.fun.Fun_profile.Contact,
                        //     'Message' : this.state.message,
                        //     'forwarded' : false,
                        //     'Starred' : false,
                        //     'Replied' : this.state.reply ? this.state.selected_message.Message.Message : 'null',
                        //     'Type' : 'text'

                        // })
                        // Clearing the textinput for more  input
                        //Storing the message in the database
                        // await fun_database.store_message_db({
                        //     'Contact' : this.state.Contact,
                        //     'Message' : this.state.message,
                        //     'Status' : 'Sent',
                        //     'Date' : new Date().toString(),
                        //     'Receiving' : false,
                        //     'Server_id' : Server_id,
                        //     'forwarded' : false,
                        //     'Starred' : false,
                        //     'Replied' : this.state.reply ? this.state.selected_message.Message.Message : 'null',
                        //     'Type' : 'text'
                        // })
                        this.setState({ message : ''})
                        if (this.state.reply){
                            this.setState({ reply_animation : false })
                            setTimeout(()=>{
                                this.setState({reply : false , reply_animation : true})
                            }, 1500)
                        }
                        //this.message = ''
                        //this.messo_flatlist.scrollToEnd()
                    // } else {
                    //     alert('Please ensure you have a stable Internet connection before sending the message')
                    // }
                 
                    }   
                }
                } >
                    <Avatar containerStyle = {{elevation : 5 , backgroundColor : this.props.state.fun.Layout_Settings.Icons_Color }} rounded size = {'small'} icon = {{name : 'send', color : this.props.state.fun.Layout_Settings.Icons_surroundings, type : 'font-awesome'}}/>
                </TouchableOpacity>
                <TouchableOpacity onPress = {() => {
                    if (this.state.open) {
                        this.setState({action_opener:'plus'})
                        this.setState({open:false})
                    } else {
                        this.setState({open : true})
                        this.setState({action_opener:'remove'})
                    }
                    
                  } }>
                    <Avatar containerStyle = {{elevation : 5 , backgroundColor : this.props.state.fun.Layout_Settings.Icons_Color }} rounded size = {'small'} icon = {{name : this.state.action_opener, color :this.props.state.fun.Layout_Settings.Icons_surroundings, type : 'font-awesome'}}/>
                </TouchableOpacity>
            </View>

          
          
            {
                this.state.reply ? (
                    <Animatable.View 
                        animation = { this.state.reply_animation? (reply_message) : (after_reply_message)}
                        style = {{ position : 'absolute' , justifyContent : 'flex-start', alignItems : 'center' }}
                        >
                            <View style = {{ width : 0.95 * ScreenWidth , alignItems : 'flex-end' }} >
                                <TouchableOpacity onPress = {
                                    ()=>{
                                        this.setState({ reply_animation : false })
                                        setTimeout(()=>{
                                            this.setState({reply : false , reply_animation : true})
                                        }, 1500)
                                    }
                                    }>
                                    <Avatar rounded icon = {{ name : 'times' , type : 'font-awesome' , color : 'white' }} size = {'small'}  />
                                </TouchableOpacity>
                            </View>
                            <View style = {styles.reply} >
                                <Text style = {{...styles.replied_text}}> 
                                { this.state.selected_message.Message.Message.length > 70 ? this.state.selected_message.Message.Message.slice(0,70) + '...' : this.state.selected_message.Message.Message }
                                 </Text>
                            </View>
                    </Animatable.View>
                ) : (<View/>)
            }    
        </View>
        
    )}
}

let mapStateToProps = (state_redux,ownProps) => {
    let state = state_redux
    return {state}
}

let mapDispatchToProps = (dispatch,ownProps) => ({
    change_color : () => dispatch({type : 'color_change'}),
    send_message : (Index,message ) => dispatch({type : 'message_handler', content : message , Index : Index }),
    send_message_new : (content) => dispatch({type : 'new_chats' , content : content}),
    create_new_chat_position : (Values) => dispatch({ type : 'new_chats_position' , New : Values }),
    update_chat_position : (Server_id) => dispatch({type : 'update_chats_positions' , Server_id : Server_id }),
    delete_message : (Index , message_index) => dispatch({ type : 'delete_message' , Index : Index  , message_Index : message_index }),
    star_message : (Index , messo_index , value) => dispatch({ type : 'star_message' , Index : Index , messo_index : messo_index , value : value })
})



export default connect(mapStateToProps , mapDispatchToProps)(Chats_screen)

const styles = StyleSheet.create({
    container : {
        display : "flex",
        backgroundColor : 'transparent',
        flex : 1,
        flexDirection : 'column',
        justifyContent : 'flex-end',
        
        
    
    },
    camera : {
        flex : 1,
        aspectRatio : 0.75,
        flexDirection : 'column',
        justifyContent : 'space-between',
        alignItems : 'center',
        height : 180,
        width : 180,
        overflow : 'hidden',
        
    },
   
    accessories : {
        bottom : 0,
        backgroundColor : Theme.lovely.icons_surrounding,
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        height : 50,
        width : ScreenWidth,
        elevation : 5,
    },
    input : {
        height : 40,
        width : 0.68 * ScreenWidth,
        backgroundColor : Theme.lovely.icons,
        borderRadius : 20,
        elevation : 5,
        fontWeight : '700',
        fontSize : 16,
        paddingLeft : 20,
        paddingRight : 20
    },
    dial : {
         
         justifyContent : 'center' , 
         alignItems : 'center' , 
         elevation : 5 ,       
         display : 'none',
    },
    messo : {
        
       
    },
    reply : {
        flexWrap : 'nowrap',
        width : 0.95 * ScreenWidth,
        height : 0.07 * ScreenHeight,
        alignItems : 'center',
        justifyContent : 'center',
    },
    replied_text : {
        color : 'white'
    }
    

})

