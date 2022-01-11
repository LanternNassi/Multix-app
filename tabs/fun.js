import React , {Component} from 'react'
import {Avatar } from 'react-native-elements'
import {View , Text , TextInput , Image , Button, StyleSheet} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Header from '../constants/Header.js';
import Chats_bar from '../components/Chats_bar.js'
import Posts from './fun_tabs/Posts.js'
import Lets_connect from './fun_tabs/Lets_connect.js';
import Profile from './fun_tabs/Profile.js';
import {createAppContainer} from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import fun_database from '../redux/Database_fun_transactions.js'
import {connect} from 'react-redux';
import axios from 'axios'
import * as SQLite from 'expo-sqlite'




const Tab = createMaterialTopTabNavigator({
    Connect : {
        screen : Lets_connect,
        navigationOptions : {
            tabBarLabel : 'Connect',
        },
    
    },
    Posts : {
        screen : Posts,
        navigationOptions : {
            tabBarLabel : 'Posts',
        }},
   
    Profile : {
        screen : Profile,
        navigationOptions : {
            tabBarLabel : 'Profile',
        }},
    
}, {
    tabBarOptions : {
        showIcon : false,
        showLabel : true,
        style : {
            backgroundColor : '#006600',
            marginTop : 0,
        },
    }
});

const Navigator = createAppContainer(Tab);

export class fun extends Component {
    constructor(props){
        super(props);
    }

    state = {
        loading : false,
        open : false,
    }

    persist(){
        setTimeout(()=>{
            if (this.props.state.fun.Connected){
                let contacts = []
                const db = SQLite.openDatabase('Fun_database.db')
                db.transaction((tx)=>{
                    tx.executeSql('SELECT * FROM Chats_contacts',[],(tx,result)=>{
                        contacts = result._array
                    },(error)=>{})
                },(error)=>{},()=>{})
                console.log(this.props.state.fun.Contacts)
                fun_database.update_db_connes(this.props.state.fun.Contacts , contacts)
            }
        },1000)
    }

    componentDidMount(){
        // if (this.props.state.fun.Messages){
        this.persist()
        // }
    }
    static router = Navigator.router;
    render() {
        return(
        <View style = {{flex : 1}}>
            <Header/>
            <Lets_connect />
          </View>
        )
    }
}

let mapStateToProps = (state) => {
    return {state}
}
let mapDispatchToProps = (dispatch) => ({
    update_chat_position : (Server_id) => dispatch({type : 'update_chats_positions' , Server_id : Server_id }),
    store_online_chats : (online_chats) => dispatch({ type : 'online_chats' , Online_chats : online_chats }),
    send_message_new : (content) => dispatch({type : 'new_chats' , content : content}),
    send_message : (Index,message ) => dispatch({type : 'message_handler', content : message , Index : Index }),
    update_messages : (Name , Content) => dispatch({ type : 'update_messages' , Name : Name , Content : Content}),
    create_new_chat_position : (Values) => dispatch({ type : 'new_chats_position' , New : Values }),

})

export default connect(mapStateToProps , mapDispatchToProps)(fun)
