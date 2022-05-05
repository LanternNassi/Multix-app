import React, { Component  , useState , useEffect} from 'react'
import {StyleSheet , Text , TouchableOpacity , Button , View , FlatList , TextInput} from 'react-native'
import {Card , Avatar} from 'react-native-elements'
import { connect } from 'react-redux'
import * as Animatable from 'react-native-animatable'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as SQLite from 'expo-sqlite'
import NumberFormat from 'react-number-format'
import axios from 'axios'



const bottomsheet = {
    0 : {
        bottom : 0,
        height : 0,
        width : ScreenWidth,
        backgroundColor : 'rgba(0,0,0,0.6)'

    },
    0.5 : {
        bottom : 0,
        height : 50,
        width : ScreenWidth,
        backgroundColor : 'rgba(0,0,0,0.6)'

    },
    1 : {
        bottom : 0,
        height : 0.32 * ScreenHeight,
        width : ScreenWidth,
        backgroundColor : 'rgba(0,0,0,0.8)'
    }
}

const bottomsheet_fold = {
    0 : {
        bottom : 0,
        height : 0.32 * ScreenHeight,
        width : ScreenWidth,
        backgroundColor : 'rgba(0,0,0,0.8)'
    },
    0.5 : {
        bottom : 0,
        height : 50,
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
export const Hot = (props) => {
    const [status , Setstatus] = useState(props.status)
    const [out , Setout] = useState(true)
    const [bid , setbid] = useState(100)
    const [bidders , Setbidders] = useState(null)
    const [IsReady , SetIsReady] = useState(false)
    const submit_bid = (info) => {
        props.state.request_business_json({
            method : 'POST',
            url : 'create_bidder',
            data : {'info':info},
        }).then((response)=>{
            if (response.status === 201){
                const data = {
                    'type' : 'Bidding',
                    'gig' : status.Gig_name,
                    'Name' : status.Name,
                    'account_id' : status.Account_id,
                    'amount' : response.data['Bid_amount'],
                    'notification' : {
                        'notifier_id' : response.data['Account_id_of_customer'],
                        'Type' : 'Hot deals',
                        'Date' : response.data['Date'],
                        'Type_id' : response.data['Type_id_deal']
                    },
                    'contract_type_id' : response.data['Type_id_contract']
                }
                // console.log(data)
                props.state.ws_gig_notifications.sendMessage(data)
            }
        })
    }
    const get_bidders = (id) => {
        //console.log(id)
        props.state.request_business_json({
            method : 'GET',
            url : 'hot_deal_bidders/?id='+id,
            data : {},
        }).then((response) => {
            if (response.status === 200){
                console.log(response.data)
                Setbidders(response.data)
                SetIsReady(true)
            }
        })
    }
    useEffect(()=>{
        //console.log(status)
        get_bidders(status.Gig_id)
    },[])
    return (
        <Animatable.View animation = {out ? bottomsheet : bottomsheet_fold} style = {styles.container}>
            <View style = {styles.header}>
            <TextInput  placeholder = {'      Place your bid'} 
                     onChangeText = {
                        (text) =>{
                            setbid(text)
                        }
                    }
                     placeholderTextColor = {'white'}
                     style = {{  
                         height : 40,
                         width : 0.89 * ScreenWidth,
                         borderBottomWidth : 2,
                         color : 'white',
                         paddingBottom : 8,
                         paddingLeft : 0.1 * ScreenWidth
                         
                        }} 
                         onSubmitEditing = {
                            (event)=>{
                                const info = {}
                                info['gig_id'] = status.Gig_id
                                info['Bid_amount'] = bid
                                info['Approved'] = 'false'
                                submit_bid(info)
                            }
                        }
                      />
               
                <TouchableOpacity onPress = {
                    ()=>{
                        Setout(false)
                        setTimeout(()=>{
                            props.closer()
                        },1000)

                    }
                }>
                    <Avatar rounded icon = {{ name : 'times' , type : 'font-awesome' , color : 'white' }} size = {'medium'}  />
                </TouchableOpacity>
            </View>
            <View style = {styles.bids}>
                <View style = {{ width : 0.9 * ScreenWidth , height : 0.05 * ScreenHeight , justifyContent : 'center' , alignItems : 'center' }}>
                    <Text style = {{
                        fontSize : 23,
                        fontWeight : 'bold',
                        color : 'white'
                    }}>BIDS FOR { status.Gig_name }</Text>
                </View>
                <View style = {{ flex : 1 }}>
                    <FlatList 
                    data = {bidders}
                    style = {{flex : 1}}
                    ListEmptyComponent = {
                        ()=>(
                            <View>
                                <Text style = {{ color : 'white' , fontSize : 13, }}> No bidders yet </Text>
                            </View>
                        )
                    }
                    renderItem = {
                        (item,index)=>(
                            <TouchableOpacity style = {styles.item}>
                                <Avatar source = {{ uri : item.item.Profile_pic }} size = {'small'} rounded />
                                <Text style = {{ color : 'white' }}>{item.item.Name}</Text>
                                <NumberFormat value = { item.item.Bid_amount } displayType = {'text'}
                                    thousandSeparator = {true}
                                    prefix = {'shs.'}
                                        renderText = {(value , props) => (
                                            <Text style = {{ color : 'white' }} >{value} </Text>
                                        )}
                                        />
                                <Text style = {{color : 'white'}}>{item.item.Date_of_application.slice(0,10)}</Text>

                            </TouchableOpacity>
                        )
                    }
                    />
                </View>


            </View>
          
        </Animatable.View>
       
    )
}

const mapStateToProps = (state_redux) => {
    let state = state_redux.business
    return {state}   
}

const mapDispatchToProps = (dispatch) => ({
    open_bidders : (value) => dispatch({ type : 'close_open_bidders' , value : value })
    
})

export default connect(mapStateToProps, mapDispatchToProps)(Hot)

const styles = StyleSheet.create({
    container : {
        position : 'absolute' ,
        elevation : 20,
        justifyContent : 'space-around', 
        alignItems : 'center'
    },
    header : {
        width : ScreenWidth,
        height : 0.1 * ScreenHeight,
        flexDirection : 'row',
        justifyContent : 'flex-start',
        alignItems : 'center',
    },
    bids : {
        flex : 1,
        width : 0.9 * ScreenWidth,
        justifyContent : 'space-between',
        alignItems : 'center',
    },
    item : {
        width : 0.9 * ScreenWidth,
        height : 0.07 * ScreenHeight,
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',

    }
})