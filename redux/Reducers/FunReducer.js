import * as mime from 'react-native-mime-types'


export default FunReducer = (state = {
    Layout_Settings : {
        Icons_Color : 'blue',
        Icons_surroundings : 'white',
        Top_navigation : '#006600',
        Bottom_navigation : 'white',
        Message_component : 'blue',
        Sender_component : 'white',
        Sender_text_color : 'black',
        Message_text_color : 'white',
        Online_color : 'green',
        Bottom_navigation_icons_color : 'blue',
        Header_color : 'white',
    },
    Typing : {},
    Connected : false,
} , action) => {
    switch(action.type){
        case 'initiate_sign_up' : {
            state['Fun_sign_up'] = {}
            return {
                ...state
            }
        }
        case 'Layout_Settings' : {
            state['Layout_Settings'] = action.content
            return {
                ...state
            }
        }
        case 'sign_up_info' : {
            state['Fun_sign_up'][action.key] = action.value
            return {
                ...state
            }
        }
        case 'Refresh' : {
            state['Refresh'] = action.value
        }
        case 'fun_sign_up_processed_image':{
            const newImageUri = "file:///" + action.pic.split("file:/").join("")
            state['processed_image_fun_sign_up'] = {
                uri : newImageUri,
                type : mime.lookup(newImageUri),
                name : newImageUri.split("/").pop()
            }
            return {
                ...state
            }
        }
        case 'store_fun_account_info' : {
            state['Fun_profile'] = action.Profile
            return {
                ...state
            }
        }
        case 'store_active_contacts' : {
            state['Contacts'] = action.Contacts
            return {
                ...state
            }
        }
        case 'update_active_contacts' : {
            state['Contacts'].push(...action.chat_data)
            return {
                ...state,
            }
        }
        case 'Load_messages' : {
            state['Messages'] = action.Messages
            return {
                ...state
            }
        }
        case 'current_chat': {
            return {
                ...state , current_chat : {
                    Name : action.name,
                    Profile_photo : action.Profile_photo,
                    Color : action.Color,
                    Index : action.Index
                    }
            }
        }
        case 'message_handler': {
                state['Messages'][action.Index]['Messages'].splice(0,0,{...action.content})
         
            return {
                ...state
            }
        }
        case 'app_started' : {
            state['app_started'] = true
            return {
                ...state
            }
        }
        case 'new_chats' : {
                state['Messages'].push({...action.content})
                return {
                    ...state
                }
            }
            
        // case 'after_upload_download' : {
        //     state['Messages'][action.Index]['Messages'][action.messo_index]['status'] = 'finished'
        //     return {
        //         ...state
        //     }
        // } 
        case 'message_confirmation' : {
            state['Messages'][action.Index]['Messages'][action.messo_index]['Status'] = action.status
            return {
                ...state
            }
        } 

        case 'star_message' : {
            state['Messages'][action.Index]['Messages'][action.messo_index]['Starred'] = action.value
            return {
                ...state
            }
        }
        case 'chats_positions' : {
            state['chats_positions'] = action.list
            return {
                ...state
            }
        }
        case 'update_chats_positions' :{
            let index = {}
            for(let i = 0; i<state['chats_positions'].length; i++){
                if (action.Server_id === state['chats_positions'][i].Server_id){
                    index = state['chats_positions'].splice(i , 1)
                    //state['chats_positions'].splice(0,0,index)
                }  
            }
            return {
                ...state , chats_positions : [index[0] , ... state['chats_positions']]
            }

        }
        case 'new_chats_position' : {
            state['chats_positions'].splice(0,0,action.New)
            return {
                ...state
            }
        }
        case 'delete_message' : {
            state['Messages'][action.Index]['Messages'].splice(action.message_Index , 1)
            return {
                ...state
            }
        }
        case 'online_chats' : {
            state['Online_chats'] = action.Online_chats
            return {
                ...state
            }
        }
        case 'update_online_chat' : {
            state['Online_chats'] = {
                ...action.chat, ...state.Online_chats
            }
            return {
                ...state
            }
        }
        case 'disconnect_online_chat' : {
            delete(state['Online_chats'][action.Name])
            return {
                ...state
            }
        }
        case 'offline_disconnect_chats' : {
            state['Online_chats'] = {}
            return {
                ...state
            }
        }
        case 'update_layout_color' : {
            state.Layout_Settings[action.component] = action.color
            return {
                ...state
            }
        }
        case 'Connected' : {
            state['Connected'] = action.value
            return {
                ...state
            }
        }
        case 'typing' : {
            return {
                ...state,
                'Typing' : {...action.Personnel}
            }
        }
        case 'stop_typing' : {
            delete(state['Typing'][action.Name])
            return {
                ...state
            }
        }
        case 'update_seen' : {
            state['Messages'][action.Index]['Messages'][action.messo_index]['Seen'] = true
            return {
                ...state
            }
        }
        case 'update_url' : {
            state['Messages'][action.Index]['Messages'][action.messo_index]['Message'] = action.url
            return {
                ...state
            }
        }
        case 'update_status' : {
            state['Messages'][action.Index]['Messages'][action.messo_index]['Status'] = action.Status
            return {
                ...state
            }
        }
       
        
        default :
            return state
    }
}