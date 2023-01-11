import React , {Component,useState} from 'react'
import {Avatar} from 'react-native-elements'
import {View , Text , TextInput , Image , Button, StyleSheet , TouchableOpacity, Share} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as animatable from 'react-native-animatable';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ScreenWidth , ScreenHeight } from 'react-native-elements/dist/helpers';
import Theme from './Theme.js';
import {connect} from 'react-redux';
import * as Sharing from 'expo-sharing'



export function Header(props){
    return(
        <View style = {{...styles.container , backgroundColor : props.state.fun.Layout_Settings.Header_color}}>
                <View style = {styles.header}>
                    <View style = {{flex : 2}}>
                        <Text style = {{ fontSize : 29, marginLeft : 8, fontWeight : '800' }} >MULTIX</Text>
                    </View>
                    <View style = {{ flexDirection : 'row' , justifyContent : 'space-around' , alignItems : 'center' , flex:1.5 }}>
                        <TouchableOpacity onPress = {
                            async () => {
                                const options = {
                                    message : 'Check out the multix App . A cross platform messaging app and business oriented at https://play.google.com/store/apps/details?id=com.lantern.Multix',
                                  };
                                let sharing_possible = await Sharing.isAvailableAsync()
                                if (sharing_possible){
                                    try {
                                        const result = await Share.share(options);
                                          if (result.action === Share.sharedAction) {
                                            if (result.activityType) {
                                                console.log(result.activityType)
                                              // shared with activity type of result.activityType
                                            } else {
                                              // shared
                                            }
                                          } else if (result.action === Share.dismissedAction) {
                                              console.log('shared')
                                            // dismissed
                                          }
                                    } catch (error) {
                                        console.log(error)
                                    }
                                }
                            }
                        }>
                        <Avatar containerStyle = {{elevation : 4 , backgroundColor : props.state.fun.Layout_Settings.Icons_surroundings}} rounded size = 'small' icon = {{ name : 'share-alt' , color :props.state.fun.Layout_Settings.Icons_Color, type : 'font-awesome'  }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress = { ()=>  {}} >
                        <Avatar containerStyle = {{elevation : 4 , backgroundColor :  props.state.fun.Layout_Settings.Icons_surroundings}} rounded size = 'small' icon = {{ name : 'envelope' , color : props.state.fun.Layout_Settings.Icons_Color, type : 'font-awesome'  }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress = {()=>{
                            if(props.state.fun.Fun_profile.Profile_photo){
                                props.state.business.navigation.navigation.navigate('Full View' , {'media_type' : 'Picture' , 'media' : props.state.fun.Fun_profile.Profile_photo})
                            }
                        }} style = {{...styles.pic , backgroundColor : props.state.fun.Connected ? ('green') : ('gold') }}>
                        <Avatar containerStyle = {{elevation : 4 , backgroundColor : props.state.fun.Layout_Settings.Icons_surroundings }} rounded  size = 'small' source = { props.state.fun.Fun_profile.Profile_photo ? ({uri : props.state.fun.Fun_profile.Profile_photo}) : require('../assets/Male_no_profile_pic.jpg') }/>          
                        </TouchableOpacity>
                    </View>
                </View>
            
            </View>
    )
}
const mapStateToProps = (state_redux) => {
    let state = state_redux
    return {state};
}

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps,mapDispatchToProps)(Header)

const styles = StyleSheet.create({
    container : { 
        //backgroundColor : 'white',
        height : 70,
        width : '100%',
        top : 0,
        elevation : 5,
        
        
    } ,
    header : {
        flexDirection : 'row',
        justifyContent : 'space-between',
        alignItems : 'center',
        marginTop : 0.03 * ScreenHeight
        
    },
    pic : {
        width : 40,
        height : 40 ,
        borderRadius : 20,
        //backgroundColor : 'white',
        justifyContent : 'center',
        alignItems : 'center',
        elevation : 8 ,
    }

})




            