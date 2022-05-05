import React, { Component , useState , useEffect} from 'react'
import {View , Text , StyleSheet , FlatList , TouchableOpacity , ScrollView , Image} from 'react-native';
import {Avatar , Card } from 'react-native-elements';
import NumberFormat from 'react-number-format'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';

import { connect } from 'react-redux'

export const Pending = (props) => {
    return (
        <View style = {styles.container}>
                <FlatList 
                style = {styles.FlatList}
                data = {props.state.business.Contracts_proposals}
               contentContainerStyle = {{
                justifyContent :'center',
                alignItems : 'center'
               }}
                ListEmptyComponent = {
                    ()=>(
                        <View style = {{
                            height :0.5 * ScreenHeight,
                            width : ScreenWidth,
                            justifyContent : 'center',
                            alignItems : 'center',

                        }}>
                        <Image style = {{
                            height : 0.5*ScreenHeight,
                            width : ScreenWidth,
                            opacity : 0.1
                        }} source = {require('../../../assets/no-notifications.jpg')}/>
                        </View>
                    )
                }
                renderItem = {
                    (item,index)=>{
                        if (item.item.notification.Type === 'Contract'){
                            if ((item.item.Contract_info.Status === 'false' )){
                                return(
                                    <TouchableOpacity style = {styles.contract}>
                                    <View style = {styles.pics}>
                                    <Image style = {styles.gig_pic} source = {{uri : item.item.Applicant_info.Profile_pic}} />
                                            <TouchableOpacity>
                                            <Avatar source = {{uri : item.item.Gig_info.ShowCase_1 }} rounded size = {'small'} />
                                            </TouchableOpacity>
                                    </View>
                                    <View style = {styles.details}>
                                    <Text style = {styles.header}> Gig : {item.item.Gig_info.Name} </Text> 
                                            <Text>Contractor : {item.item.Applicant_info.Name}</Text>
                                            <Text>Type : {item.item.notification.Type}</Text>
                                            <Text>Approved : {item.item.Contract_info.Status}</Text>
                                            <Text>Date : {item.item.Contract_info.Date_started.slice(0,10)}</Text>
                                            <NumberFormat value = { item.item.Contract_info.Negotiated_price } displayType = {'text'}
                                                thousandSeparator = {true}
                                                prefix = {'shs.'}
                                                    renderText = {(value , props) => (
                                                        <Text > {item.item.notification.Type === 'Hot deals' ? ('Bid amount : '+value) : ('Salary : ' + value)} </Text>
                                                    )}
                                                    />        
                                    </View>
                                    <View style = {{
                                        height : 0.2 * ScreenHeight,
                                        width : 0.1 * ScreenWidth,
                                    }}>
                                        <Avatar rounded containerStyle = {{
                                            backgroundColor : 'green'
                                        }} icon = {{ name : 'check' , size : 17 , color :'white' }} />
                                    </View>
        
                                </TouchableOpacity>
        
                                )
                            }
                        }
                    }
                     
                   
                }
                />
        </View>
    )
}

const mapStateToProps = (state) => {
    return {state}
}

const mapDispatchToProps = (dispatch) =>({
    
})

export default connect(mapStateToProps, mapDispatchToProps)(Pending)

const styles =StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center'
    },
    FlatList : {
        flex : 1,
       
    },
    contract : {
        width : ScreenWidth,
        height : 0.3 * ScreenHeight,
        backgroundColor : 'white',
        flexDirection : 'row',
        justifyContent  : 'space-evenly',
        alignContent : 'flex-start',
        

    },
    contract_section : {
        maxHeight : 4 * ScreenHeight,
        width : ScreenWidth,
        
    },
    details : {
        flexDirection : 'column',
        height : 0.28 * ScreenHeight,
        maxWidth : 0.6 * ScreenWidth,
        justifyContent : 'space-between',
        alignContent : 'flex-start'
    },
    pics : {
        height : 0.3 * ScreenHeight,
        width : 0.4 * ScreenWidth,
        flexDirection : 'column',
        justifyContent : 'space-evenly',
        alignItems : 'center',
    },
    gig_pic : {
        height : 0.2 * ScreenHeight,
        width :0.35 * ScreenWidth, 
    },
    header : {
        fontSize : 19,
        fontWeight : '700',
    },
    divider : {
        height : 1,
        width : 0.9 * ScreenWidth,
        borderWidth : 0.4,
    },
    edit : {
        flexDirection : 'row',
        justifyContent : 'space-between',
        width : 0.5 * ScreenWidth,
    },
    pen_edit : {
        height : 22,
        width : 22,
        borderRadius : 11,
        justifyContent : 'center',
        alignItems : 'center',
        borderWidth : 0.5,
    },
})
