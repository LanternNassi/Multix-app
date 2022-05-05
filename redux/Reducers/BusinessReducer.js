
import Theme from '../../constants/Theme.js'
import * as mime from 'react-native-mime-types'
import FormData, {getHeaders} from 'form-data'
import axios from 'axios'
import Gig_notifications from '../../websockets/Gig_notifications.js'

let Overall_State = {
    Debug : true,
    Business_profile : {},
    Username : 'Lantern',
    navigation : 'navigate',
    business_profile_edit_done : true,
    close_open_bidders : false,
    done : 'no',
    Business_database : '',
    friends : [  
    ],
    messages : {
        Daniel : [
            {'type' : 'Sender' , 'message' : 'Hello there'},
            {'type' : 'Sender' , 'message' : '2'},
            {'type' : 'Sender' , 'message' : '3'},
            {'type' : 'Sender' , 'message' : '4'},
        ]
    },
    
    theme : Theme.purger,
    current_chat : {
        name : "Any"
    }
}


export default BusinessReducer = (state = Overall_State , action) => {
    switch(action.type){
        case 'Navigate':{
            return {
                ...state , navigation : action.navigation
            }
            break;
        }
        case 'color_change':{
            return {
                ...state, theme : Theme.lovely
            }
            break;
        }
       
        case 'done' : {
            return {
                ...state , business_profile_edit_done : action.decide
            }

        }
       
        case 'initiate_business_sign_up':{

            return{
                ...state , Business_sign_up : {
                    'Business account' : {
                        'Multix_token' : '000',
                        'Rating' : '0'
                    } ,
                    'Billing information' : {},
                    'Certifications' : {}
                }
            }
        }
        case 'Business account' : {
            state.Business_sign_up['Business account'][action.key] = action.value 
            return {
                ...state
            }

        }
        case 'Business_account_destroyer' : {
            if (state.Business_sign_up){
                delete state.Business_sign_up
                return {
                    ...state
                }
            } else {
                return {
                    ...state
                }
            }
            
        }
        case 'Billing information' : {
            state.Business_sign_up['Billing information'][action.key] = action.value 
            return {
                ...state
            }

        }
        case 'Certifications' : {
            state.Business_sign_up['Certifications'] = action.value 
            return {
                ...state
            }

        }
        case 'close_open_bidders' : {
            state['close_open_bidders'] = action.value
            return {
                ...state
            }
        }
        case 'Pic' : {
            const newImageUri = "file:///" + action.pic.split("file:/").join("")
            state['processed_image'] = {
                uri : newImageUri,
                type : mime.lookup(newImageUri),
                name : newImageUri.split("/").pop()
            }
            return {
                ...state
            }
        }
        case 'initiate_gig_sign_up' : {
            return {
                ...state , Gig_sign_up : {
                    'word_info' : {
                        'Gig_type' : action.value,
                        'Multix_token' : '000',
                    },
                    'images' : {},
                }
            }
        }
        case 'gig_word_info' : {
            state['Gig_sign_up']['word_info'][action.key] = action.value
            return {
                ...state
            }
        }
        case 'gig_images' : {
            state['Gig_sign_up']['images'][action.key] = action.value
            return {
                ...state
            }
        }
        case 'gig_add_info' : {
            state['Gig_sign_up']['Additional_info'] = action.value
            return {
                ...state
            }

        }
        case 'gig_instance_destroyer' : {
            if (state.Gig_sign_up){
                delete state.Gig_sign_up
                return {
                    ...state
                }
            } else {
                return {
                    ...state
                }
            }  
        }
        case 'update_business_profile' : {
            state['Business_profile'] = action.value
            return {
                ...state  
                
            }
        }
        case 'create_business_request_instances' : {
            state['request_business_json'] = axios.create({
                baseURL :  state.Debug ? ('http://192.168.43.232:8000') : ('http://multix-business.herokuapp.com'),
                timeout : 1000000,
                headers : { 
                    'content-type' : 'application/json',
                    'Authorization': 'Token ' + action.token ,
                }
            })
            state['request_business_form'] = axios.create({
                baseURL : state.Debug ? ('http://192.168.43.232:8000') : ('http://multix-business.herokuapp.com'),
                headers : { 
                    'content-type' : 'multipart/form-data',
                    'Authorization': 'Token ' + action.token ,
                    
                }
            })
            return {
                ...state
            }

        }
     
        case 'update_bus_profile' : {
            state.Business_profile[action.key] = action.value
            return {
                ...state
            }
        }
        case 'after_creating_gig' : {
            state.Business_profile['Gigs'].push(action.gig)
            return {
                ...state
            }
        }
        case 'update_business_profile_account' : {
            state.Business_profile['Account'][action.name] = action.value
            return {
                ...state
            }
        }
        case 'update_business_profile_gig' : {
            for(let i = 0; i < state.Business_profile['Gigs'].length; i++){
                if (action.Server_id === state.Business_profile['Gigs'][i]['Gig_info'].Server_id){
                    state.Business_profile['Gigs'][i]['Gig_info'][action.name] = action.value
                }
            }
            return {
                ...state
            }
        }
        /// Websocket for Gig notifications 
        case 'create_business_websocket_instances' : {
            state['ws_gig_notifications'] = action.Instance
            return {
                ...state
            }
        }
        case 'ws_gig_notifications_message' :{
                state['Contracts_proposals'] = action.Message
            return {
                ...state
            }
        }
        
        default :
            return state;
    }

}