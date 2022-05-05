import React, { Component , useState , useEffect } from 'react'
import {View , Text , StyleSheet , FlatList , TouchableOpacity , ScrollView , Image} from 'react-native';
import {Avatar , Card } from 'react-native-elements';
import NumberFormat from 'react-number-format'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import { connect } from 'react-redux'

export const Approved = (props) => {
    return (
        <View style = {{ flex : 1 , justifyContent : 'center' , alignItems : 'center' }}>
             <FlatList 
                style = {{ flex : 1  }}
                data = {props.state.business.Contracts_proposals}
                contentContainerStyle = {{
                    justifyContent : 'center' , alignItems : 'center'
                }}
                ListEmptyComponent = {
                    ()=>(
                        <View style = {{
                            flex : 1,
                            flexDirection : 'column',
                            justifyContent : 'center',
                            alignItems : 'center',
                        }}>
                        <Image style = {{
                            height : 0.75 * ScreenHeight,
                            width : ScreenWidth,
                            opacity : 0.3
                        }} source = {require('../../../assets/no-business-deals.jpg')}/>
                        </View>
                    )}
                renderItem = {
                    (item,index)=>{
                      if (item.item.notification.Type !== 'Contract' &&  (item.item.Deal_info.Approved === 'Pending' || item.item.Deal_info.Approved == 'True') ){
                            if (item.item.Deal_info.Approved === 'Pending' || item.item.Deal_info.Approved == 'True'){
                                return (
                                    <View style = {styles.contract}>
                                    <View style = {styles.pics}>
                                        <Image style = {styles.gig_pic} source = {{uri : item.item.Applicant_info.Profile_pic}} />
                                        <TouchableOpacity>
                                        <Avatar source = {{uri : item.item.Gig_info.ShowCase_1 }} rounded size = {'small'} />
                                        </TouchableOpacity>
                                    </View>
                                    <View style = {{...styles.details , maxHeight : 0.27 * ScreenHeight}}>
                                        <Text style = {styles.header}> Gig : {item.item.Gig_info.Name} </Text> 
                                        <Text>Contractor : {item.item.Applicant_info.Name}</Text>
                                        <Text>Type : {item.item.notification.Type}</Text>
                                        <Text>Approved : {item.item.Deal_info.Approved ? 'true' : 'false'}</Text>
                                        <Text>Date : {item.item.Deal_info.Date_of_application.slice(0,10)}</Text>
                                        <NumberFormat value = { item.item.Deal_info.Bid_amount } displayType = {'text'}
                                            thousandSeparator = {true}
                                            prefix = {'shs.'}
                                                renderText = {(value , props) => (
                                                    <Text > {item.item.notification.Type === 'Hot deals' ? ('Bid amount : '+value) : ('Salary : ' + value)} </Text>
                                                )}
                                                />                                
                                        <TouchableOpacity style = {{
                                            backgroundColor : props.state.theme.icons_surrounding,
                                            height : 30,
                                            width : 0.45 * ScreenWidth,
                                            borderRadius : 15,
                                            flexDirection : 'row',
                                            justifyContent : 'space-around',
                                            alignItems : 'center',
                                        }}>
                                            <Text style = {{
                                                color : 'white',
                                            }}>Pending</Text>
                                        </TouchableOpacity>
                                        
                                    </View>
                                    <View style = {{
                                        height : 0.2 * ScreenHeight,
                                        width : 0.1 * ScreenWidth,
                                    }}>
                                        <Avatar rounded containerStyle = {{
                                            backgroundColor : 'green'
                                        }} icon = {{ name : 'check' , size : 17 , color :'white' }} />
                                    </View>
        
                                </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(Approved)


const styles = StyleSheet.create({
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
        maxHeight : 0.2 * ScreenHeight,
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