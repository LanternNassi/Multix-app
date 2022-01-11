import React, { Component, useEffect } from 'react';
import {View , Text , StyleSheet,FlatList , TouchableOpacity, Image} from 'react-native';
import {Avatar , Card } from 'react-native-elements';
import {connect} from 'react-redux';
import {CirclesLoader} from 'react-native-indicator';
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import NumberFormat from 'react-number-format'




export function Notifications(props) {
    useEffect(()=>{

    },[props.state.notifications])
        return (
            <View style = {{
                flex : 1
            }}>
                <FlatList 
                    data = {props.state.Contracts_proposals}
                    horizontal = {false}
                    ItemSeparatorComponent = {
                        ()=>(
                            <View style = {styles.divider}/>
                        )
                    }
                    ListEmptyComponent = {
                        ()=>(
                            <View style = {{
                                height :0.78 * ScreenHeight,
                                width : ScreenWidth,
                                justifyContent : 'center',
                                alignItems : 'center',

                            }}>
                            <Image style = {{
                                height : 0.5*ScreenHeight,
                                width : ScreenWidth,
                                opacity : 0.3
                            }} source = {require('../../assets/no-notifications.jpg')}/>
                            </View>
                        )
                    }
                    renderItem = {
                        (item,index)=>{
                            if (item.item.notification.Type !== 'Contract'){
                                return (
                                <TouchableOpacity style = {styles.notification}>
                                <Avatar rounded source = {{uri : item.item.Applicant_info.Profile_pic }} size = {'small'} />
                                <View style = {styles.message}>
                                    <Text style = {{ fontSize : 15 }}>
                                        {item.item.notification.Message}
                                    </Text>
                                </View>

                                </TouchableOpacity>
                                )
                            }
                        }
                            
                    }
                    
                 />
            </View>
        )
    
}

let mapDispatchToProps = (dispatch) => ({

})
let mapStateToProps = (state_redux) => {
    let state = state_redux.business
    return {state}

}

export default connect( mapStateToProps , mapDispatchToProps )(Notifications)

const styles = StyleSheet.create({
    notification : {
        width : ScreenWidth,
        height : 0.1 * ScreenHeight,
        backgroundColor : 'white',
        flexDirection : 'row',
        justifyContent : 'space-evenly',
        alignItems : 'center'
    },
    message : {
        flexWrap : 'nowrap',
        maxWidth : 0.8 * ScreenWidth,
        maxHeight : 0.27 * ScreenHeight,
    },
    divider : {
        height : 0.1,
        width : 0.9 * ScreenWidth,
        borderWidth : 0.1,
    },


})