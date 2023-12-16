import React, { Component } from 'react'
import { View , Text, FlatList , StyleSheet, TouchableOpacity, Dimensions, TouchableWithoutFeedback , Image} from 'react-native'
import { ListItem , Avatar, Card , FAB , Badge } from 'react-native-elements';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Chats_screen from './Chats_screen';
import SkeletonContent from 'react-native-skeleton-content';
import { withNavigation  } from 'react-navigation';
import {connect} from 'react-redux';
import {fun_database} from '../redux/Database_fun_transactions.js'
import * as SQLite from 'expo-sqlite'
import { ScreenWidth, ScreenHeight } from 'react-native-elements/dist/helpers';


export class Chats_container extends Component {
    constructor(props){
        super(props)
    }
    state = {
    thumbnails : false, 
    loading :false,
    chats_name : [] 
}

    componentDidMount = () => {
        const db = SQLite.openDatabase('Fun_database.db')
        db.transaction((tx)=>{
            tx.executeSql('SELECT * FROM Chats_contacts',[],(tx,Result)=>{
                //console.log(Result.rows._array)
                this.setState({chats_name : Result.rows._array})
            },(error)=>{})
        },(error)=>{},()=>{})
      
    }

    determine_message = (message) => {
        let icon = ''
        if (message.Status == 'failed'){
            icon = 'history'
        } else if (message.Status == 'sent'){
            icon = 'bolt'
        } else if (message.Status == 'deliverd'){
            icon = 'check'
        }
        if (message.Type === 'text'){
            // return message.Message
            return (
                <View style = {{
                    flexDirection : 'row',
                    justifyContent : 'space-around',
                    alignItems : 'center'
                }}>
                    <Avatar rounded size = {'small'} icon = {{ name : icon, type : 'font-awesome', size : 15 , color : 'white' }} />
                    <Text style = {{
                        color : 'white',
                        fontWeight : message.Seen ? ('normal') : ('bold')
                    }}>{message.Message.length > 26 ? (message.Message.slice(0,26) + "...") : (message.Message)}</Text>
                </View>
            )
        } else if (message.Type === 'image') {
            return (
                <View style = {styles.category }>
                     <Avatar rounded size = {'small'} icon = {{ name : icon, type : 'font-awesome', size : 15 , color : 'white' }} />
                     <Avatar rounded size = {'small'} icon = {{ name : 'file-photo-o', type : 'font-awesome', size : message.Seen ? (15) : (16.5) , color : 'black' }} />
                     <Text style = {{
                        color : 'white',
                        fontWeight : message.Seen ? ('normal') : ('bold')
                     }} > {message.Type} </Text>
                </View>
             )
        } else if (message.Type === 'video'){
            return (
                <View style = {styles.category }>
                <Avatar rounded size = {'small'} icon = {{ name : icon, type : 'font-awesome', size : 15 , color : 'white' }} />
                <Avatar rounded size = {'small'} icon = {{ name : 'file-video-o', type : 'font-awesome', size : message.Seen ? (15) : (16.5) , color :'black' }} />
                <Text style = {{
                    color : 'white',
                    fontWeight : message.Seen ? ('normal') : ('bold')
                }} > {message.Type} </Text>
            </View>
            )
           
        }
    }

    // get_name = (Server_id) => {
    //     for (let i =0; i<this.state.chats_name.length; i++){
    //         if (Server_id == this.state.chats_name[i].Server_id){
    //             return this.state.chats_name[i].Name
    //         }
    //     }
    //     return false
    // }

    get_name = (Server_id) =>{
        for(let i =0; i<this.props.state.fun.Messages.length; i++){
            if(this.props.state.fun.Messages[i].Server_id == Server_id){
                return this.props.state.fun.Messages[i].Name
            }
        }
        return false
    }

    render() {
        return (
            <FlatList 
                style = {{backgroundColor : '#121212'}}
                horizontal = {false}
                data = {this.props.state.fun.chats_positions}
                keyExtractor = {(item,index)=>(index.toString())}
                alwaysBounceVertical = {true}
                ListEmptyComponent = {
                    () => (
                        <View style = {{
                            flex : 1,
                            flexDirection : 'column',
                            justifyContent : 'center',
                            alignItems : 'center',
                        }}>
                        {/* <Image style = {{
                            height : 0.6 * ScreenHeight,
                            width : ScreenWidth,
                            opacity : 0.1
                        }} source = {require('../assets/no-search-result.png')}/> */}
                        </View>
                    )
                } 
                renderItem = {
                    (item , index) => {
                        let thumbnail = false
                        let name = this.get_name(item.item.Server_id)
                        if (this.props.state.fun.Contacts){
                            thumbnail = fun_database.generate_thumbnail_chat(this.props.state.fun.Contacts , item.item.Server_id)
                        }
                        const chat = this.props.state.fun.Messages[item.item.index]
                        let color = fun_database.get_random_color((chat.Name).slice(0,1))
                       if (chat){
                        return (
                            <TouchableOpacity onPress = {()=>{this.props.current_chat(name , thumbnail , color , item.item.index); 
                                //console.log(this.props.state.fun.Messages[item.item.Index])
                             this.props.state.business.navigation.navigation.navigate('Chat_screen' , {Name:name , Index : item.item.index , Server_id : item.item.Server_id})}}  >
                            <ListItem.Swipeable containerStyle = {{ backgroundColor : '#121212'}}
                            style = {styles.item}
                            >
                                    <ListItem.Content style = {styles.arranger}>
                                        <SkeletonContent isLoading = {(this.props.state.fun.Contacts === [] || this.props.state.fun.Contacts) ? (false):(true)} animationDirection = {'diagonalTopRight'} animationType = {'shiver'} containerStyle = {styles.arranger } layout = {[
                                            {key : 'pic ' , height : 50 , width : 50 , borderRadius : 25} ,
                                            {key : 'title' , left : 10, height : 10 , width : 110},

                                        ]} >
                                            <TouchableOpacity onPress = {()=>{
                                                console.log('pressed')
                                            }}>
                                            { this.props.state.fun.Contacts && thumbnail ? (
                                                <View>
                                                
                                                <Avatar  source = {{ uri : thumbnail }} rounded size = {'medium'} />
                                                {
                                                    this.props.state.fun.Online_chats ? (
                                                        (this.props.state.fun.Online_chats[chat.Name]) ? (
                                                            <Badge status = {'success'} containerStyle = {{ position : 'absolute' , top : -4 , right : -4 }} />
                                                        ) : (<View/>)
                                                    ) : (
                                                        <View/>
                                                    )
                                                }
                                                </View>
                                            ) : (
                                                <Avatar  title = { chat ? ((chat.Name).slice(0,2)) : ('M') } containerStyle = {{ backgroundColor : fun_database.get_random_color((chat.Name).slice(0,1)) }} rounded size = {'medium'}/>
                                                
                                            )
                                            }
                                                
                                            </TouchableOpacity>
                                            <View style = {{ marginLeft : 10, }}>
                                                <ListItem.Title key = {'title'} style = {{ fontWeight : 'bold' , color : 'white' }}>
                                                {chat.Name}
                                                </ListItem.Title>
                                                <ListItem.Subtitle key ={'subtitle'}>
                                                    { chat.Messages[0] ? this.determine_message(chat.Messages[0]) : (<Text style = {{ fontStyle : 'italic' , color : 'white' }} >deleted</Text>) }
                                                </ListItem.Subtitle>
                                            </View>
                                        </SkeletonContent>
                                    </ListItem.Content>
                                    <View style = {{ 
                                        height : 45,
                                        alignItems : 'center',
                                        justifyContent : 'space-between'
                                     }} >
                                    <ListItem.Chevron/>
                                    {
                                        this.props.state.fun.Typing[chat.Name] ? (
                                            <Text style = {{
                                                fontStyle : 'italic',
                                                color : 'white',
                                            }}>
                                                Typing ...
                                            </Text>
                                        ) : (
                                            <Text style = {{ color : 'white' }}>
                                            @{chat.Contact_name.length > 10 ? (chat.Contact_name.slice(0,10) + '...') : (chat.Contact_name) }
                                        </Text>
                                        )
                                    }
                                   
                                    </View>
                                    
                            </ListItem.Swipeable> 
                            </TouchableOpacity>
                        )
                       } else {
                           return (
                               <View/>
                           )
                       }
                      
                    }
                }
            />
            
        )
    }
}

let mapStateToProps = (state_redux) => { 
    let state = state_redux
    return {state}
}

let mapDispatchToProps = (dispatch) => ({
    current_chat : (param , pic , color , Index)=>dispatch({type:'current_chat' , name : param , Profile_photo : pic , Color : color , Index : Index})
})
export default connect(mapStateToProps,mapDispatchToProps)(Chats_container)

const styles = StyleSheet.create(
    {
        arranger : {
            flexDirection : 'row',
            justifyContent : 'flex-start',
            alignItems : 'center',
            // backgroundColor : '#121212',

        } ,

        item : {
        } ,
        element : {
            flexGrow : 1 ,
       },
       category : {
           width : 0.17 * ScreenWidth,
           flexDirection : 'row',
           justifyContent : 'space-between',
           alignItems : 'center'
       }
    }
)
