import React, { Component , useState } from 'react'
import { View , Text , TouchableOpacity , FlatList , StyleSheet } from 'react-native';
import { Avatar , CheckBox , Badge } from 'react-native-elements'
import { connect } from 'react-redux'
import { ScreenWidth, ScreenHeight } from 'react-native-elements/dist/helpers';
import * as Animatable from 'react-native-animatable';
import { FAB,Portal,Provider } from 'react-native-paper';
import forwarder from '../redux/forwarder'
import Spinner from 'react-native-loading-spinner-overlay'
import fun_database from '../redux/Database_fun_transactions'


export function Chat_screen_add_conts_to_chat(props){
   const [checked , setchecked] = useState([])
   const {Message} = props.route.params ;
   const [spin , setspin] = useState(false)


    const checker = (id) => {
        let success = false ;
        if(checked.length > 0){
            for(let i = 0 ; i <= checked.length ; i++ ){
                if(id == checked[i]){
                    success = true;
                    break;
                }
                // else {
                //     success = false
                // }
            }
        }
       
        return success;

    }
    const remover = (id) => {
        if (checked.includes(id)){
            // console.log('remover pressed')
            let indexes = checked
            let index = indexes.indexOf(id);
            indexes.splice(index,1);
            // console.log(indexes)
            setchecked(indexes)
            // console.log(checked)
            // this.setState({checked : this.state.checked})
        } else {

        }
        
    }
        return (
            <View>
                <Spinner
                    visible={spin}
                    textContent={'Sending...Give me a minute'}
                    textStyle={styles.spinnerTextStyle}
                />
                <TouchableOpacity style = {{
                    width : ScreenWidth,
                    maxWidth : ScreenHeight,
                    height : 40,
                    justifyContent : 'center',
                    alignItems : 'center'

                }} >
                    <Animatable.Text animation = {"pulse"} iterationCount={'infinite'} direction="alternate" style = {{
                        fontSize : 20,
                        fontWeight : '700'
                    }}>
                        {checked.length} chats
                    </Animatable.Text>

                </TouchableOpacity>
               
             
                <View style = {{ height : 0.8*ScreenHeight }} >
                <FlatList 
                data = {props.fun.Contacts}
                horizontal = {false}
                renderItem = { 
                    (item) =>  (
                        (checker(item.item.Server_id ? item.item.Server_id : item.item.id)) ? (
                        <CheckBox  title = {
                                <View style = { styles.title }>
                                     { item.item.Profile_photo ? (
                                    <Avatar source = {{ uri : item.item.Profile_photo }} rounded size = {'small'}/>
                                    ) : (
                                    <Avatar  title = { (item.item.Name).slice(0,2)} rounded size = {'small'} containerStyle = {{ backgroundColor : fun_database.get_random_color(item.item.Name.slice(0,1)) }}/>
                                    ) }   
                                    <Text style = {{ left : 20  }}>{item.item.Name}</Text>
                                </View>
                            }
                         onPress = { () => {
                            

                            if (checked.includes(item.item.Server_id ? item.item.Server_id : item.item.id)){
                                checked.splice(checked.indexOf(item.item.Server_id ? item.item.Server_id : item.item.id) , 1)
                                setchecked([...checked])
                            } else {

                            }
                            
                         }
                             
                         }
                         checked = {true}/>
                         ) : (
                            <CheckBox  title = {
                                    <View style = { styles.title }>
                                    { item.item.Profile_photo ? (
                                <Avatar source = {{ uri : item.item.Profile_photo }} rounded size = {'small'}/>
                                ) : (
                                <Avatar  title = { (item.item.Name).slice(0,2)} rounded size = {'small'} containerStyle = {{ backgroundColor : fun_database.get_random_color(item.item.Name.slice(0,1)) }}/>
                                ) }   
                                <Text style = {{ left : 20  }}>{item.item.Name}</Text>
                            </View>
                            }
                         onPress = {
                             ()=>{
                                 setchecked([...checked , item.item.Server_id ? item.item.Server_id : item.item.id])
                                 
                             }
                         }
                         checked = {false}/>

                         )
                    )
                    
                }
            />
            </View>
            <Animatable.View style = {{ position : 'absolute' ,height : 50 , width : 50 , left : 0.88*ScreenWidth , bottom : 0.1*ScreenHeight}} animation = {"slideInDown"} iterationCount={'infinite'} direction="alternate" >
            <Badge value = {checked.length} status = {'error'}/>
            </Animatable.View>
            <FAB
                 fabStyle  = {{ backgroundColor : props.state.theme.icons_surrounding , }}
                 visible = {true}
                 color = {props.state.theme.icons}
                 style = {{  height : 50 , width : 50 , left : 0.8*ScreenWidth , bottom : 0.1*ScreenHeight }}
                 onPress = { ()=> {
                    setspin(true)
                    forwarder.init(props)
                    let receivers = []
                    if(checked.length > 0){
                        for(let i = 0; i<checked.length; i++){
                            // console.log(i)
                            for(let p = 0; p<props.fun.Contacts.length; p++){
                                // console.log(props.fun.Contacts[p])
                                if(props.fun.Contacts[p]){
                                    let id = props.fun.Contacts[p]['Server_id']? 'Server_id' : 'id' 
                                    if(checked[i] == props.fun.Contacts[p][id]){
                                        receivers.push(props.fun.Contacts[p])
                                    }
                                }
                              
                            }
                        }
                    }
                    console.log(receivers)
                    if(Message.Type == 'text'){
                        forwarder.text_forwarder(receivers ,Message.Message,props.send_message , props.send_message_new , props.create_new_chat_position , props.update_chat_position , setspin )
                    } else {
                        forwarder.media_forwarder(receivers ,Message.Message,props.send_message , props.send_message_new , props.create_new_chat_position , props.update_chat_position , setspin )
                    }
                 }}
                 open = {false}
             
                 icon = {'check'}

            />
               
                
            </View>
        )
    
}

const mapStateToProps = (state_redux,ownProps) => {
    let state = state_redux.business
    let fun = state_redux.fun
    return {state , fun}
    
}

const mapDispatchToProps = (dispatch) => ({
    send_message : (Index,message ) => dispatch({type : 'message_handler', content : message , Index : Index }),
    send_message_new : (content) => dispatch({type : 'new_chats' , content : content}),
    create_new_chat_position : (Values) => dispatch({ type : 'new_chats_position' , New : Values }),
    update_chat_position : (Server_id) => dispatch({type : 'update_chats_positions' , Server_id : Server_id }),

})



export default connect(mapStateToProps,mapDispatchToProps)(Chat_screen_add_conts_to_chat)

const styles = StyleSheet.create({
    title : {
        left : 20,
        flexDirection : 'row',
        justifyContent : 'center',
        alignItems : 'center',
    
        
    },
    spinnerTextStyle: {
        color: '#FFF'
      },
    
})
