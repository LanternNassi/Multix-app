import React , {Component , useState , useEffect} from 'react'
import {Avatar , ListItem , Switch} from 'react-native-elements'
import {View , Text , TextInput , Image , Button , StyleSheet , ScrollView , Share} from 'react-native';
import Header from '../constants/Header.js'
import FileSystem from 'expo-file-system'
import * as SQLite from 'expo-sqlite';
//import SQLite from 'react-native-sqlite-storage'
import business_database from '../redux/Database_transactions.js'
import { ScreenHeight, ScreenWidth } from 'react-native-elements/dist/helpers';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux'
import * as Sharing from 'expo-sharing'
//import Share from 'react-native-share'


export function Settings(props) {
    
    useEffect(()=>{
        if (!props.business.request_business_json){
            props.create_request_instances((props.business.Business_profile.Account)?(props.business.Business_profile.Account.Multix_token) : ('000'))
        }
        //data_insertion()
    } , [])
    return (
        <View style = { styles.container }>
            <Header/>
            <ScrollView contentContainerStyle = {{ alignItems : 'center'}}style = {styles.scroll} >
                <View style = {styles.header}>
                    <View style = {styles.fun_business_pics} >
                        <View style = {{...styles.elevator , backgroundColor : props.fun.Layout_Settings.Icons_Color}} >
                            {
                                props.fun.Fun_profile.Profile_photo ? (
                                    <Avatar rounded size = {'large'} source = {{ uri : props.fun.Fun_profile.Profile_photo}}  />
                                ) : (
                                    <Avatar rounded size = {'large'} source = {require('../assets/Male_no_profile_pic.jpg')}/>
                                )
                            }
                        </View>
                        <Text style = {styles.header_text}> { props.fun.Fun_profile.Name } </Text>
                    </View>
                    {
                        props.business.Business_profile.Account ? (
                            <View style = {styles.fun_business_pics}>
                            <View style = {{...styles.elevator , backgroundColor : props.fun.Layout_Settings.Icons_Color}} >
                            <Avatar rounded size = {'large'} source = {{ uri :   props.business.Business_profile.Account.Profile_pic }}  />
                            </View>
                            <Text style = {styles.header_text} > { props.business.Business_profile.Account.Name } </Text>
    
                        </View>
                        ) : (<View/>)
                    }
                   
                </View>
                <View style = {styles.list}>
                <View style = {{ height : 0.06 * ScreenHeight ,
                        width : ScreenWidth ,
                        alignItems : 'center' , 
                        justifyContent : 'center' }}>
                    <Text style = {{ fontWeight : 'bold' }}> General Settings </Text>
                </View>

                <TouchableOpacity onPress = {
                    ()=>{
                        props.business.navigation.navigation.navigate('Layout')
                    }
                }>
                <ListItem>
                    <Avatar containerStyle = {{ backgroundColor : props.fun.Layout_Settings.Icons_surroundings }} rounded icon = {{ name : 'user-circle' , color : props.fun.Layout_Settings.Icons_Color, type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'column', justifyContent : 'space-between' }}>
                    <ListItem.Title>Custom layout </ListItem.Title>
                    <ListItem.Subtitle> Customize how the app looks </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron/>
                </ListItem>
                </TouchableOpacity>

              
                <TouchableOpacity onPress = {
                    () => {
                        if (props.business.Business_profile.Account){
                            props.business.navigation.navigation.navigate('Account Profile' , { id : null })
                        }
                    }
                }>
                <ListItem>
                    <Avatar rounded containerStyle = {{ backgroundColor : props.fun.Layout_Settings.Icons_surroundings }} icon = {{ name : 'user-circle' , color : props.fun.Layout_Settings.Icons_Color , type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'column', justifyContent : 'space-between' }}>
                    <ListItem.Title> Business Profile </ListItem.Title>
                    <ListItem.Subtitle> Have a look at how customers view your business profile </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron/>
                </ListItem>
                </TouchableOpacity>

                <TouchableOpacity>
                <ListItem>
                    <Avatar rounded containerStyle = {{ backgroundColor : props.fun.Layout_Settings.Icons_surroundings }} icon = {{ name : 'credit-card-alt' , color : props.fun.Layout_Settings.Icons_Color, type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'column', justifyContent : 'space-between' }}>
                    <ListItem.Title> Show Notifications </ListItem.Title>
                    <ListItem.Subtitle> Allow Multix to show notifications </ListItem.Subtitle>
                    </ListItem.Content>
                    <Switch value = {false} color = {'black'}/>
                </ListItem>
                </TouchableOpacity>

                <TouchableOpacity onPress = {
                    async () => {
                        const options = {
                            message : 'Check out the multix App . A cross platform messaging app and business oriented at https://www.MultixApp.com',
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
                } >
                <ListItem>
                    <Avatar rounded containerStyle = {{ backgroundColor : props.fun.Layout_Settings.Icons_surroundings }} icon = {{ name : 'share-alt' , color : props.fun.Layout_Settings.Icons_Color, type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'column', justifyContent : 'space-between' }}>
                    <ListItem.Title> Share Multix app to your friends </ListItem.Title>
                    <ListItem.Subtitle> Help the Multix app community grow </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron/>
                </ListItem>
                </TouchableOpacity>

                <TouchableOpacity onPress = {
                    () => {
                        props.business.navigation.navigation.navigate('Feedback' , { type : 'Report' })
                    }
                } >
                <ListItem>
                    <Avatar rounded containerStyle = {{ backgroundColor : props.fun.Layout_Settings.Icons_surroundings }} icon = {{ name : 'bullhorn' , color : props.fun.Layout_Settings.Icons_Color, type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'column', justifyContent : 'space-between' }}>
                    <ListItem.Title> Report an issue </ListItem.Title>
                    <ListItem.Subtitle> Found any queries ?. We shall be happy to attend to them.</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron/>
                </ListItem>
                </TouchableOpacity>

                <TouchableOpacity onPress = {
                    () => {
                        props.business.navigation.navigation.navigate('Feedback' , { type : 'Feedback' })
                    }
                } >
                <ListItem>
                    <Avatar rounded containerStyle = {{ backgroundColor : props.fun.Layout_Settings.Icons_surroundings }} icon = {{ name : 'user-circle' , color : props.fun.Layout_Settings.Icons_Color, type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'column', justifyContent : 'space-between' }}>
                    <ListItem.Title> Feed Back </ListItem.Title>
                    <ListItem.Subtitle> How are you finding the Multix app so far ? We would like to hear from you.</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron/>
                </ListItem>
                </TouchableOpacity>

                <TouchableOpacity onPress = {
                    () => {
                        props.business.navigation.navigation.navigate('Privacy Policy' )
                    }
                } >
                <ListItem>
                    <Avatar rounded containerStyle = {{ backgroundColor : props.fun.Layout_Settings.Icons_surroundings }} icon = {{ name : 'bullhorn' , color : props.fun.Layout_Settings.Icons_Color, type : 'font-awesome' }} />
                    <ListItem.Content style = {{ flexDirection : 'column', justifyContent : 'space-between' }}>
                    <ListItem.Title> Privacy Policy </ListItem.Title>
                    <ListItem.Subtitle> To get more comfortable with us, we would like you to take a minute read through our privacy policy.</ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron/>
                </ListItem>
                </TouchableOpacity>

                <View style = {{
                    height : 0.1 * ScreenHeight,
                    width : ScreenWidth,
                    justifyContent : 'center',
                    alignItems : 'center'
                }}>
                    <Text style = {{ fontSize : 14 , }}> Multix Version 1.0.0 </Text>
                    <Text style = {{ fontSize : 9 ,  }}> Special Regards to @Nessim and @Douglas </Text>
                    <Text style = {{ fontSize : 9 ,  }}> For more information contact us at Multixapp@gmail.com </Text>


                </View>

                </View>
             
            </ScrollView>
        </View>
    )
}

let mapStateToProps = (state) =>{
    let fun = state.fun
    let business = state.business
    return{fun , business}
}

let mapDispatchToProps = (dispatch) => ({
    create_request_instances : (token) => dispatch({ type : 'create_business_request_instances' , token : token })
})

export default connect(mapStateToProps , mapDispatchToProps)(Settings)

const styles = StyleSheet.create({
    container : {
        flex : 1,
    },
    scroll : {
        flex : 1,
        
    },
    header : {
        height : 0.2 * ScreenHeight,
        width : ScreenWidth,
        flexDirection : 'row',
        //backgroundColor : 'red',
        justifyContent : 'space-around',
        alignItems : 'center'
    },
    list : {
        flex : 1,
    },
    fun_business_pics : {
        height : 0.18 * ScreenHeight,
        width : 0.32 * ScreenWidth,
        flexDirection : 'column',
        justifyContent : 'space-around',
        //backgroundColor : 'violet',
        alignItems : 'center'
    },
    header_text : {
        fontSize : 14,
        fontWeight : 'bold'
    },
    elevator: {
        height : 0.13 * ScreenHeight,
        width : 0.13 * ScreenHeight,
        borderRadius : 0.5 * ( 0.13 * ScreenHeight),
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : 'white',
        elevation : 20
    }
})