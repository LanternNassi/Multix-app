import React, { Component , useState , useEffect } from 'react'
import {View , Text , StyleSheet , FlatList , TouchableOpacity , ScrollView , Image} from 'react-native';
import {Avatar , Card } from 'react-native-elements';
import NumberFormat from 'react-number-format'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import { connect } from 'react-redux'

export const Approved = (props) => {
    const Approval_finished_gig = (type , gig_id , account_name , gig_name , account_id) =>{
        props.state.request_business_json({
            method : 'PUT',
            url : '/approve_finished_gig',
            data : {
                'type' : type,
                'gig_id' : gig_id,
            }
        }).then((response) => {
            if (response.status === 202){
                let data = {
                    'type' : 'Approve',
                    'name' : account_name,
                    'gig' : gig_name,
                    'account_id' : account_id 
                   
                }
                props.state.business.ws_gig_notifications.sendMessage(data)
            }
        })
    }
    return (
        <View style = {styles.container}>
                <FlatList 
                style = {styles.FlatList}
                data = {props.state.business.Contracts_proposals}
               
                ListEmptyComponent = {
                    ()=>(
                        <View style = {{
                            flex : 1,
                            flexDirection : 'column',
                            justifyContent : 'center',
                            alignItems : 'center',

                        }}>
                        <Image style = {{
                            height : 0.5*ScreenHeight,
                         
                            opacity : 0.3
                        }} source = {require('../../../assets/no-search-result.png')}/>
                        </View>
                    )
                }
                renderItem = {
                    (item,index)=>{
                        if (item.item.notification.Type === 'Contract'){
                            if ((item.item.Contract_info.Status === 'Pending' || item.item.Contract_info.Status == 'True') ){
                                return (      
                                        <View style = {styles.contract}>
                                        <View style = {styles.pics}>
                                            <Image style = {styles.gig_pic} source = {{uri : item.item.Applicant_info.Profile_pic}} />
                                            <Avatar source = {{uri : item.item.Gig_info.ShowCase_1}} rounded size = {'small'} />
                                        </View>
                                        <View style = {{...styles.details , maxHeight : 0.25 * ScreenHeight}}>
                                            <Text style = {styles.header}> Gig : {item.item.Gig_info.Name}</Text> 
                                            <Text>Contractor : You</Text>
                                            <Text>Status : {(item.item.Contract_info.Status)}</Text>
                                            <View style = {styles.edit}>
                                                <Text>Deadline : {item.item.Contract_info.Deadline}</Text>
                                                <TouchableOpacity style = {styles.pen_edit}>
                                                    <Avatar icon = {{ name : 'pencil' , type : 'font-awesome' , size : 14 , color : 'black' }} rounded/>
                                                </TouchableOpacity>
                                            </View>
                                            <View style = {styles.edit}>
                                            <NumberFormat value = { item.item.Contract_info.Negotiated_price } displayType = {'text'}
                                            thousandSeparator = {true}
                                            prefix = {'shs.'}
                                                renderText = {(value , props) => (
                                                    <Text > {item.item.notification.Type === 'Hot deals' ? ('Bid amount : '+value) : ('Negotiated_price : ' + value)} </Text>
                                                )}
                                                />        
                                                        <TouchableOpacity style = {styles.pen_edit}>
                                                    <Avatar icon = {{ name : 'pencil' , type : 'font-awesome' , size : 14 , color : 'black' }} rounded/>
                                            </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity style = {{
                                                backgroundColor : props.state.business.theme.icons_surrounding,
                                                height : 30,
                                                width : 0.45 * ScreenWidth,
                                                borderRadius : 15,
                                                flexDirection : 'row',
                                                justifyContent : 'space-around',
                                                alignItems : 'center',
                                            }}>
                                                <Text style = {{
                                                    color : 'white',
                                                }}>Confirm Completion</Text>
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
    container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center'
    },
    FlatList : {
        flex : 1,
        justifyContent :'center',
        alignItems : 'center'
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